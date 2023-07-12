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
    isIterationLimiterEnabled: true,
    maxIterationCount: 2
  },
  languages: [
    {
      acronym: 'cs',
      termsList: ['Czech']
    },
    {
      acronym: 'en',
      termsList: ['English']
    },
    {
      acronym: 'es',
      termsList: ['Spanish']
    },
    {
      acronym: 'fr',
      termsList: ['French']
    },
    {
      acronym: 'hu',
      termsList: ['Hungarian']
    },
    {
      acronym: 'it',
      termsList: ['Italian']
    },
    {
      acronym: 'jp',
      termsList: ['Japanese']
    },
    {
      acronym: 'nl',
      termsList: ['Dutch']
    },
    {
      acronym: 'pl',
      termsList: ['Polish']
    },
    {
      acronym: 'ru',
      termsList: ['Russian']
    }
  ],
  gameIdentifiers: [
    {
      acronym: 'tdp',
      termsList: ['Thief 1']
    },
    {
      acronym: 'tg',
      termsList: ['Thief Gold']
    },
    {
      acronym: 'tma',
      termsList: ['Thief 2']
    },
    {
      acronym: 'tds',
      termsList: ['Thief 3']
    },
    {
      acronym: 'tdm',
      termsList: ['Dark Mod']
    },
    {
      acronym: 'ss2',
      termsList: ['Shock 2']
    }
  ],
  multipleSources: [
    {
      recipeName: 'thiefMissions',
      sourceName: 'Cheap Thief Missions',
      baseUrl: 'thiefmissions.com',
      protocol: 'https://'
    }
  ]
}
