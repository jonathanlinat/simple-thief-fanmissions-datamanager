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

  return async (args) => {
    const { singleSource } = args

    const { recipeName, fetcherAgent, sourceUrl } = singleSource
    const { inconclusiveResponses } = crawlerConstants

    let crawlerResponse = {}

    const fanMissionHomePageFetcherOptions = {
      recipeName,
      fetcherAgent,
      documentType: 'html',
      pageType: 'fanMissionHomePage',
      path: sourceUrl + '/index.html',
      params: {}
    }
    const fetchedFanMissionHomePage = await fetcherDataHelpers(
      fanMissionHomePageFetcherOptions
    )
    const {
      status: fanMissionHomePageStatus,
      response: fanMissionHomePageResponse,
      hash: fanMissionHomePageHash
    } = fetchedFanMissionHomePage

    crawlerResponse = crawlerResponseWrapperUtilsHelpers({
      wholeObject: crawlerResponse,
      status: fanMissionHomePageStatus,
      fetcherOptions: fanMissionHomePageFetcherOptions,
      hash: fanMissionHomePageHash
    })

    if (inconclusiveResponses.includes(fanMissionHomePageStatus)) {
      return crawlerResponse
    }

    const fanMissionHomePageSelector = fanMissionHomePageResponse(
      'body div[id="mainnav"] div[class="mainnavmissions"]'
    )

    const fanMissionListingPageFetcher = async (selectedFanMission) => {
      const fanMissionSelector = fanMissionHomePageResponse(selectedFanMission)

      const fanMissionListingPageUrlSelector = fanMissionSelector.find(
        'a[href*="missions.html"]'
      )[0]

      if (fanMissionListingPageUrlSelector) {
        const fanMissionListingPageUrl =
          fanMissionListingPageUrlSelector.attribs.href.trim()

        const fanMissionListingPageFetcherOptions = {
          recipeName,
          fetcherAgent,
          documentType: 'html',
          pageType: 'fanMissionListingPage',
          path: sourceUrl + '/' + fanMissionListingPageUrl,
          params: {}
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

    const promises = Array.from(fanMissionHomePageSelector).map(
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
