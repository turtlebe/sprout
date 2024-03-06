import { mockConsoleError } from '@plentyag/core/src/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';

import { mockRecipes } from '../../../common/test-helpers';

import { dataTestIdsRecipeFactory as dataTestIds, RecipeFactory } from '.';

describe('RecipeCardFactory', () => {
  it('renders list card for seederModule', () => {
    const name = 'seederModule';
    const recipe = mockRecipes[name];
    const { queryByTestId } = render(<RecipeFactory recipeName={name} recipe={recipe} />);
    expect(queryByTestId(dataTestIds.list)).toBeInTheDocument();
  });

  it('renders list card for harvesterSettings', () => {
    const name = 'harvesterSettings';
    const recipe = mockRecipes[name];
    const { queryByTestId } = render(<RecipeFactory recipeName={name} recipe={recipe} />);
    expect(queryByTestId(dataTestIds.list)).toBeInTheDocument();
  });

  it('renders table card for propIrrigationSchedule', () => {
    const name = 'propIrrigationSchedule';
    const recipe = mockRecipes[name];
    const { queryByTestId } = render(<RecipeFactory recipeName={name} recipe={recipe} />);
    expect(queryByTestId(dataTestIds.table)).toBeInTheDocument();
  });

  it('renders single setting card for propIrrigationMinVolume', () => {
    const name = 'propIrrigationMinVolume';
    const recipe = mockRecipes[name];
    const { queryByTestId } = render(<RecipeFactory recipeName={name} recipe={recipe} />);
    expect(queryByTestId(dataTestIds.singleSetting)).toBeInTheDocument();
  });

  it('renders error card for undefined recipe', () => {
    const consoleError = mockConsoleError();
    const name = 'bad-recipe';
    const recipe = {};
    const { queryByTestId } = render(<RecipeFactory recipeName={name} recipe={recipe} />);
    expect(queryByTestId(dataTestIds.error)).toBeInTheDocument();
    expect(consoleError).toHaveBeenCalled();
  });

  it('renders error card for null recipe', () => {
    const consoleError = mockConsoleError();
    const name = 'bad-recipe';
    const recipe = null;
    const { queryByTestId } = render(<RecipeFactory recipeName={name} recipe={recipe} />);
    expect(queryByTestId(dataTestIds.error)).toBeInTheDocument();
    expect(consoleError).toHaveBeenCalled();
  });
});
