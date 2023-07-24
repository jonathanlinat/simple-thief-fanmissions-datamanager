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

require('module-alias/register')

const recipes = require('@recipes')
const shared = require('@shared')

const clientsShared = shared.clients
const constantsShared = shared.constants
const helpersShared = shared.helpers

const expressClients = clientsShared.express(shared)
const expressConstants = constantsShared.clients.express
const controllerHandlerApiHelpers = helpersShared.api.controllerHandler()
const errorHandlerApiHelpers = helpersShared.api.errorHandler(shared)
const recipesSelectorApiHelpers = helpersShared.api.recipesSelector(shared, {
  recipes
})
const responseWrapperApiHelpers = helpersShared.api.responseWrapper(shared, {
  identifier: 'API'
})

;(async () => {
  const { prefixRoute } = expressConstants

  expressClients().get(
    `${prefixRoute}/crawl`,
    controllerHandlerApiHelpers({
      controller: async (request, response) => {
        const route = request.path

        const controllerResponse = await recipesSelectorApiHelpers({
          module: 'crawler'
        })

        const responseWrapper = responseWrapperApiHelpers({
          route,
          data: controllerResponse
        })

        return response.status(200).json(responseWrapper)
      }
    })
  )

  expressClients().use(errorHandlerApiHelpers)
})()
