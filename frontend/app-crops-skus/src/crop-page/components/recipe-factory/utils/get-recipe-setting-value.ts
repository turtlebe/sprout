import { isRecipeSettingWithPrimitiveType, isRecipeSettingWithUnits } from '@plentyag/app-crops-skus/src/common/types';
import { RecipeSetting } from '@plentyag/core/src/farm-def/types';

export const CAN_NOT_RENDER_ERROR = 'Can not render recipe setting: unsupported format';

export function getRecipeSettingValue(setting: RecipeSetting) {
  if (isRecipeSettingWithPrimitiveType(setting)) {
    return setting.toString();
  } else if (isRecipeSettingWithUnits(setting)) {
    return `${setting.value} ${setting.units}`;
  }
  console.error('Unsupported recipe setting format:', setting);
  return CAN_NOT_RENDER_ERROR;
}
