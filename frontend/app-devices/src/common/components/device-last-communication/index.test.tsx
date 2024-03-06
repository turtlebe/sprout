import { mockDevices } from '@plentyag/app-devices/src/common/test-helpers/devices';
import { useSwrAxios } from '@plentyag/core/src/hooks';
import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsDeviceLastCommunication as dataTestIds, DeviceLastCommunication } from '.';

import { mockObservation } from './test-mocks';

jest.mock('@plentyag/core/src/hooks');

const mockUseSwrAxios = useSwrAxios as jest.Mock;

const [device] = mockDevices;

describe('DeviceLastCommunication', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2023-01-01'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    mockUseSwrAxios.mockRestore();
  });

  it('renders a loader when the device is undefined', () => {
    mockUseSwrAxios.mockReturnValue({ data: undefined, isValidating: true });

    const { queryByTestId } = render(<DeviceLastCommunication device={undefined} />);

    expect(queryByTestId(dataTestIds.loader)).toBeInTheDocument();
  });

  it('renders a loading state', () => {
    mockUseSwrAxios.mockReturnValue({ data: undefined, isValidating: true });

    const { queryByTestId } = render(<DeviceLastCommunication device={device} />);

    expect(queryByTestId(dataTestIds.loader)).toBeInTheDocument();
  });

  it('renders an empty state', () => {
    mockUseSwrAxios.mockReturnValue({ data: { data: [] }, isValidating: false });

    const { queryByTestId } = render(<DeviceLastCommunication device={device} />);

    expect(queryByTestId(dataTestIds.loader)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.root)).toHaveTextContent('--');
  });

  it('renders the last communication', () => {
    mockUseSwrAxios.mockReturnValue({ data: { data: [mockObservation] }, isValidating: false });

    const { queryByTestId } = render(<DeviceLastCommunication device={device} />);

    expect(queryByTestId(dataTestIds.loader)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.root)).toHaveTextContent('last communication: 1 year ago');
    expect(queryByTestId(dataTestIds.root)).not.toHaveTextContent('--');
  });

  it('renders the last communication without chip', () => {
    mockUseSwrAxios.mockReturnValue({ data: { data: [] }, isValidating: false });

    const { container, queryByTestId } = render(<DeviceLastCommunication device={device} noChip />);

    expect(queryByTestId(dataTestIds.loader)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.root)).not.toBeInTheDocument();
    expect(container).toHaveTextContent('--');
  });

  it('does not render the loading state when revalidating', () => {
    mockUseSwrAxios.mockReturnValue({ data: { data: [mockObservation] }, isValidating: true });

    const { queryByTestId } = render(<DeviceLastCommunication device={device} />);

    expect(queryByTestId(dataTestIds.loader)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.root)).not.toHaveTextContent('--');
  });
});
