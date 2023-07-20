/**
 * MIT License
 *
 * Copyright (c) 2023 Jonathan Linat <https://github.com/jonathanlinat>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software:"), to deal
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

  const mapperDataHelpers = helpersShared.data.mapper(shared)
  const scraperDataHelpers = helpersShared.data.scraper(shared)

  return async (args) => {
    const { iterationLimiter, singleSource } = args

    const { recipeName, sourceName, sourceUrl } = singleSource
    const { isIterationLimiterEnabled, maxIterationCount } = iterationLimiter

    let iterationCounter = 0
    let wholeScrapedData = {}

    // Search page

    console.log(`[Recipes] (${sourceName}) Scraping process started...`)

    const fetchedSearchPageData = await scraperDataHelpers({
      recipeName,
      path: sourceUrl + '/fmarchive.php'
    })
    const searchPageReference = fetchedSearchPageData(
      'body table[cellspacing] tr.arch'
    )

    for (const searchPage of searchPageReference) {
      if (isIterationLimiterEnabled && iterationCounter >= maxIterationCount) {
        break
      }

      const searchPageSelector = fetchedSearchPageData(searchPage)

      const missionNameSelector = searchPageSelector.find('td:nth-child(2)')
      const missionName = missionNameSelector
        ? missionNameSelector.text().trim()
        : ''

      const detailsPageUrl = sourceUrl + '/fmarchive.php'

      const gameIdentifierSelector = searchPageSelector.find('td:nth-child(1)')
      const gameIdentifier = gameIdentifierSelector
        ? gameIdentifierSelector.text().trim()
        : ''

      const authorsSelector = searchPageSelector.find('td:nth-child(3)')
      const authors = authorsSelector
        ? authorsSelector
            .text()
            .trim()
            .split(/,/g)
            .map((author) => author.trim())
        : []

      const lastReleaseDateSelector =
        searchPageSelector.find('td:nth-child(5)').text() ||
        searchPageSelector.find('td:nth-child(4)').text()
      const lastReleaseDate = lastReleaseDateSelector
        ? lastReleaseDateSelector.trim()
        : ''

      const languages = []

      const fileNameSelector = searchPageSelector.find('td:nth-child(2) a')[0]
      const fileName = fileNameSelector
        ? fileNameSelector.attribs.href.split(/\//g).pop()
        : ''

      const fileSizeSelector = searchPageSelector.find('td:nth-child(6)')
      const fileSize = fileSizeSelector ? fileSizeSelector.text() + 'MB' : ''

      const fileUrlSelector = searchPageSelector.find('td:nth-child(2) a')[0]
      const fileUrl = fileUrlSelector
        ? sourceUrl + '/' + fileUrlSelector.attribs.href
        : ''

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

      wholeScrapedData = mapperDataHelpers({ wholeScrapedData, scrapedData })

      isIterationLimiterEnabled && iterationCounter++

      console.log(
        `[Recipes] (${sourceName}) "${scrapedData.missionName}" successfully mapped.`
      )
    }

    console.log(
      `[Recipes] (${sourceName}) Scraping process successfully ended.`
    )

    return wholeScrapedData
  }
}