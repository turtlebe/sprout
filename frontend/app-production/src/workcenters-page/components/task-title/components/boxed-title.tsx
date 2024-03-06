import React from 'react';

import { StackedAndBoxedTitles } from './stacked-and-boxed-titles';

const dataTestIds = {
  root: 'boxed-title-root',
};

export { dataTestIds as dataTestIdsBoxedTitle };

export interface BoxedTitle {
  title: string;
  'data-testid'?: string;
}

export const BoxedTitle: React.FC<BoxedTitle> = ({ title, 'data-testid': dataTestId }) => {
  return <StackedAndBoxedTitles data-testid={dataTestId || dataTestIds.root} titles={[title]} />;
};
