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
  const responseWrapperUtilsHelpers = helpersShared.data.responseWrapper(shared)
  const fetcherDataHelpers = helpersShared.data.fetcher(shared)

  return async (args) => {
    const { singleSource } = args

    const { recipeName, fetcherAgent, sourceUrl } = singleSource
    const { inconclusiveResponses } = crawlerConstants

    let crawlerResponse = {}

    const fanMissionListingPageFetcherOptions = {
      recipeName,
      fetcherAgent,
      documentType: 'html',
      pageType: 'fanMissionListingPage',
      path: sourceUrl + '/search.cgi',
      params: { search: '', sort: 'title' }
    }
    const fetchedFanMissionListingPage = await fetcherDataHelpers(
      fanMissionListingPageFetcherOptions
    )
    const {
      status: fanMissionListingPageStatus,
      response: fanMissionListingPageResponse,
      hash: fanMissionListingPageHash
    } = fetchedFanMissionListingPage

    crawlerResponse = responseWrapperUtilsHelpers({
      wholeObject: crawlerResponse,
      status: fanMissionListingPageStatus,
      ...fanMissionListingPageFetcherOptions,
      hash: fanMissionListingPageHash
    })

    if (inconclusiveResponses.includes(fanMissionListingPageStatus)) {
      return crawlerResponse
    }

    const fanMissionListingPageSelector =
      fanMissionListingPageResponse('body tr[bgcolor]')

    const fanMissionDetailPageFetcher = async (selectedFanMission) => {
      const fanMissionSelector =
        fanMissionListingPageResponse(selectedFanMission)

      const fanMissionDetailPageUrlSelector =
        fanMissionSelector.find('a[href*="/m/"]')[0]

      if (fanMissionDetailPageUrlSelector) {
        const fanMissionDetailPageUrl =
          sourceUrl + fanMissionDetailPageUrlSelector.attribs.href.trim()

        const fanMissionDetailPageFetcherOptions = {
          recipeName,
          fetcherAgent,
          documentType: 'html',
          pageType: 'fanMissionDetailPage',
          path: fanMissionDetailPageUrl,
          params: {}
        }
        const fetchedFanMissionDetailPage = await fetcherDataHelpers(
          fanMissionDetailPageFetcherOptions
        )
        const {
          status: fanMissionDetailPageStatus,
          hash: fanMissionDetailPageHash
        } = fetchedFanMissionDetailPage

        crawlerResponse = responseWrapperUtilsHelpers({
          wholeObject: crawlerResponse,
          status: fanMissionDetailPageStatus,
          ...fanMissionDetailPageFetcherOptions,
          hash: fanMissionDetailPageHash
        })
      }
    }

    const promises = Array.from(fanMissionListingPageSelector).map(
      (selectedFanMission) =>
        concurrencyLimiterUtilsHelpers({
          promiseCallback: () => fanMissionDetailPageFetcher(selectedFanMission)
        })
    )

    await Promise.all(promises)

    return crawlerResponse
  }
}
