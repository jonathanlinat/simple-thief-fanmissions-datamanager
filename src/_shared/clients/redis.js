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

let memory

module.exports = (shared) => {
  const constantsShared = shared.constants
  const dependenciesShared = shared.dependencies

  return () => {
    if (!memory) {
      const redisConstants = constantsShared.clients.redis
      const RedisDependencies = dependenciesShared.ioRedis

      memory = new RedisDependencies({
        host: redisConstants.host,
        port: redisConstants.port
      })

      memory.on('ready', () => {
        console.log(
          `[Memory] Successfully connected to host ${redisConstants.host} on port ${redisConstants.port}`
        )
      })

      memory.on('error', (error) => {
        throw new Error(
          `[Memory] Ups! Something went wrong... ${error.message}`
        )
      })

      memory.on('close', () => {
        console.log(
          `[Memory] Successfully disconnected from host ${redisConstants.host} on port ${redisConstants.port}`
        )
      })
    }

    return memory
  }
}
