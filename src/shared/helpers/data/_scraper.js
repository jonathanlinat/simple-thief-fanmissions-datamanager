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

  const cacherDataHelpers = helpersShared.data.cacher(shared)
  const cheerioDependencies = dependenciesShared.cheerio
  const fetchOptionsConstants = constantsShared.fetchOptions
  const httpsDependencies = dependenciesShared.https
  const nodeFetchDependencies = dependenciesShared.nodeFetch
  const urlEncoderHelpers = helpersShared.utils.urlEncoder()
  const withQueryDependencies = dependenciesShared.withQuery

  return async (args) => {
    const { recipeName, path, params } = args

    const encodedPath = urlEncoderHelpers({ url: path })
    const httpsAgent = new httpsDependencies.Agent({
      rejectUnauthorized: false
    })

    const fetchQuery = withQueryDependencies(encodedPath, params)
    const fetchOptions = { agent: path.includes('https') && httpsAgent }

    const cacheType = 'html'
    const cacheKeyObject = { path, params }
    const cacheOptions = { recipeName, cacheType, cacheKeyObject }

    const cachedData = await cacherDataHelpers({
      cacheOptions,
      callback: async () => {
        const fetchWithRetry = async (retries) => {
          try {
            const fetchData = await nodeFetchDependencies(
              fetchQuery,
              fetchOptions
            )

            if (!fetchData.ok) {
              throw new Error(
                `Resource "${cacheKeyObject}" couldn't be fetched after multiple retries.`
              )
            }

            const extractedFetchedData = fetchData.text()

            return extractedFetchedData
          } catch (error) {
            if (retries === 0) {
              throw new Error(error.message)
            }

            await new Promise((resolve) =>
              setTimeout(resolve, fetchOptionsConstants.timeBetweenRetries)
            )

            const fetchedWithRetry = fetchWithRetry(retries - 1)

            return fetchedWithRetry
          }
        }

        const retriedFetch = await fetchWithRetry(
          fetchOptionsConstants.maxRetries
        )

        return retriedFetch
      }
    })

    const loadedData = cheerioDependencies.load(cachedData)

    return loadedData
  }
}
