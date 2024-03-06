import { render } from '@testing-library/react';
import React from 'react';

import { mockRecipes } from '../../../common/test-helpers';
import { dataTestIdsRecipeFactory } from '../recipe-factory';

import { dataTestIdsRecipeInformationPanel as dataTestIds, RecipeInformationPanel } from '.';

describe('RecipeInformationPanel', () => {
  it('renders nothing when recipes is not provided', () => {
    const { queryByTestId } = render(<RecipeInformationPanel recipes={undefined} />);
    expect(queryByTestId(dataTestIds.root)).not.toBeInTheDocument();
  });

  it('renders a grid containing recipe cards', () => {
    const { queryByTestId, queryAllByTestId } = render(<RecipeInformationPanel recipes={mockRecipes} />);

    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
    expect(queryAllByTestId(dataTestIds.cardContainer)).toHaveLength(Object.keys(mockRecipes).length);

    // should render 4 recipes: two list, one table and one single setting recipe.

    // shoud render two list: seederModule and harvesterSettings
    expect(queryAllByTestId(dataTestIdsRecipeFactory.list)).toHaveLength(2);

    // should render one table: propIrrigationSchedule
    expect(queryByTestId(dataTestIdsRecipeFactory.table)).toBeInTheDocument();

    // should render 15 single setting: 9 from seederModule, 5 from harvesterSettings and 1 from propIrrigationMinVolume
    expect(queryAllByTestId(dataTestIdsRecipeFactory.singleSetting)).toHaveLength(15);
  });
});
