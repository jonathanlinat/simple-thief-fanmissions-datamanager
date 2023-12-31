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

let clientInstance

module.exports = (shared) => {
  const constantsShared = shared.constants
  const dependenciesShared = shared.dependencies
  const helpersShared = shared.helpers

  const identifier = 'Server'

  const corsDependencies = dependenciesShared.cors
  const errorHandlerDependencies = dependenciesShared.errorHandler
  const expressConstants = constantsShared.clients.express
  const expressDependencies = dependenciesShared.express
  const helmetDependencies = dependenciesShared.helmet
  const messageLoggerUtilsHelpers = helpersShared.utils.messageLogger(shared, {
    identifier
  })
  const responseTimeDependencies = dependenciesShared.responseTime

  return () => {
    if (!clientInstance) {
      const { port, timeOut } = expressConstants

      clientInstance = expressDependencies()

      clientInstance.use(corsDependencies())
      clientInstance.use(errorHandlerDependencies())
      clientInstance.use(helmetDependencies())
      clientInstance.use(responseTimeDependencies())

      const listeningServer = clientInstance.listen(port, () => {
        messageLoggerUtilsHelpers({
          level: 'info',
          message: `Successfully mounted on port ${port}`
        })
      })

      listeningServer.setTimeout(timeOut)
    }

    return clientInstance
  }
}
