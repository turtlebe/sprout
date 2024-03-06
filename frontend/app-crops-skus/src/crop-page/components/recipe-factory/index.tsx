import {
  isRecipeWithListSettings,
  isRecipeWithSingleSetting,
  isRecipeWithTableSettings,
} from '@plentyag/app-crops-skus/src/common/types';
import { cropsTableCols } from '@plentyag/app-crops-skus/src/crops-page/utils/crops-table-cols';
import { Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { Recipe } from '@plentyag/core/src/farm-def/types';
import React from 'react';

import { RecipeSingleSetting, RecipeTable } from './components';
import { RecipeList } from './components/recipe-list';

const dataTestIds = {
  table: 'recipe-card-factory-table',
  list: 'recipe-card-factory-list',
  singleSetting: 'recipe-card-factory-single-setting',
  error: 'recipe-card-factory-single-error',
};

export { dataTestIds as dataTestIdsRecipeFactory };

export interface RecipeFactory {
  recipeName: string;
  recipe: Recipe;
}

/**
 * This components renders the appropriate card items for the given recipe.
 * Three types are supported:
 *  - table of settings: RecipeTable
 *  - list of settings: RecipeList (recursive)
 *  - single setting: RecipeSingleSetting
 */
export const RecipeFactory: React.FC<RecipeFactory> = ({ recipeName, recipe }) => {
  if (
    (recipeName === 'propIrrigationSchedule' || recipeName === 'irrigationSchedule') &&
    isRecipeWithTableSettings(recipe)
  ) {
    // special case handling to display data in table since farm-def data doesn't yet
    // provide units or column names.
    const title = 'Prop Irrigation: Volume (liters) per Prop Grow Day';
    const tooltip = <Typography>{cropsTableCols.propIrrigationSchedule.headerTooltip}</Typography>;
    return (
      <RecipeTable
        data-testid={dataTestIds.table}
        title={title}
        tooltip={tooltip}
        recipe={recipe}
        tableKeyHeaderName="Prop Day"
        tableValueHeaderName="Irrigation Volume (liters)"
      />
    );
  } else if (isRecipeWithSingleSetting(recipe)) {
    // special case handling for 'propIrrigationMinVolume' here since farm-def data doesn't provide units.
    const title =
      recipeName === 'propIrrigationMinVolume' ? 'Tigris Prop Irrigation Minimum Volume (liters)' : recipeName;
    return <RecipeSingleSetting data-testid={dataTestIds.singleSetting} title={title} setting={recipe} />;
  } else if (isRecipeWithListSettings(recipe)) {
    return <RecipeList data-testid={dataTestIds.list} recipe={recipe} />;
  }

  // error case: unsupported format
  console.error('Unsupported recipe format, recipe name: ', recipeName);
  return (
    <RecipeSingleSetting
      data-testid={dataTestIds.error}
      title={recipeName}
      setting="Can not render recipe: unsupported format"
    />
  );
};
