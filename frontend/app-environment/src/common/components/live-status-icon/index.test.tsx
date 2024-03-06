import { LiveStatus } from '@plentyag/core/src/types/environment';
import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsLiveStatusIcon as dataTestIds, LiveStatusIcon } from '.';

describe('LiveStatusIcon', () => {
  it('returns an Icon for No Data', () => {
    const { queryByTestId } = render(<LiveStatusIcon status={LiveStatus.noData} />);

    expect(queryByTestId(dataTestIds.noData)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.outOfRange)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.inRange)).not.toBeInTheDocument();
  });

  it('returns an Icon for Out Of Range values', () => {
    const { queryByTestId } = render(<LiveStatusIcon status={LiveStatus.outOfRange} />);

    expect(queryByTestId(dataTestIds.noData)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.outOfRange)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.inRange)).not.toBeInTheDocument();
  });

  it('returns an Icon for In Range values', () => {
    const { queryByTestId } = render(<LiveStatusIcon status={LiveStatus.inRange} />);

    expect(queryByTestId(dataTestIds.noData)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.outOfRange)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.inRange)).toBeInTheDocument();
  });

  it('returns a small Icon', () => {
    const { queryByTestId } = render(<LiveStatusIcon status={LiveStatus.inRange} fontSize="small" />);

    expect(queryByTestId(dataTestIds.inRange)).toHaveStyle('font-size: 1.25rem');
  });

  it('returns a large Icon', () => {
    const { queryByTestId } = render(<LiveStatusIcon status={LiveStatus.inRange} />);

    expect(queryByTestId(dataTestIds.inRange)).toHaveStyle('font-size: 2.1875rem');
  });
});
