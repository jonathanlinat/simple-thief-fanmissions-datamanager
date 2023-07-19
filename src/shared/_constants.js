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
  iterationLimiter: {
    isIterationLimiterEnabled: false,
    maxIterationCount: 200
  },
  fetchOptions: {
    maxRetries: 3,
    timeBetweenRetries: 10000
  },
  clients: {
    express: {
      apiVersion: 'v1',
      port: 4000,
      timeOut: 3600000
    },
    redis: {
      host: 'memory',
      port: 6379,
      timeToLive: 21600000
    }
  },
  multipleSources: [
    {
      recipeName: 'thiefMissions',
      sourceName: 'Cheap Thief Missions',
      sourceUrl: 'https://www.thiefmissions.com'
    },
    {
      recipeName: 'thiefTheLastGlass',
      sourceName: 'Thief - The Last GLASS',
      sourceUrl: 'https://www.ttlg.de'
    },
    {
      recipeName: 'shadowDarkKeep',
      sourceName: 'Shadowdark Keep',
      sourceUrl: 'http://www.shadowdarkkeep.com'
    },
    {
      recipeName: 'theKeepOfMetalAndGold',
      sourceName: 'The Keep of Metal and Gold',
      sourceUrl: 'http://www.keepofmetalandgold.com'
    }
  ],
  languages: [
    {
      langAcronym: 'cs',
      termsList: ['Czech']
    },
    {
      langAcronym: 'de',
      termsList: ['g01', 'German']
    },
    {
      langAcronym: 'en',
      termsList: ['g02', 'English']
    },
    {
      langAcronym: 'es',
      termsList: ['Spanish']
    },
    {
      langAcronym: 'fr',
      termsList: ['g03', 'French']
    },
    {
      langAcronym: 'hu',
      termsList: ['Hungarian']
    },
    {
      langAcronym: 'it',
      termsList: ['g04', 'Italian']
    },
    {
      langAcronym: 'jp',
      termsList: ['Japanese']
    },
    {
      langAcronym: 'nl',
      termsList: ['Dutch']
    },
    {
      langAcronym: 'pl',
      termsList: ['Polish']
    },
    {
      langAcronym: 'ru',
      termsList: ['Russian']
    }
  ],
  gameIdentifiers: [
    {
      gameAcronym: 'tdp',
      termsList: [
        '1',
        'Dark Project - Der Meisterdieb',
        'Thief 1 mit NewDark-Patch',
        'Thief 1'
      ]
    },
    {
      gameAcronym: 'tg',
      termsList: ['G', 'Thief Gold mit NewDark-Patch', 'Thief Gold']
    },
    {
      gameAcronym: 'tma',
      termsList: [
        '2',
        'Thief 2 mit NewDark-Patch',
        'Dark Project 2 - The Metal Age',
        'Thief 2'
      ]
    },
    {
      gameAcronym: 'tds',
      termsList: ['3', 'Thief: Deadly Shadows', 'Thief 3']
    },
    {
      gameAcronym: 'tdm',
      termsList: ['D', 'The Dark Mod', 'Dark Mod']
    },
    {
      gameAcronym: 'ss2',
      termsList: ['Shock 2']
    }
  ]
}
