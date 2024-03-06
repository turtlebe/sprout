import {
  mockBaseObservationDefinitions,
  mockDerivedObservationDefinitions,
} from '@plentyag/app-derived-observations/src/common/test-helpers';
import { mockGlobalSnackbar, successSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { axiosRequest } from '@plentyag/core/src/utils/request';
import { render } from '@testing-library/react';
import React from 'react';

import { ButtonDeleteObservationDefinition, dataTestIdsButtonDeleteObservationDefinition as dataTestIds } from '.';

jest.mock('@plentyag/core/src/utils/request');

const mockAxiosRequest = axiosRequest as jest.Mock;

mockGlobalSnackbar();

describe('ButtonDeleteObservationDefinition', () => {
  beforeEach(() => {
    mockAxiosRequest.mockRestore();
    successSnackbar.mockRestore();
  });

  it('renders nothing when current user has insufficient permission', () => {
    mockCurrentUser({ permissions: { HYP_DERIVED_OBSERVATIONS: 'EDIT' } });

    const { container } = render(<ButtonDeleteObservationDefinition definitions={[]} onSuccess={jest.fn()} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders a disabled button', () => {
    mockCurrentUser({ permissions: { HYP_DERIVED_OBSERVATIONS: 'FULL' } });

    const { queryByTestId } = render(<ButtonDeleteObservationDefinition definitions={[]} onSuccess={jest.fn()} />);

    expect(queryByTestId(dataTestIds.button)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.button)).toBeDisabled();
    expect(queryByTestId(dataTestIds.dialog.root)).not.toBeInTheDocument();
  });

  it('deletes derived definitions', async () => {
    const onSuccess = jest.fn();
    mockCurrentUser({ permissions: { HYP_DERIVED_OBSERVATIONS: 'FULL' } });

    const { queryByTestId } = render(
      <ButtonDeleteObservationDefinition definitions={mockDerivedObservationDefinitions} onSuccess={onSuccess} />
    );

    expect(queryByTestId(dataTestIds.button)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.button)).not.toBeDisabled();
    expect(queryByTestId(dataTestIds.dialog.root)).not.toBeInTheDocument();

    queryByTestId(dataTestIds.button).click();

    expect(queryByTestId(dataTestIds.dialog.root)).toBeInTheDocument();

    await actAndAwait(() => queryByTestId(dataTestIds.dialog.confirm).click());

    expect(mockAxiosRequest).toHaveBeenNthCalledWith(1, {
      method: 'DELETE',
      url: expect.stringContaining(`delete-derived-observation-definition/${mockDerivedObservationDefinitions[0].id}`),
      headers: expect.objectContaining({ 'X-Deleted-By': 'olittle' }),
    });
    expect(mockAxiosRequest).toHaveBeenNthCalledWith(2, {
      method: 'DELETE',
      url: expect.stringContaining(`delete-derived-observation-definition/${mockDerivedObservationDefinitions[1].id}`),
      headers: expect.objectContaining({ 'X-Deleted-By': 'olittle' }),
    });
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(successSnackbar).toHaveBeenCalledTimes(1);
  });

  it('deletes base definitions', async () => {
    const onSuccess = jest.fn();
    mockCurrentUser({ permissions: { HYP_DERIVED_OBSERVATIONS: 'FULL' } });

    const { queryByTestId } = render(
      <ButtonDeleteObservationDefinition definitions={mockBaseObservationDefinitions} onSuccess={onSuccess} />
    );

    expect(queryByTestId(dataTestIds.button)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.button)).not.toBeDisabled();
    expect(queryByTestId(dataTestIds.dialog.root)).not.toBeInTheDocument();

    queryByTestId(dataTestIds.button).click();

    expect(queryByTestId(dataTestIds.dialog.root)).toBeInTheDocument();

    await actAndAwait(() => queryByTestId(dataTestIds.dialog.confirm).click());

    expect(mockAxiosRequest).toHaveBeenNthCalledWith(1, {
      method: 'DELETE',
      url: expect.stringContaining(`delete-base-observation-definition/${mockBaseObservationDefinitions[0].id}`),
      headers: expect.objectContaining({ 'X-Deleted-By': 'olittle' }),
    });
    expect(mockAxiosRequest).toHaveBeenNthCalledWith(2, {
      method: 'DELETE',
      url: expect.stringContaining(`delete-base-observation-definition/${mockBaseObservationDefinitions[1].id}`),
      headers: expect.objectContaining({ 'X-Deleted-By': 'olittle' }),
    });
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(successSnackbar).toHaveBeenCalledTimes(1);
  });
});
