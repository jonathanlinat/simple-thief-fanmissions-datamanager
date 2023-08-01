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

  const fetcherDataHelpers = helpersShared.data.fetcher(shared)
  const responseWrapperUtilsHelpers = helpersShared.data.responseWrapper(shared)

  return async (args) => {
    const { singleSource } = args

    const { recipeName, fetcherAgent, sourceUrl } = singleSource

    let crawlerResponse = {}

    const forumsPageList = [
      {
        pageType: 'azListingForumsPage',
        params: { t: '144205', pages: [1] }
      },
      {
        pageType: 'briefSummariesForumsPage',
        params: { t: '148090', pages: [1] }
      },
      {
        pageType: 'kamyksMissionByTypeForumsPage',
        params: { t: '151394', pages: [1, 2, 3] }
      },
      {
        pageType: 'walkthroughsLootListsAndLetsPlaysForumsPage',
        params: { t: '151182', pages: [1] }
      }
    ]

    for (const forumsPage of forumsPageList) {
      const { pageType, params } = forumsPage
      const { pages, ...restOfParams } = params

      for (const page of pages) {
        const briefSummariesForumsPageFetcherOptions = {
          recipeName,
          fetcherAgent,
          documentType: 'html',
          pageType,
          path: sourceUrl + '/forums/showthread.php',
          params: { page, ...restOfParams }
        }
        const fetchedbriefSummariesForumsPage = await fetcherDataHelpers(
          briefSummariesForumsPageFetcherOptions
        )
        const {
          status: briefSummariesForumsPageStatus,
          hash: briefSummariesForumsPageHash
        } = fetchedbriefSummariesForumsPage

        crawlerResponse = responseWrapperUtilsHelpers({
          wholeObject: crawlerResponse,
          status: briefSummariesForumsPageStatus,
          ...briefSummariesForumsPageFetcherOptions,
          hash: briefSummariesForumsPageHash
        })
      }
    }

    return crawlerResponse
  }
}
