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
  const dependenciesShared = shared.dependencies
  const helpersShared = shared.helpers

  const generateTimestampUtilsHelpers = helpersShared.utils.generateTimestamp()
  const mergerDataHelpers = helpersShared.data.merger(shared)
  const parserDataHelpers = helpersShared.data.parser(shared)
  const uuidDependencies = dependenciesShared.uuid
  const validatorDataHelpers = helpersShared.data.validator(shared)

  return (args) => {
    const { wholeScrapedData, scrapedData } = args

    const validatedData = validatorDataHelpers({ scrapedData })
    const parsedData = parserDataHelpers({
      scrapedData: validatedData
    })

    const {
      gameIdentifier,
      missionName,
      fileName,
      fileSize,
      fileUrl,
      sourceName,
      sourceUrl,
      ...restOfParsedData
    } = parsedData

    const structuredData = {
      [gameIdentifier]: [
        {
          _id: uuidDependencies.v4(),
          created_at: generateTimestampUtilsHelpers(),
          data: {
            name: missionName,
            file: {
              name: fileName,
              size: fileSize,
              url: fileUrl
            },
            source: {
              name: sourceName,
              url: sourceUrl
            },
            ...restOfParsedData
          }
        }
      ]
    }

    const mappedData = mergerDataHelpers({
      wholeScrapedData,
      scrapedData: structuredData
    })

    return mappedData
  }
}
