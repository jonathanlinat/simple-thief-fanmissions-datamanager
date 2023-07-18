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

  return (scrapedData) => {
    const functionParamsValidatorHelpers =
      helpersShared.functionParamsValidator()
    const joiDependencies = dependenciesShared.joi

    functionParamsValidatorHelpers('dataValidator', [scrapedData])

    const structuredSchema = joiDependencies.object({
      authors: joiDependencies
        .array()
        .items(joiDependencies.string().allow(''))
        .sparse(),
      detailsPageUrl: joiDependencies.string().allow(''),
      fileName: joiDependencies.string().allow(''),
      fileSize: joiDependencies.string().allow(''),
      fileUrl: joiDependencies.string().allow(''),
      gameIdentifier: joiDependencies.string().allow(''),
      languages: joiDependencies
        .array()
        .items(joiDependencies.string().allow(''))
        .sparse(),
      lastReleaseDate: joiDependencies.string().allow(''),
      missionName: joiDependencies.string().allow(''),
      sourceName: joiDependencies.string().allow(''),
      sourceUrl: joiDependencies.string().allow('')
    })

    const { error } = structuredSchema.validate(scrapedData)

    if (error) {
      throw new Error(`Data validation failed: ${error.message}`)
    }

    return scrapedData
  }
}
