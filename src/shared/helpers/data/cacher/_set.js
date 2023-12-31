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
  const clientsShared = shared.clients
  const constantsShared = shared.constants
  const helpersShared = shared.helpers

  const identifier = 'Cacher:Set'

  const htmlParserHelpers = helpersShared.utils.htmlParser(shared)
  const messageLoggerUtilsHelpers = helpersShared.utils.messageLogger(shared, {
    identifier
  })
  const objectHasherHelpers = helpersShared.utils.objectHasher(shared)
  const redisClients = clientsShared.redis(shared)
  const redisConstants = constantsShared.clients.redis
  const getCacherDataHelpers = helpersShared.data.cacher.get(shared)

  return async (args) => {
    const { cacheOptions, callback } = args

    let setCacherResponse = {}

    const { timeToLive } = redisConstants
    const {
      cacheKeyObject,
      documentReference,
      documentType,
      pageType,
      recipeName
    } = cacheOptions

    const uppercasedDocumentType = documentType.toUpperCase()

    const hash = objectHasherHelpers({
      object: cacheKeyObject
    })
    const cacheKey = `${recipeName}:${documentType}:${pageType}:${hash}`

    const getCachedResponse = await getCacherDataHelpers({
      cacheKey,
      recipeName
    })
    const { status: getCacheStatus, response: getCacheResponse } =
      getCachedResponse

    if (getCacheStatus === 'specified_cachekey_found') {
      const getCacheResponseSize = getCacheResponse.length

      messageLoggerUtilsHelpers({
        level: 'info',
        message: `(${recipeName}) ${uppercasedDocumentType} document '${documentReference}' (${getCacheResponseSize} bytes) is already cached (${hash})`
      })

      setCacherResponse = {
        status: 'already_cached_document',
        response: getCacheResponse,
        hash
      }

      return setCacherResponse
    }

    messageLoggerUtilsHelpers({
      level: 'info',
      message: `(${recipeName}) ${uppercasedDocumentType} document '${documentReference}' is not cached`
    })

    messageLoggerUtilsHelpers({
      level: 'info',
      message: `(${recipeName}) Caching ${uppercasedDocumentType} document '${documentReference}'...`
    })

    const callbackResponse = await callback()

    if (callbackResponse === null) {
      setCacherResponse = {
        status: 'unfetchable_document',
        response: null,
        hash: null
      }

      return setCacherResponse
    }

    const minifiedCallbackResponse = htmlParserHelpers({
      htmlContent: callbackResponse
    })

    if (minifiedCallbackResponse === null) {
      setCacherResponse = {
        status: 'empty_document',
        response: null,
        hash: null
      }

      return setCacherResponse
    }

    const minifiedCallbackResponseSize = minifiedCallbackResponse.length

    await redisClients().set(cacheKey, minifiedCallbackResponse)

    if (timeToLive !== 0) {
      await redisClients().expire(cacheKey, timeToLive)
    }

    messageLoggerUtilsHelpers({
      level: 'info',
      message: `(${recipeName}) ${uppercasedDocumentType} document '${documentReference}' (${minifiedCallbackResponseSize} bytes) cached successfully (${hash})`
    })

    setCacherResponse = {
      status: 'recently_cached_document',
      response: minifiedCallbackResponse,
      hash
    }

    return setCacherResponse
  }
}
