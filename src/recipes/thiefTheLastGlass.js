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

  return async (iterationLimiter, singleSource) => {
    const dataMapperHelpers = helpersShared.dataMapper(shared)
    const dataScraperHelpers = helpersShared.dataScraper(shared)
    const dateFormatterHelpers = helpersShared.dateFormatter(shared)
    const functionParamsValidator = helpersShared.functionParamsValidator()
    const gameIdentifierMapperHelpers =
      helpersShared.gameIdentifierMapper(shared)
    const languageMapperHelpers = helpersShared.languageMapper(shared)
    const sizeToBytesParserHelpers = helpersShared.sizeToBytesParser(shared)
    const urlEncoderHelpers = helpersShared.urlEncoder(shared)

    functionParamsValidator([iterationLimiter, singleSource])

    const { sourceName, sourceUrl } = singleSource
    const { isIterationLimiterEnabled, maxIterationCount } = iterationLimiter

    let iterationCounter = 0
    let structuredScrappedData = {}

    try {
      // Search page

      const fetchedSearchPageData = await dataScraperHelpers(
        sourceUrl + '/index.php?fm-download',
        { orderBy: 'title' }
      )
      const searchPageReference = fetchedSearchPageData(
        'body div[id="postList"] tr:not(:first-child)'
      )

      for (const searchPage of searchPageReference) {
        if (
          isIterationLimiterEnabled &&
          iterationCounter >= maxIterationCount
        ) {
          break
        }

        const searchPageSelector = fetchedSearchPageData(searchPage)

        const name = searchPageSelector
          .find('a[href*="/index.php?fm-detail&id="]')
          .text()
          .split(' /')[0]
          .replace(/\([^()]*\)/g, '')
          .trim()
        const detailsPageUrl = searchPageSelector
          .find('a[href*="/index.php?fm-detail&id="]')[0]
          .attribs.href.trim()

        // Mission page

        const fetchedMissionPageData = await dataScraperHelpers(detailsPageUrl)
        const missionPageSelector = fetchedMissionPageData(
          'table[width][border]'
        ).first()

        const gameIdentifier = missionPageSelector
          .find('table[style] tr:contains("Spiel:") td:nth-child(2)')
          .text()
          .trim()
        const authors = missionPageSelector
          .find('table[style] tr:contains("Autor:") td:nth-child(2)')
          .text()
          .trim()
          .split(/&|\n/)
          .map((author) => author.replace(/https?:\/\/\S+/gi, '').trim())
        const lastReleaseDate = (
          missionPageSelector
            .find(
              'table[style] tr:contains("Datum des letzten Updates:") td:nth-child(2)'
            )
            .text() ||
          missionPageSelector
            .find(
              'table[style] tr:contains("Datum der Veröffentlichung:") td:nth-child(2)'
            )
            .text()
        )
          .match(/\d{4}-\d{2}-\d{2}/)[0]
          .trim()
        const fileSize = missionPageSelector
          .find('table[style] tr:contains("Speichergröße:") td:nth-child(2)')
          .text()
          .trim()
        const languages = missionPageSelector
          .find(
            'table[style] tr:contains("Vorhandene Sprachen:") td:nth-child(2)'
          )
          .find('img')
          .map((index, image) =>
            languageMapperHelpers(
              image.attribs.src.split('/').pop().split('.')[0].trim()
            )
          )
          .get()
        const fileUrl =
          sourceUrl +
          missionPageSelector
            .find(
              'table[style] tr:contains("Dateien:") td:nth-child(2) a[href*="./download/download.php"]'
            )[0]
            .attribs.href.replace('./', '/')
            .trim()

        const scrapedData = {
          authors,
          detailsPageUrl: urlEncoderHelpers(detailsPageUrl),
          fileSize: sizeToBytesParserHelpers(fileSize),
          fileUrl: urlEncoderHelpers(fileUrl),
          gameIdentifier: gameIdentifierMapperHelpers(gameIdentifier),
          languages,
          lastReleaseDate: dateFormatterHelpers(lastReleaseDate),
          name,
          sourceName
        }

        structuredScrappedData = dataMapperHelpers(
          structuredScrappedData,
          scrapedData
        )

        isIterationLimiterEnabled && iterationCounter++
      }

      return structuredScrappedData
    } catch (error) {
      console.error(error)
    }
  }
}
