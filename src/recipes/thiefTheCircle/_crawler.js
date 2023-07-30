/**
 * MIT License
 *
 * Copyright (c) 2023 Jonathan Linat <https://github.com/jonathanlinat>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software:"), to deal
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
  const constantsShared = shared.constants
  const helpersShared = shared.helpers

  const concurrencyLimiterUtilsHelpers =
    helpersShared.utils.concurrencyLimiter(shared)
  const crawlerConstants = constantsShared.crawler
  const crawlerResponseWrapperUtilsHelpers =
    helpersShared.utils.crawlerResponseWrapper(shared)
  const fetcherDataHelpers = helpersShared.data.fetcher(shared)
  const queryParamsUtilsHelpers = helpersShared.utils.queryParamsParser(shared)

  return async (args) => {
    const { singleSource } = args

    const { recipeName, fetcherAgent, sourceUrl } = singleSource
    const { inconclusiveResponses } = crawlerConstants

    let crawlerResponse = {}

    const fanMissionInitialPageFetcherOptions = {
      recipeName,
      fetcherAgent,
      documentType: 'html',
      pageType: 'fanMissionListingPage',
      path: sourceUrl + '/missions/mission.asp',
      params: {
        numperpage: '128',
        pagenum: 1,
        sort: 'title',
        type: 'thief',
        type2: 'thief2',
        type3: 'thiefgold'
      }
    }
    const fetchedFanMissionInitialPage = await fetcherDataHelpers(
      fanMissionInitialPageFetcherOptions
    )
    const {
      status: fanMissionInitialPageStatus,
      response: fanMissionInitialPageResponse,
      hash: fanMissionInitialPageHash
    } = fetchedFanMissionInitialPage

    crawlerResponse = crawlerResponseWrapperUtilsHelpers({
      wholeObject: crawlerResponse,
      status: fanMissionInitialPageStatus,
      fetcherOptions: fanMissionInitialPageFetcherOptions,
      hash: fanMissionInitialPageHash
    })

    if (inconclusiveResponses.includes(fanMissionInitialPageStatus)) {
      return crawlerResponse
    }

    const fanMissionInitialPageSelector = fanMissionInitialPageResponse(
      'body table[class="regular"] td:contains("Jump to Page:")'
    )
      .first()
      .find('font[size="2"][face="Tahoma"]')

    console.log(fanMissionInitialPageSelector.html())

    const fanMissionListingPageFetcher = async (selectedFanMission) => {
      const fanMissionSelector =
        fanMissionInitialPageResponse(selectedFanMission)

      const fanMissionListingPageUrlSelector = fanMissionSelector.find(
        'a[href*="mission.asp"]'
      )[0]

      if (fanMissionListingPageUrlSelector) {
        const fanMissionListingPageUrl =
          fanMissionListingPageUrlSelector.attribs.href.trim()
        const fanMissionListingPageUrlQueryParams = queryParamsUtilsHelpers({
          url: fanMissionListingPageUrl
        })

        const fanMissionListingPageFetcherOptions = {
          recipeName,
          fetcherAgent,
          documentType: 'html',
          pageType: 'fanMissionListingPage',
          path: sourceUrl + '/missions/mission.asp',
          params: fanMissionListingPageUrlQueryParams
        }
        const fetchedFanMissionListingPage = await fetcherDataHelpers(
          fanMissionListingPageFetcherOptions
        )
        const {
          status: fanMissionListingPageStatus,
          hash: fanMissionListingPageHash
        } = fetchedFanMissionListingPage

        crawlerResponse = crawlerResponseWrapperUtilsHelpers({
          wholeObject: crawlerResponse,
          status: fanMissionListingPageStatus,
          fetcherOptions: fanMissionListingPageFetcherOptions,
          hash: fanMissionListingPageHash
        })
      }
    }

    const promises = Array.from(fanMissionInitialPageSelector).map(
      (selectedFanMission) =>
        concurrencyLimiterUtilsHelpers({
          promiseCallback: () =>
            fanMissionListingPageFetcher(selectedFanMission)
        })
    )

    await Promise.all(promises)

    return crawlerResponse
  }
}
