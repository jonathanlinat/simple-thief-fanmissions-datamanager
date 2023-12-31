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

module.exports = {
  bottleneck: require('bottleneck'),
  cheerio: require('cheerio'),
  cors: require('cors'),
  deepMerge: require('deepmerge'),
  errorHandler: require('errorhandler'),
  express: require('express'),
  helmet: require('helmet'),
  htmlMinifier: require('html-minifier'),
  https: require('https'),
  ioredis: require('ioredis'),
  jsDom: require('jsdom'),
  nodeFetch: (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args)),
  nodeObjectHash: require('node-object-hash'),
  queryString: require('querystring'),
  socksProxyAgent: require('socks-proxy-agent'),
  pino: require('pino'),
  pinoPretty: require('pino-pretty'),
  responseTime: require('response-time'),
  url: require('url'),
  userAgents: require('user-agents'),
  withQuery: require('with-query').default
}
