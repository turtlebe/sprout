import { render } from '@testing-library/react';
import React from 'react';

import { HasFarm } from '../../types';

import { dataTestIdsFarmsUsingCropSku as dataTestIds, FarmsUsingCropSku } from '.';

describe('FarmsUsingCropSku', () => {
  it('shows active farms', () => {
    const hasFarm: HasFarm = {
      farm1: true,
      farm2: false,
      farm3: true,
    };

    const { queryByTestId } = render(<FarmsUsingCropSku hasFarm={hasFarm} />);

    expect(queryByTestId(dataTestIds.activeFarms)).toHaveTextContent('farm1, farm3');
    expect(queryByTestId(dataTestIds.notActiveFarm)).not.toBeInTheDocument();
  });

  it('shows that no farms are active', () => {
    const hasFarm: HasFarm = {
      farm1: false,
      farm2: false,
    };

    const { queryByTestId } = render(<FarmsUsingCropSku hasFarm={hasFarm} />);

    expect(queryByTestId(dataTestIds.activeFarms)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.notActiveFarm)).toBeInTheDocument();
  });
});
