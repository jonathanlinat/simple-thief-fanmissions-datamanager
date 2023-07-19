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

  return (scrapedData) => {
    const dateFormatterHelpers = helpersShared.utils.dateFormatter(shared)
    const functionParamsValidatorHelpers =
      helpersShared.utils.functionParamsValidator()
    const gameIdentifierMapperHelpers =
      helpersShared.utils.gameIdentifierMapper(shared)
    const sizeToBytesParserHelpers =
      helpersShared.utils.sizeToBytesParser(shared)
    const urlEncoderHelpers = helpersShared.utils.urlEncoder(shared)

    functionParamsValidatorHelpers('parserDataHelpers', [scrapedData])

    const {
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
    } = scrapedData

    const parsedData = {
      authors: authors || [],
      detailsPageUrl: detailsPageUrl ? urlEncoderHelpers(detailsPageUrl) : '',
      fileName: fileName || '',
      fileSize: fileSize ? sizeToBytesParserHelpers(fileSize) : 0,
      fileUrl: fileUrl ? urlEncoderHelpers(fileUrl) : '',
      gameIdentifier: gameIdentifier
        ? gameIdentifierMapperHelpers(gameIdentifier)
        : '',
      languages: languages || [],
      lastReleaseDate: lastReleaseDate
        ? dateFormatterHelpers(lastReleaseDate)
        : '',
      missionName: missionName || '',
      sourceName: sourceName || '',
      sourceUrl: sourceUrl || ''
    }

    return parsedData
  }
}
