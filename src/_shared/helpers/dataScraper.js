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

  return async (path, params) => {
    const cheerioDependencies = dependenciesShared.cheerio
    const fetchDependencies = dependenciesShared.fetch
    const httpsDependencies = dependenciesShared.https
    const functionParamsValidator = helpersShared.functionParamsValidator()
    const urlEncoderHelpers = helpersShared.urlEncoder(shared)
    const withQueryDependencies = dependenciesShared.withQuery

    functionParamsValidator([path])

    const httpsAgent = new httpsDependencies.Agent({
      rejectUnauthorized: false
    })
    const fetchOptions = { agent: path.includes('https') && httpsAgent }

    const fetchedData = await fetchDependencies(
      withQueryDependencies(urlEncoderHelpers(path), params),
      fetchOptions
    )
    const bodyOfFetchedData = await fetchedData.text()
    const cachedData = cheerioDependencies.load(bodyOfFetchedData)

    return cachedData
  }
}
