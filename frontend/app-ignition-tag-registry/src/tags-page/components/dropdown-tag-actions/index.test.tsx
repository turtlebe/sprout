import { mockTags } from '@plentyag/app-ignition-tag-registry/src/common/test-helpers';
import { mockGlobalSnackbar, successSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { useSwrAxios } from '@plentyag/core/src/hooks';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { axiosRequest } from '@plentyag/core/src/utils/request';
import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsDropdownTagActions as dataTestIds, DropdownTagActions } from '.';

jest.mock('@plentyag/core/src/utils/request');
jest.mock('@plentyag/core/src/hooks/use-swr-axios');

const mockAxiosRequest = axiosRequest as jest.Mock;
const mockUseSwrAxios = useSwrAxios as jest.Mock;

mockGlobalSnackbar();

describe('DropdownTagActions', () => {
  beforeEach(() => {
    mockAxiosRequest.mockRestore();
    mockUseSwrAxios.mockRestore();
    successSnackbar.mockRestore();
  });

  it('renders nothing when current user has insufficient permission', () => {
    mockCurrentUser({ permissions: { HYP_IGNITION_TAG_REGISTRY: 'EDIT' } });

    const { container } = render(<DropdownTagActions tags={[]} onSuccess={jest.fn()} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders a dropdown tag actions item', () => {
    mockCurrentUser({ permissions: { HYP_IGNITION_TAG_REGISTRY: 'FULL' } });

    const { queryByTestId } = render(<DropdownTagActions tags={[]} onSuccess={jest.fn()} />);
    queryByTestId(dataTestIds.dropdowntagActions).click();

    expect(queryByTestId(dataTestIds.approveDropdownItem)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.deactivateDropdownItem)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.deleteDropdownItem)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.dialog.root)).not.toBeInTheDocument();
  });

  it('approves tags', async () => {
    const onSuccess = jest.fn();
    mockCurrentUser({ permissions: { HYP_IGNITION_TAG_REGISTRY: 'FULL' } });

    const { queryByTestId } = render(<DropdownTagActions tags={mockTags} onSuccess={onSuccess} />);
    queryByTestId(dataTestIds.dropdowntagActions).click();

    expect(queryByTestId(dataTestIds.approveDropdownItem)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.dialog.root)).not.toBeInTheDocument();

    queryByTestId(dataTestIds.approveDropdownItem).click();
    expect(queryByTestId(dataTestIds.dialog.root)).toBeInTheDocument();

    await actAndAwait(() => queryByTestId(dataTestIds.dialog.confirm).click());

    expect(mockAxiosRequest).toHaveBeenNthCalledWith(1, {
      method: 'PUT',
      url: expect.stringContaining(`update-tag/${mockTags[0].uid}`),
      data: expect.objectContaining({
        uid: '1b192ecf-77f5-4d22-9e82-55bf3f6b622a',
        path: 'sites/SSF2/areas/Seeding/lines/TraySeeding',
        tagProvider: 'alpha seeder',
        tagPath: 'crane/crane/actposition',
        measurementName: 'TestMeasurement',
        measurementType: 'ELECTRICAL_CONDUCTIVITY',
        measurementUnit: 'MSIEMENS_PER_CM',
        deviceType: '',
        createdBy: 'olittle',
        updatedBy: 'olittle',
        createdAt: '2021-12-22T08:19:53.153706Z',
        updatedAt: '2021-12-22T08:19:53.153713Z',
        kind: 'tag',
        tagStatus: 'ACTIVE',
      }),
    });
    expect(mockAxiosRequest).toHaveBeenNthCalledWith(2, {
      method: 'PUT',
      url: expect.stringContaining(`update-tag/${mockTags[1].uid}`),
      data: expect.objectContaining({
        uid: '7589d50a-f65f-40ec-8eec-465d5d822b0d',
        path: 'sites/SSF2/areas/Seeding/lines/TraySeeding',
        tagProvider: 'alpha seeder',
        tagPath: 'crane/crane/destination',
        measurementName: 'FilteredPvPH',
        measurementType: 'PH',
        measurementUnit: 'NONE',
        deviceType: '',
        createdBy: 'olittle',
        updatedBy: 'olittle',
        createdAt: '2021-12-22T08:19:50.791400Z',
        updatedAt: '2021-12-22T08:19:50.791407Z',
        kind: 'tag',
        tagStatus: 'ACTIVE',
      }),
    });
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(successSnackbar).toHaveBeenCalledTimes(1);
  });

  it('deactivates tags', async () => {
    const onSuccess = jest.fn();
    mockCurrentUser({ permissions: { HYP_IGNITION_TAG_REGISTRY: 'FULL' } });

    const { queryByTestId } = render(<DropdownTagActions tags={mockTags} onSuccess={onSuccess} />);
    queryByTestId(dataTestIds.dropdowntagActions).click();

    expect(queryByTestId(dataTestIds.deactivateDropdownItem)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.dialog.root)).not.toBeInTheDocument();

    queryByTestId(dataTestIds.deactivateDropdownItem).click();
    expect(queryByTestId(dataTestIds.dialog.root)).toBeInTheDocument();

    await actAndAwait(() => queryByTestId(dataTestIds.dialog.confirm).click());

    expect(mockAxiosRequest).toHaveBeenNthCalledWith(1, {
      method: 'PUT',
      url: expect.stringContaining(`update-tag/${mockTags[0].uid}`),
      data: expect.objectContaining({
        uid: '1b192ecf-77f5-4d22-9e82-55bf3f6b622a',
        path: 'sites/SSF2/areas/Seeding/lines/TraySeeding',
        tagProvider: 'alpha seeder',
        tagPath: 'crane/crane/actposition',
        measurementName: 'TestMeasurement',
        measurementType: 'ELECTRICAL_CONDUCTIVITY',
        measurementUnit: 'MSIEMENS_PER_CM',
        deviceType: '',
        createdBy: 'olittle',
        updatedBy: 'olittle',
        createdAt: '2021-12-22T08:19:53.153706Z',
        updatedAt: '2021-12-22T08:19:53.153713Z',
        kind: 'tag',
        tagStatus: 'INACTIVE',
      }),
    });
    expect(mockAxiosRequest).toHaveBeenNthCalledWith(2, {
      method: 'PUT',
      url: expect.stringContaining(`update-tag/${mockTags[1].uid}`),
      data: expect.objectContaining({
        uid: '7589d50a-f65f-40ec-8eec-465d5d822b0d',
        path: 'sites/SSF2/areas/Seeding/lines/TraySeeding',
        tagProvider: 'alpha seeder',
        tagPath: 'crane/crane/destination',
        measurementName: 'FilteredPvPH',
        measurementType: 'PH',
        measurementUnit: 'NONE',
        deviceType: '',
        createdBy: 'olittle',
        updatedBy: 'olittle',
        createdAt: '2021-12-22T08:19:50.791400Z',
        updatedAt: '2021-12-22T08:19:50.791407Z',
        kind: 'tag',
        tagStatus: 'INACTIVE',
      }),
    });
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(successSnackbar).toHaveBeenCalledTimes(1);
  });

  it('deletes tags', async () => {
    const onSuccess = jest.fn();
    mockCurrentUser({ permissions: { HYP_IGNITION_TAG_REGISTRY: 'FULL' } });

    const { queryByTestId } = render(<DropdownTagActions tags={mockTags} onSuccess={onSuccess} />);
    queryByTestId(dataTestIds.dropdowntagActions).click();

    expect(queryByTestId(dataTestIds.deleteDropdownItem)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.dialog.root)).not.toBeInTheDocument();

    queryByTestId(dataTestIds.deleteDropdownItem).click();

    expect(queryByTestId(dataTestIds.dialog.root)).toBeInTheDocument();

    await actAndAwait(() => queryByTestId(dataTestIds.dialog.confirm).click());

    expect(mockAxiosRequest).toHaveBeenNthCalledWith(1, {
      method: 'DELETE',
      url: expect.stringContaining(`delete-tag/${mockTags[0].uid}`),
      headers: { 'X-Deleted-By': 'olittle' },
    });
    expect(mockAxiosRequest).toHaveBeenNthCalledWith(2, {
      method: 'DELETE',
      url: expect.stringContaining(`delete-tag/${mockTags[1].uid}`),
      headers: { 'X-Deleted-By': 'olittle' },
    });
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(successSnackbar).toHaveBeenCalledTimes(1);
  });
});
