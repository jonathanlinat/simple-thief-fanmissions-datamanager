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
  clients: {
    express: {
      prefixRoute: `/api/v1`,
      port: 4000,
      timeOut: 3600000
    },
    redis: {
      host: 'memory',
      port: 6379,
      timeToLive: 21600000
    }
  },
  fetcher: {
    maxRetries: 3,
    retryDelay: 5000,
    concurrencyLimit: 6,
    tor: {
      protocol: 'socks5h',
      host: 'proxy',
      port: 9050
    }
  },
  crawler: {
    inconclusiveResponses: ['empty_document', 'unfetchable_document']
  },
  multipleSources: [
    {
      recipeName: 'thiefMissions',
      sourceName: 'Cheap Thief Missions',
      sourceUrl: 'https://www.thiefmissions.com',
      fetcherAgent: 'socks'
    },
    {
      recipeName: 'thiefTheLastGlass',
      sourceName: 'Thief - The Last GLASS',
      sourceUrl: 'https://www.ttlg.de',
      fetcherAgent: 'socks'
    },
    {
      recipeName: 'taffersParadise',
      sourceName: 'Taffers Paradise',
      sourceUrl: 'https://www.taffersparadise.co.uk',
      fetcherAgent: 'https'
    },
    {
      recipeName: 'shadowdarkKeep',
      sourceName: 'Shadowdark Keep',
      sourceUrl: 'http://www.shadowdarkkeep.com',
      fetcherAgent: 'socks'
    },
    {
      recipeName: 'theKeepOfMetalAndGold',
      sourceName: 'The Keep of Metal and Gold',
      sourceUrl: 'http://www.keepofmetalandgold.com',
      fetcherAgent: 'socks'
    }
  ]
}
