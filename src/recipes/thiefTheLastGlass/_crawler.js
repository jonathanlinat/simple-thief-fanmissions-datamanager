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

    const { recipeName, sourceUrl } = singleSource
    const { inconclusiveResponses } = crawlerConstants

    let crawlerResponse = {}

    const fanMissionListingPageFetcherOptions = {
      recipeName,
      documentType: 'html',
      pageType: 'fanMissionListingPage',
      path: sourceUrl + '/index.php?fm-download',
      params: { orderBy: 'title' }
    }
    const fetchedFanMissionListingPage = await fetcherDataHelpers(
      fanMissionListingPageFetcherOptions
    )
    const {
      status: fanMissionListingPageStatus,
      response: fanMissionListingPageResponse,
      hash: fanMissionListingPageHash
    } = fetchedFanMissionListingPage

    crawlerResponse = crawlerResponseWrapperUtilsHelpers({
      wholeObject: crawlerResponse,
      status: fanMissionListingPageStatus,
      fetcherOptions: fanMissionListingPageFetcherOptions,
      hash: fanMissionListingPageHash
    })

    if (inconclusiveResponses.includes(fanMissionListingPageStatus)) {
      return crawlerResponse
    }

    const fanMissionListingPageSelector = fanMissionListingPageResponse(
      'body div[id="postList"] tr:not(:first-child)'
    )

    const fanMissionDetailsPageFetcher = async (selectedFanMission) => {
      const fanMissionSelector =
        fanMissionListingPageResponse(selectedFanMission)

      const fanMissionDetailPageUrlSelector = fanMissionSelector.find(
        'a[href*="/index.php?fm-detail&id="]'
      )[0]
      const fanMissionDetailPageUrl =
        fanMissionDetailPageUrlSelector.attribs.href.trim()

      const fanMissionDetailPageFetcherOptions = {
        recipeName,
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

      crawlerResponse = crawlerResponseWrapperUtilsHelpers({
        wholeObject: crawlerResponse,
        status: fanMissionDetailPageStatus,
        fetcherOptions: fanMissionDetailPageFetcherOptions,
        hash: fanMissionDetailPageHash
      })
    }

    const promises = Array.from(fanMissionListingPageSelector).map(
      (selectedFanMission) =>
        concurrencyLimiterUtilsHelpers({
          promiseCallback: () =>
            fanMissionDetailsPageFetcher(selectedFanMission)
        })
    )

    await Promise.all(promises)

    return crawlerResponse
  }
}
