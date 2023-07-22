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

const clientsShared = shared.clients
const constantsShared = shared.constants
const helpersShared = shared.helpers
const crawlerModules = modules.crawler(shared, recipes)

const expressClients = clientsShared.express(shared)
const expressConstants = constantsShared.clients.express
const routeCallbackApiHelpers = helpersShared.api.routeCallback(shared)

/*
  1.  Create a custom Error class to pass more precise details

  2.  TBD: Add try...catch where needed and use the custom Error class to better handle messages

  3.  Use the wrappedResponse API helper to return an object with the status of the execution of the module, recipe, helper:

      const internalResponseDetails = {
        cacher: {
          status: "OK",
          processed_at: "2023-07-22T03:05:00.642Z",
          data: {
            cacheKey: "shadowdarkKeep:html:12d0493b828e09e34cd5a861c4f5abe1967775c8c8cf86b1489c1940d31827ce"
          }
        },
        fetcher: {
          status: "OK",
          processed_at: "2023-07-22T03:05:00.642Z",
          data: {}
        },
        recipe: {
          status: "OK",
          processed_at: "2023-07-22T03:05:00.642Z",
          data: {}
        },
        crawler: {
          status: "OK",
          processed_at: "2023-07-22T03:05:00.642Z",
          data: {}
        }
      }

  4.  Think about the structure of the JSOn document that needs to be created and cached in Redis,
      which represents the cached keys and will be used to scrape the data in the future

  5.  Create a subroute to crawl only a specific website and add the optional query param to select a specific game

  6.  Modify the current crawl route to request authentication

  7.  Create an authenticated route to flush the Redis DB

  8.  Think about how to handle failed crawls:
      - a console message must be sent
      - the loop must not be broke
      - the main response must give the list of failed crawled sources
*/

;(async () => {
  const { prefixRoute } = expressConstants

  expressClients().get(`${prefixRoute}/crawl`, async (request, response) => {
    const route = 'crawl'
    const callback = crawlerModules

    await routeCallbackApiHelpers({ response, route, callback })
  })
})()
