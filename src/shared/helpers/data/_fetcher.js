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

  const setCacherDataHelpers = helpersShared.data.cacher.set(shared)
  const httpsDependencies = dependenciesShared.https
  const nodeFetchDependencies = dependenciesShared.nodeFetch
  const urlEncoderHelpers = helpersShared.utils.urlEncoder()
  const withQueryDependencies = dependenciesShared.withQuery

  return async (args) => {
    const { recipeName, cacheType, path, params } = args

    const encodedPath = urlEncoderHelpers({ url: path })
    const httpsAgent = new httpsDependencies.Agent({
      rejectUnauthorized: false
    })

    const fetchQuery = withQueryDependencies(encodedPath, params)
    const fetchOptions = { agent: path.includes('https') && httpsAgent }

    const cacheKeyObject = { path, params }
    const cacheOptions = { recipeName, cacheType, cacheKeyObject }
    const cacheCallback = async () => {
      const fetchedData = await nodeFetchDependencies(fetchQuery, fetchOptions)

      const fetchedDataContent = fetchedData.text()

      return fetchedDataContent
    }

    const fetcherResponse = await setCacherDataHelpers({
      cacheOptions,
      callback: cacheCallback
    })

    return fetcherResponse
  }
}
