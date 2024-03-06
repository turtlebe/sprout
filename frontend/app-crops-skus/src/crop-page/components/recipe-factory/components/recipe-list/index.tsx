import { Box } from '@plentyag/brand-ui/src/material-ui/core';
import { RecipeSettings } from '@plentyag/core/src/farm-def/types';
import React from 'react';

import { RecipeFactory } from '../..';

const dataTestIds = {
  root: 'recipe-list-root',
  setting: (settingName: string) => `recipe-list-${settingName}`,
};

export { dataTestIds as dataTestIdsRecipeList };

export interface RecipeList {
  recipe: RecipeSettings;
  'data-testid'?: string;
}

/**
 * This component renders a list of recipe settings
 * recursively using RecipeFactory to perform the rendering.
 *
 * Example:
 * {
 *   "dibbleDepth": 11.0,
 *   "conveyorSpeed": 50.0,
 *   "vacuumPressure": 50.0,
 *   "irrigatorConveyorSpeed": { units: "m/s", value: 2},
 *   "topCoaterVibrationIntensity": "20.0",
 *   "lightsOn": true,
 *   "irrigationSchedule": {
 *       "0": 210,
 *       "10": 210,
 *   }
 * }
 *
 * where:
 * - key is the setting name (ex: dibbleDepth)
 * - value is either
 *   1. a primitive type (string, number, bool)
 *   2. object with fields: value and units, where value is an string, number, or bool
 *   3. table.
 */
export const RecipeList: React.FC<RecipeList> = ({ recipe, 'data-testid': dataTestId }) => {
  const recipeSettings = recipe && Object.keys(recipe);

  const items = recipeSettings?.map(recipeSettingName => (
    <RecipeFactory key={recipeSettingName} recipeName={recipeSettingName} recipe={recipe[recipeSettingName]} />
  ));

  return <Box data-testid={dataTestId || dataTestIds.root}>{items}</Box>;
};
