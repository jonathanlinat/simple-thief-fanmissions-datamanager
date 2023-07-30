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
  const helpersShared = shared.helpers

  const crawlerResponseWrapperUtilsHelpers =
    helpersShared.utils.crawlerResponseWrapper(shared)
  const fetcherDataHelpers = helpersShared.data.fetcher(shared)

  return async (args) => {
    const { singleSource } = args

    const { recipeName, fetcherAgent, sourceUrl } = singleSource

    let crawlerResponse = {}

    const fanMissionListingPageFetcherOptions = {
      recipeName,
      fetcherAgent,
      documentType: 'html',
      pageType: 'fanMissionListingPage',
      path: sourceUrl + '/fmarchive.php',
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

    return crawlerResponse
  }
}
