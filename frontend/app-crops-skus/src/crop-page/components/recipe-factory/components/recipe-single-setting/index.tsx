import { CardItem } from '@plentyag/brand-ui/src/components/card-item';
import { Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { RecipeSetting } from '@plentyag/core/src/farm-def/types';
import React from 'react';

import { getRecipeSettingValue } from '../../utils';

const dataTestIds = {
  root: 'recipe-single-setting-root',
  setting: 'recipe-single-setting-setting',
};

export { dataTestIds as dataTestIdsRecipeSingleSetting };

export interface RecipeSingleSetting {
  title: string;
  setting: RecipeSetting;
  'data-testid'?: string;
}

/**
 * This component renders a card with single recipe setting.
 * The setting can an primitive type (string, number, bool)
 * or object with fields: value and units, where value is an string, number or bool.
 *
 * Examples:
 * "xyz"
 * 123
 * 25.5
 * true
 * false
 * { value: 10.5, units "m/s" }
 * { value: 250, units "g" }
 */
export const RecipeSingleSetting: React.FC<RecipeSingleSetting> = ({ title, setting, 'data-testid': dataTestId }) => {
  return (
    <CardItem data-testid={dataTestId || dataTestIds.root} name={title}>
      <Typography data-testid={dataTestIds.setting}>{getRecipeSettingValue(setting)}</Typography>
    </CardItem>
  );
};
