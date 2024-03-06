import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { useSwrAxios } from '@plentyag/core/src/hooks';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { axiosRequest } from '@plentyag/core/src/utils/request';
import { render } from '@testing-library/react';
import React from 'react';

import { ButtonCommit, dataTestIdsButtonCommit as dataTestIds } from '.';

jest.mock('@plentyag/core/src/utils/request');
jest.mock('@plentyag/core/src/hooks/use-swr-axios');

const mockAxiosRequest = axiosRequest as jest.Mock;
const mockUseSwrAxios = useSwrAxios as jest.Mock;

describe('ButtonCommit', () => {
  beforeEach(() => {
    mockAxiosRequest.mockRestore();
    mockUseSwrAxios.mockRestore();
  });

  it('renders nothing when current user has insufficient permission', () => {
    mockCurrentUser({ permissions: { HYP_IGNITION_TAG_REGISTRY: 'EDIT' } });

    const { container } = render(<ButtonCommit onSuccess={jest.fn()} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('commits', async () => {
    const onSuccess = jest.fn();
    mockCurrentUser({ permissions: { HYP_IGNITION_TAG_REGISTRY: 'FULL' } });

    const { queryByTestId } = render(<ButtonCommit onSuccess={onSuccess} />);

    expect(queryByTestId(dataTestIds.button)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.button)).not.toBeDisabled();
    expect(queryByTestId(dataTestIds.dialog.root)).not.toBeInTheDocument();

    queryByTestId(dataTestIds.button).click();

    expect(queryByTestId(dataTestIds.dialog.root)).toBeInTheDocument();

    await actAndAwait(() => queryByTestId(dataTestIds.dialog.confirm).click());

    expect(mockAxiosRequest).toHaveBeenNthCalledWith(1, {
      method: 'POST',
      url: expect.stringContaining('invalidate-cache'),
    });
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });
});
