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

  const languageMapperHelpers = helpersShared.utils.languageMapper(shared)
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
      path: sourceUrl + '/index.php?fm-download',
      params: { orderBy: 'title' }
    })
    const searchPageReference = fetchedSearchPageData(
      'body div[id="postList"] tr:not(:first-child)'
    )

    for (const searchPage of searchPageReference) {
      if (isIterationLimiterEnabled && iterationCounter >= maxIterationCount) {
        break
      }

      const searchPageSelector = fetchedSearchPageData(searchPage)

      const missionNameSelector = searchPageSelector.find(
        'a[href*="/index.php?fm-detail&id="]'
      )
      const missionName = missionNameSelector
        ? missionNameSelector
            .text()
            .split(/ \//g)[0]
            .replace(/\(v\d+(\.\d+)*\)/g, '')
            .trim()
        : ''

      const detailsPageUrlSelector = searchPageSelector.find(
        'a[href*="/index.php?fm-detail&id="]'
      )[0]
      const detailsPageUrl = detailsPageUrlSelector
        ? detailsPageUrlSelector.attribs.href.trim()
        : ''

      // Mission page

      const fetchedMissionPageData = await scraperDataHelpers({
        recipeName,
        path: detailsPageUrl
      })
      const missionPageSelector = fetchedMissionPageData(
        'body table[width][border]'
      ).first()

      const gameIdentifierSelector = missionPageSelector.find(
        'table[style] tr:contains("Spiel:") td:nth-child(2)'
      )
      const gameIdentifier = gameIdentifierSelector
        ? gameIdentifierSelector.text().trim()
        : ''

      const authorsSelector = missionPageSelector.find(
        'table[style] tr:contains("Autor:") td:nth-child(2)'
      )
      const authors = authorsSelector
        ? authorsSelector
            .text()
            .trim()
            .split(/&|\n/)
            .map((author) => author.replace(/https?:\/\/\S+/gi, '').trim())
        : []

      const lastReleaseDateSelector =
        missionPageSelector
          .find('table[style] tr:contains("Datum des letzten Updates:")')
          .text() ||
        missionPageSelector
          .find('table[style] tr:contains("Datum der Veröffentlichung:")')
          .text()

      const lastReleaseDate = lastReleaseDateSelector
        ? lastReleaseDateSelector.match(/\d{4}-\d{2}-\d{2}/)[0].trim()
        : ''

      const languagesSelector = missionPageSelector.find(
        'table[style] tr:contains("Vorhandene Sprachen:") td:nth-child(2) img'
      )
      const languages = languagesSelector
        ? languagesSelector
            .map((index, image) =>
              languageMapperHelpers({
                language: image.attribs.src
                  .split(/\//g)
                  .pop()
                  .split(/\./g)[0]
                  .trim()
              })
            )
            .get()
        : []

      const fileNameSelector = missionPageSelector.find(
        'table[style] tr:contains("Dateien:") td:nth-child(2) a[href*="./download/download.php"]'
      )[0]
      const fileName = fileNameSelector
        ? fileNameSelector.attribs.href.split(/file=/g)[1].trim()
        : ''

      const fileSizeSelector = missionPageSelector.find(
        'table[style] tr:contains("Speichergröße:") td:nth-child(2)'
      )
      const fileSize = fileSizeSelector ? fileSizeSelector.text().trim() : ''

      const fileUrlSelector = missionPageSelector.find(
        'table[style] tr:contains("Dateien:") td:nth-child(2) a[href*="./download/download.php"]'
      )[0]
      const fileUrl = fileUrlSelector
        ? sourceUrl + fileUrlSelector.attribs.href.replace(/\.\//g, '/').trim()
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
