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

module.exports = (recipes, shared) => {
  const constantsShared = shared.constants
  const dependenciesShared = shared.dependencies
  const helpersShared = shared.helpers
  const recipesShared = recipes

  return async () => {
    const flattedDependencies = dependenciesShared.flatted
    const iterationLimiterConstants = constantsShared.iterationLimiter
    const mergerDataHelpers = helpersShared.data.merger(shared)
    const multipleSourcesConstants = constantsShared.multipleSources

    let wholestructuredScrapedData = {}

    const promises = multipleSourcesConstants.map(async (singleSource) => {
      const recipeName = singleSource.recipeName
      const getstructuredScrapedData = recipesShared[recipeName](shared)

      const structuredScrapedData = await getstructuredScrapedData(
        iterationLimiterConstants,
        singleSource
      )

      wholestructuredScrapedData = mergerDataHelpers(
        wholestructuredScrapedData,
        structuredScrapedData
      )
    })

    await Promise.all(promises)

    const stringifiedWholestructuredScrapedData = flattedDependencies.stringify(
      wholestructuredScrapedData
    )

    return stringifiedWholestructuredScrapedData
  }
}