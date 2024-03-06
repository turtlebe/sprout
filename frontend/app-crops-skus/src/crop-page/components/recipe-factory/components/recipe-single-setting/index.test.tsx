import { RecipeSetting } from '@plentyag/core/src/farm-def/types';
import { mockConsoleError } from '@plentyag/core/src/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';

import { CAN_NOT_RENDER_ERROR } from '../../utils';

import { dataTestIdsRecipeSingleSetting as dataTestIds, RecipeSingleSetting } from '.';

describe('RecipeSingleSettingCard', () => {
  function expectToRenderSettingValue(value: RecipeSetting, expectValue: string) {
    const settingName = 'testSetting';
    const { queryByTestId } = render(<RecipeSingleSetting title={settingName} setting={value} />);
    expect(queryByTestId(dataTestIds.setting)).toHaveTextContent(expectValue);
  }
  it('renders number setting value', () => {
    expectToRenderSettingValue(1, '1');
  });

  it('renders string setting value', () => {
    expectToRenderSettingValue('my-setting', 'my-setting');
  });

  it('renders false boolean setting value', () => {
    expectToRenderSettingValue(false, 'false');
  });

  it('renders true boolean setting value', () => {
    expectToRenderSettingValue(true, 'true');
  });

  it('renders units setting value', () => {
    expectToRenderSettingValue({ value: 1, units: 'm/s' }, '1 m/s');
  });

  it('renders error message when setting value is ', () => {
    const consoleError = mockConsoleError();

    //@ts-ignore
    expectToRenderSettingValue({ value: 1 }, CAN_NOT_RENDER_ERROR);

    expect(consoleError).toHaveBeenCalled();
  });
});
