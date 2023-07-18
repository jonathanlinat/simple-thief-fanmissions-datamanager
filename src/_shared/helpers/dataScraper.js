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
  const constantsShared = shared.constants
  const dependenciesShared = shared.dependencies
  const helpersShared = shared.helpers

  return async (recipeName, path, params) => {
    const fetchOptionsConstants = constantsShared.fetchOptions
    const cheerioDependencies = dependenciesShared.cheerio
    const httpsDependencies = dependenciesShared.https
    const nodeFetchDependencies = dependenciesShared.nodeFetch
    const withQueryDependencies = dependenciesShared.withQuery
    const dataCacher = helpersShared.dataCacher(shared)
    const functionParamsValidatorHelpers =
      helpersShared.functionParamsValidator()
    const urlEncoderHelpers = helpersShared.urlEncoder(shared)

    functionParamsValidatorHelpers('dataScraper', [recipeName, path])

    const encodedPath = urlEncoderHelpers(path)
    const fetchQuery = withQueryDependencies(encodedPath, params)

    const httpsAgent = new httpsDependencies.Agent({
      rejectUnauthorized: false
    })
    const fetchOptions = { agent: path.includes('https') && httpsAgent }

    const cacheType = 'html'
    const cacheKeyObject = { recipeName, cacheType, path, params }

    const cachedData = await dataCacher(cacheKeyObject, async () => {
      const fetchWithRetry = async (retries) => {
        try {
          const fetchData = await nodeFetchDependencies(
            fetchQuery,
            fetchOptions
          )

          if (!fetchData.ok) {
            throw new Error(`HTTP status ${fetchData.status}`)
          }

          return fetchData.text()
        } catch (error) {
          if (retries === 0) {
            throw new Error(error)
          }

          await new Promise((resolve) =>
            setTimeout(resolve, fetchOptionsConstants.timeBetweenRetries)
          )

          return fetchWithRetry(retries - 1)
        }
      }

      return await fetchWithRetry(fetchOptionsConstants.maxRetries)
    })

    const loadedData = cheerioDependencies.load(cachedData)

    return loadedData
  }
}
