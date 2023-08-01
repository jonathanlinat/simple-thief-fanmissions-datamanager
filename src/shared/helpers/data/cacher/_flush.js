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
  const helpersShared = shared.helpers

  const identifier = 'Cacher:Flush'

  const messageLoggerUtilsHelpers = helpersShared.utils.messageLogger(shared, {
    identifier
  })
  const redisClients = clientsShared.redis(shared)
  const responseWrapperUtilsHelpers = helpersShared.data.responseWrapper(shared)

  return async (args) => {
    const { recipeName } = args

    let flushCacherResponse = {}

    if (!recipeName) {
      await redisClients().flushall()

      messageLoggerUtilsHelpers({
        level: 'info',
        message: 'All cache keys flushed successfully'
      })

      flushCacherResponse = responseWrapperUtilsHelpers({
        wholeObject: flushCacherResponse,
        status: 'all_cachekeys_flushed'
      })

      return flushCacherResponse
    }

    let cursor = '0'
    const pattern = `${recipeName}:*`

    const pipeline = redisClients().pipeline()

    let wholeCacheKeys = []

    do {
      const clientResponse = await redisClients().scan(cursor, 'MATCH', pattern)
      cursor = clientResponse[0]
      const cacheKeys = clientResponse[1]

      wholeCacheKeys.push(cacheKeys)

      if (cacheKeys.length > 0) {
        cacheKeys.forEach((key) => {
          pipeline.del(key)
        })
      }
    } while (cursor !== '0')

    await pipeline.exec()

    wholeCacheKeys = wholeCacheKeys.flat()

    messageLoggerUtilsHelpers({
      level: 'info',
      message: `(${recipeName}) All related cache keys flushed successfully`
    })

    flushCacherResponse = responseWrapperUtilsHelpers({
      wholeObject: flushCacherResponse,
      status: 'all_related_cachekeys_flushed',
      ...wholeCacheKeys
    })

    return flushCacherResponse
  }
}
