/**
 * MIT License
 *
 * Copyright (c) 2023 Jonathan Linat <https://github.com/jonathanlinat>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

module.exports = (shared) => {
  return async (iterationLimiter, singleSource) => {
    const helpersShared = shared.helpers

    const contentLengthFetcherHelpers =
      helpersShared.contentLengthFetcher(shared)
    const dataMapperHelpers = helpersShared.dataMapper(shared)
    const dataScraperHelpers = helpersShared.dataScraper(shared)
    const dateFormatterHelpers = helpersShared.dateFormatter()
    const gameIdentifierMapperHelpers =
      helpersShared.gameIdentifierMapper(shared)
    const languageMapperHelpers = helpersShared.languageMapper(shared)
    const urlEncoderHelpers = helpersShared.urlEncoder()

    const { sourceName, baseUrl } = singleSource
    const { isIterationLimiterEnabled, maxIterationCount } = iterationLimiter

    let iterationCounter = 0
    let structuredScrappedData = {}

    // Search page

    const fetchedSearchPageData = await dataScraperHelpers(
      baseUrl + '/search.cgi',
      { search: '', sort: 'title' }
    )
    const searchPageReference = fetchedSearchPageData('tr[bgcolor]')

    for (const searchPage of searchPageReference) {
      if (isIterationLimiterEnabled && iterationCounter >= maxIterationCount)
        break

      const searchPageSelector = fetchedSearchPageData(searchPage)

      const author = searchPageSelector.find('td:nth-child(2)').text() ?? ''
      const fileName =
        searchPageSelector
          .find('a[href*="/m/"]')[0]
          .attribs.href.split('/')
          .pop() ?? ''
      const gameIdentifier =
        gameIdentifierMapperHelpers(
          searchPageSelector.find('td:nth-child(10)').text()
        ) ?? ''
      const name = searchPageSelector.find('td:nth-child(1)').text() ?? ''
      const pageDetailsUrl =
        urlEncoderHelpers(
          singleSource,
          searchPageSelector.find('a[href*="/m/"]')[0].attribs.href
        ) ?? ''
      const releaseDate =
        dateFormatterHelpers(
          searchPageSelector.find('td:nth-child(3)').text().replace(/\./g, '-')
        ) ?? ''

      // Mission page

      const fetchedMissionPageData = await dataScraperHelpers(
        baseUrl + '/m/' + fileName
      )
      const missionPageSelector = fetchedMissionPageData(
        'table[cellspacing][cellpadding]'
      ).first()

      const languages =
        missionPageSelector
          .find("tr:contains('Languages') td:nth-child(2)")
          .text()
          .split(' ')
          .map((language) => languageMapperHelpers(language)) ?? []

      // Download page

      const fetchedDownloadPageData = await dataScraperHelpers(
        baseUrl + '/download.cgi',
        { m: fileName, noredir: 1 }
      )
      const downloadPageSelector = fetchedDownloadPageData('body')

      const fileUrl =
        urlEncoderHelpers(
          singleSource,
          downloadPageSelector.find('a[href*="/dl/"]')[0].attribs.href
        ) ?? ''
      const fileSize = await contentLengthFetcherHelpers(fileUrl)

      const scrapedData = {
        author,
        fileSize,
        fileUrl,
        gameIdentifier,
        languages,
        name,
        pageDetailsUrl,
        releaseDate,
        sourceName
      }

      structuredScrappedData = dataMapperHelpers(
        structuredScrappedData,
        scrapedData
      )

      isIterationLimiterEnabled && iterationCounter++
    }

    return structuredScrappedData
  }
}
