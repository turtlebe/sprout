import { Comment } from '@material-ui/icons';
import { useQueryParameter } from '@plentyag/app-production/src/maps-interactive-page/hooks/use-query-parameter';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React from 'react';

import { LayersButtonItem } from '../layers-button-item';

const dataTestIds = getScopedDataTestIds(
  {
    switch: 'switch',
  },
  'showCommentsLayerButton'
);

export { dataTestIds as dataTestIdsShowCommentsLayerButton };

export const ShowCommentsLayerButton: React.FC = () => {
  const { parameters, setParameters } = useQueryParameter();

  const handleShowCommentsChange = () => {
    setParameters({ showCommentsLayer: !parameters.showCommentsLayer });
  };

  return (
    <LayersButtonItem
      icon={<Comment fontSize="small" />}
      title="Comments"
      isChecked={parameters.showCommentsLayer}
      handleToggle={handleShowCommentsChange}
      switchDataTestId={dataTestIds.switch}
    />
  );
};
