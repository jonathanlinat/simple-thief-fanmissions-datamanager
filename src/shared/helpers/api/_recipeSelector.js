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

module.exports = (shared, options) => {
  const constantsShared = shared.constants
  const helpersShared = shared.helpers

  const { recipes } = options
  const identifier = 'Recipe Selector'

  const messageLoggerUtilsHelpers = helpersShared.utils.messageLogger(shared, {
    identifier
  })
  const deepMergerUtilsHelpers = helpersShared.utils.deepMerger(shared)
  const multipleSourcesConstants = constantsShared.multipleSources

  return async (args) => {
    const { module, recipeName } = args

    const specificRecipeName = recipeName

    let recipesSelectorResponse = {}

    const singleSource = async (singleSource) => {
      const { recipeName } = singleSource

      const selectedRecipe = recipes[recipeName][module](shared)
      const selectedRecipeResponse = await selectedRecipe({ singleSource })

      recipesSelectorResponse = deepMergerUtilsHelpers({
        wholeObject: recipesSelectorResponse,
        individualObject: selectedRecipeResponse
      })
    }

    let sourcesToProcess = multipleSourcesConstants

    if (specificRecipeName) {
      const filteredSources = multipleSourcesConstants.filter((source) => {
        const { recipeName } = source

        return recipeName === specificRecipeName
      })

      if (filteredSources.length === 0) {
        throw new Error(
          `No source found for specified recipe name '${specificRecipeName}'; specify another existing one or leave the query empty`
        )
      }

      messageLoggerUtilsHelpers({
        level: 'info',
        message: `(${specificRecipeName}) Recipe selected successfully`
      })

      sourcesToProcess = filteredSources
    }

    const promises = sourcesToProcess.map(singleSource)

    await Promise.all(promises)

    return recipesSelectorResponse
  }
}
