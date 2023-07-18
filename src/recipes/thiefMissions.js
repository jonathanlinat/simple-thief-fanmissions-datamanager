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
  const helpersShared = shared.helpers

  return async (iterationLimiter, singleSource) => {
    const dataMapperHelpers = helpersShared.dataMapper(shared)
    const dataScraperHelpers = helpersShared.dataScraper(shared)
    const functionParamsValidatorHelpers =
      helpersShared.functionParamsValidator()
    const languageMapperHelpers = helpersShared.languageMapper(shared)

    functionParamsValidatorHelpers('thiefMissions', [
      iterationLimiter,
      singleSource
    ])

    const { recipeName, sourceName, sourceUrl } = singleSource
    const { isIterationLimiterEnabled, maxIterationCount } = iterationLimiter

    let iterationCounter = 0
    let structuredScrapedData = {}

    try {
      // Search page

      const fetchedSearchPageData = await dataScraperHelpers(
        recipeName,
        sourceUrl + '/search.cgi',
        { search: '', sort: 'title' }
      )
      const searchPageReference = fetchedSearchPageData('body tr[bgcolor]')

      for (const searchPage of searchPageReference) {
        if (
          isIterationLimiterEnabled &&
          iterationCounter >= maxIterationCount
        ) {
          break
        }

        try {
          const searchPageSelector = fetchedSearchPageData(searchPage)

          const missionName = searchPageSelector
            .find('td:nth-child(1)')
            .text()
            .trim()
          const detailsPageUrl =
            sourceUrl +
            searchPageSelector.find('a[href*="/m/"]')[0].attribs.href.trim()

          // Mission page

          const fetchedMissionPageData = await dataScraperHelpers(
            recipeName,
            detailsPageUrl
          )
          const missionPageSelector = fetchedMissionPageData('body')

          const isFileUnavailable = Boolean(
            missionPageSelector
              .find('tr td.error:contains("File unavailable")')
              .html()
          )

          const gameIdentifier = missionPageSelector
            .find('tr:contains("Game") td:nth-child(2)')
            .text()
            .match(/^(.*?)\([^)]+\)/)[1]
            .trim()
          const authors = missionPageSelector
            .find('tr:contains("Author") td:nth-child(2)')
            .text()
            .trim()
            .split(/[/,]/g)
            .map((author) =>
              author
                .replace(/\(missions by this author\)|\(homepage\)/g, '')
                .trim()
            )
          const lastReleaseDate = missionPageSelector
            .find('tr:contains("Released") td:nth-child(2)')
            .text()
            .match(/\d{4}\.\d{2}\.\d{2}/)[0]
            .replace(/\./g, '-')
            .trim()
          const languages = missionPageSelector
            .find('tr:contains("Languages") td:nth-child(2)')
            .text()
            .split(/\s/g)
            .map((language) => languageMapperHelpers(language.trim()))
          const fileName = isFileUnavailable
            ? ''
            : missionPageSelector
                .find('tr:contains("File") td:nth-child(2)')
                .text()
                .trim()
          const fileSize = isFileUnavailable
            ? ''
            : missionPageSelector
                .find('tr:contains("Size") td:nth-child(2)')
                .text()
                .match(/^\s*([^()\s]+)/)[1]
                .trim()
          const fileUrl = isFileUnavailable
            ? ''
            : sourceUrl +
              missionPageSelector
                .find('a[href*="/download.cgi?m="]')[0]
                .attribs.href.trim()

          const scrapedData = {
            authors,
            detailsPageUrl,
            fileName,
            fileSize,
            fileUrl,
            gameIdentifier,
            languages,
            lastReleaseDate,
            missionName,
            sourceName,
            sourceUrl
          }

          structuredScrapedData = dataMapperHelpers(
            structuredScrapedData,
            scrapedData
          )
        } catch (error) {
          console.error(error)
        }

        isIterationLimiterEnabled && iterationCounter++
      }

      return structuredScrapedData
    } catch (error) {
      console.error(error)
    }
  }
}
