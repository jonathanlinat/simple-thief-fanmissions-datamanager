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

  const identifier = 'Fetcher'

  const cheerioDependencies = dependenciesShared.cheerio
  const crawlerConstants = constantsShared.crawler
  const fetcherConstants = constantsShared.fetcher
  const httpsAgentInstantiatorUtilsHelpers =
    helpersShared.utils.httpsAgentInstantiator(shared)
  const messageLoggerUtilsHelpers = helpersShared.utils.messageLogger(shared, {
    identifier
  })
  const nodeFetchDependencies = dependenciesShared.nodeFetch
  const setCacherDataHelpers = helpersShared.data.cacher.set(shared)
  const socksProxyAgentInstantiatorUtilsHelpers =
    helpersShared.utils.socksProxyAgentInstantiator(shared)
  const urlEncoderHelpers = helpersShared.utils.urlEncoder()
  const UserAgentsDependencies = dependenciesShared.userAgents
  const withQueryDependencies = dependenciesShared.withQuery

  const { inconclusiveResponses } = crawlerConstants
  const { maxRetries, retryDelay } = fetcherConstants

  const fetchData = async (args) => {
    const {
      documentReference,
      documentType,
      fetchOptions,
      recipeName,
      retryCount
    } = args

    const uppercasedDocumentType = documentType.toUpperCase()

    try {
      messageLoggerUtilsHelpers({
        level: 'info',
        message: `(${recipeName}) Fetching ${uppercasedDocumentType} document '${documentReference}'...`
      })

      const fetchedData = await nodeFetchDependencies(
        documentReference,
        fetchOptions
      )
      const fetchedDataContent = await fetchedData.text()
      const fetchedDataContentSize = fetchedDataContent.length

      messageLoggerUtilsHelpers({
        level: 'info',
        message: `(${recipeName}) ${uppercasedDocumentType} document '${documentReference}' (${fetchedDataContentSize} bytes) fetched successfully`
      })

      return fetchedDataContent
    } catch (error) {
      if (retryCount >= maxRetries) {
        messageLoggerUtilsHelpers({
          level: 'error',
          message: `(${recipeName}) Despite ${maxRetries} attempts, fetching ${uppercasedDocumentType} document '${documentReference}' remained unsuccessful`
        })

        return null
      }

      const increasedRetryCount = retryCount + 1

      messageLoggerUtilsHelpers({
        level: 'info',
        message: `(${recipeName}) Retrying (${increasedRetryCount} of ${maxRetries}) to fetch ${uppercasedDocumentType} document '${documentReference}'...`
      })

      await new Promise((resolve) => setTimeout(resolve, retryDelay))

      const fetchedData = await fetchData({
        documentReference,
        documentType,
        fetchOptions,
        recipeName,
        retryCount: increasedRetryCount
      })

      return fetchedData
    }
  }

  return async (args) => {
    const { recipeName, fetcherAgent, documentType, pageType, path, params } =
      args

    let fetcherResponse = {}

    const encodedPath = urlEncoderHelpers({ url: path })
    const documentReference = withQueryDependencies(encodedPath, params)

    const fetcherAgentsList = {
      https: httpsAgentInstantiatorUtilsHelpers,
      socks: socksProxyAgentInstantiatorUtilsHelpers
    }
    const fetchOptions = {
      agent: fetcherAgentsList[fetcherAgent],
      headers: {
        'User-Agent': new UserAgentsDependencies().toString()
      }
    }

    const cacheKeyObject = { path, params }
    const cacheOptions = {
      cacheKeyObject,
      documentReference,
      documentType,
      pageType,
      recipeName
    }
    const cacheCallback = async () => {
      const retryCount = 0

      const fetchedData = await fetchData({
        documentReference,
        documentType,
        fetchOptions,
        recipeName,
        retryCount
      })

      return fetchedData
    }

    const cachedData = await setCacherDataHelpers({
      cacheOptions,
      callback: cacheCallback
    })

    const {
      status: cachedDataStatus,
      response: cachedDataResponse,
      ...restOfCachedData
    } = cachedData

    if (inconclusiveResponses.includes(cachedDataStatus)) {
      return cachedData
    }

    const loadedResponse = cheerioDependencies.load(cachedDataResponse)

    fetcherResponse = {
      status: cachedDataStatus,
      response: loadedResponse,
      ...restOfCachedData
    }

    return fetcherResponse
  }
}
