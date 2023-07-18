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

const modules = require('@modules')
const recipes = require('@recipes')
const shared = require('@shared')

;(async () => {
  const scraperModules = modules.scraper(recipes, shared)
  const clientsShared = shared.clients
  const constantsShared = shared.constants
  const dependenciesShared = shared.dependencies
  const helpersShared = shared.helpers

  const expressConstants = constantsShared.clients.express
  const expressClients = clientsShared.express(shared)
  const flattedDependencies = dependenciesShared.flatted
  const generateTimestampHelpers = helpersShared.generateTimestamp()

  expressClients().get(
    `/api/${expressConstants.apiVersion}/scrape`,
    async (request, response) => {
      const wrappedResponse = (data) => ({
        scrape: {
          processed_at: generateTimestampHelpers(),
          data
        }
      })

      try {
        const scrapedData = await scraperModules()
        const wrappedAndParsedResponse = wrappedResponse(
          flattedDependencies.parse(scrapedData)
        )

        response.json(wrappedAndParsedResponse)
      } catch (error) {
        response.json(`Oh no! Something went wrong: "${error.message}"`)
      }
    }
  )
})()
