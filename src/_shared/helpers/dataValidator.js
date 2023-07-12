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
  return (scrapedData) => {
    const dependenciesShared = shared.dependencies

    const joiDependencies = dependenciesShared.joi

    const structuredSchema = joiDependencies.object({
      author: joiDependencies.string().required(),
      fileSize: joiDependencies.number().required(),
      fileUrl: joiDependencies.string().uri().required(),
      gameIdentifier: joiDependencies.string().required(),
      languages: joiDependencies
        .array()
        .items(joiDependencies.string())
        .required(),
      name: joiDependencies.string().required(),
      pageDetailsUrl: joiDependencies.string().uri().required(),
      releaseDate: joiDependencies.date().iso().required(),
      sourceName: joiDependencies.string().required()
    })

    const { error } = structuredSchema.validate(scrapedData)

    if (error) {
      throw new Error(`Data validation failed: ${error.message}`)
    }

    return scrapedData
  }
}
