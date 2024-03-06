import {
  Recipe,
  RecipeSetting,
  RecipeSettings,
  RecipeSettingWithPrimitiveType,
  RecipeSettingWithUnits,
} from '@plentyag/core/src/farm-def/types';
import { isPlainObject } from 'lodash';

/**
 * Map that stores a list of settings where the key is the recipe name and value is the setting
 */
export function isRecipeWithListSettings(recipe: Recipe): recipe is RecipeSettings {
  return isPlainObject(recipe) && Object.keys(recipe)?.length > 0;
}

export function isRecipeSettingWithUnits(setting: RecipeSetting): setting is RecipeSettingWithUnits {
  return !!(setting && typeof setting === 'object' && setting.units && setting.value);
}

export function isRecipeWithSingleSetting(recipe: Recipe): recipe is RecipeSetting {
  return (
    typeof recipe === 'number' ||
    typeof recipe === 'string' ||
    typeof recipe === 'boolean' ||
    !!(isPlainObject(recipe) && recipe.units && recipe.value)
  );
}

export function isRecipeSettingWithPrimitiveType(setting: RecipeSetting): setting is RecipeSettingWithPrimitiveType {
  return typeof setting === 'number' || typeof setting === 'string' || typeof setting === 'boolean';
}

/**
 * Map that stores a table of settings, must be an object that has one or more keys.
 * The keys are the first column of the table.
 * The values are the second column of the table.
 * All values must be either primitive type or setting with value/units.
 */
export function isRecipeWithTableSettings(recipe: Recipe): recipe is RecipeSettings {
  return (
    isPlainObject(recipe) &&
    Object.keys(recipe)?.length > 0 &&
    Object.keys(recipe).every(
      key => isRecipeSettingWithPrimitiveType(recipe[key]) || isRecipeSettingWithUnits(recipe[key])
    )
  );
}
