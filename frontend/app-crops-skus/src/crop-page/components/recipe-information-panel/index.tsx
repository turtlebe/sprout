import { Card } from '@plentyag/brand-ui/src/components/card';
import { Grid } from '@plentyag/brand-ui/src/material-ui/core';
import { Recipes } from '@plentyag/core/src/farm-def/types';
import React from 'react';
import { titleCase, words } from 'voca';

import { RecipeFactory } from '../recipe-factory';

const dataTestIds = {
  root: 'recipe-information-panel-root',
  cardContainer: 'recipe-information-panel-card-container',
  recipeCard: (recipeName: string) => `recipe-information-panel-card-${recipeName}`,
};

export { dataTestIds as dataTestIdsRecipeInformationPanel };

export interface RecipeInformationPanel {
  recipes: Recipes;
}

/**
 * This component displays a card for each recipe in the given "recipes" object. It
 * uses RecipeFactory to render the card items for the given recipe.
 */
export const RecipeInformationPanel: React.FC<RecipeInformationPanel> = ({ recipes }) => {
  if (!recipes) {
    return null;
  }

  return (
    <Grid data-testid={dataTestIds.root} container spacing={2}>
      {Object.keys(recipes).map(recipeName => {
        const formattedRecipeName = words(titleCase(recipeName)).join(' ');
        const title = `Recipe: ${formattedRecipeName}`;
        return (
          <Grid data-testid={dataTestIds.cardContainer} key={recipeName} item xs={6}>
            <Card title={title} isLoading={false}>
              <RecipeFactory recipeName={recipeName} recipe={recipes[recipeName]} />
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};
