import {
  buildLAX1ContainerLocation,
  buildResourceState,
} from '@plentyag/app-production/src/common/test-helpers/mock-builders';
import { mockGlobalSnackbar, warningSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { useLogAxiosErrorInSnackbar, useSwrAxios } from '@plentyag/core/src/hooks';
import { buildCommentable } from '@plentyag/core/src/test-helpers/mocks';
import { renderHook } from '@testing-library/react-hooks';
import { DateTime } from 'luxon';

import { mockMapsState } from '../../test-helpers/mock-maps-state';
import { MapsState } from '../../types';
import { useLoadCommentables } from '../use-load-commentables';
import { useMapsDateRange } from '../use-maps-date-range';

import { useLoadMapsState } from '.';

jest.mock('@plentyag/core/src/hooks/use-swr-axios');
jest.mock('@plentyag/core/src/hooks/use-log-axios-error-in-snackbar');
jest.mock('../use-maps-date-range');
jest.mock('../use-load-commentables');

mockGlobalSnackbar();

describe('useLoadMapsState', () => {
  const currentDate = DateTime.now();
  const startDate = currentDate.minus({ days: 20 }).toISO();
  const endDate = DateTime.now().toISO();

  beforeEach(() => {
    (useMapsDateRange as jest.Mock).mockReturnValue({
      startDate,
      endDate,
    });
    (useLoadCommentables as jest.Mock).mockReturnValue({
      commentables: [],
      isLoading: false,
    });

    warningSnackbar.mockRestore();
  });

  function renderUseLoadMapsState({
    site,
    containerId,
    containerType,
    showWarning = false,
  }: {
    site;
    containerId?;
    containerType?;
    showWarning?: boolean;
  }) {
    return renderHook(() =>
      useLoadMapsState({
        linePath: `sites/${site}/areas/Propagation/lines/PropagationRack`,
        selectedDate: currentDate,
        containerId,
        containerType,
        showWarningWhenMapsStateIsEmpty: showWarning,
      })
    );
  }

  it('capture correct parameters and supports loading state for SSF2', () => {
    // ARRANGE
    (useSwrAxios as jest.Mock).mockReturnValue({
      data: null,
      isValidating: true,
    });

    // ACT
    const { result } = renderUseLoadMapsState({ site: 'SSF2' });

    // ASSERT
    // -- make sure we capture correct parameters
    expect(useSwrAxios).toHaveBeenCalledWith({
      url: '/api/production/maps/state',
      params: {
        area: 'Propagation',
        containerId: undefined,
        endDate: endDate,
        line: 'PropagationRack',
        showLastLoadOperation: true,
        site: 'SSF2',
        startDate: startDate,
      },
    });
    // -- test the result
    expect(result.current.isLoading).toBeTruthy();
    expect(result.current.mapsState).not.toBeTruthy();
  });

  it('capture correct parameters and supports loading state for LAX1', () => {
    // ARRANGE
    (useSwrAxios as jest.Mock).mockReturnValue({
      data: null,
      isValidating: true,
    });

    // ACT
    const { result } = renderUseLoadMapsState({ site: 'LAX1' });

    // ASSERT
    // -- make sure we capture correct parameters
    expect(useSwrAxios).toHaveBeenCalledWith({
      url: '/api/production/maps/state',
      params: {
        area: 'Propagation',
        containerId: undefined,
        line: 'PropagationRack',
        showLastLoadOperation: false,
        selectedDate: currentDate.toISO(),
        site: 'LAX1',
      },
    });
    // -- test the result
    expect(result.current.isLoading).toBeTruthy();
    expect(result.current.mapsState).not.toBeTruthy();
  });

  it('fetch and return data', () => {
    // ARRANGE
    (useSwrAxios as jest.Mock).mockReturnValue({
      data: mockMapsState,
      isValidating: false,
    });

    // ACT
    const { result } = renderUseLoadMapsState({ site: 'SSF2' });

    // ASSERT
    expect(result.current.isLoading).not.toBeTruthy();
    expect(result.current.mapsState).toEqual(mockMapsState);
  });

  it('fetch data with show load date', () => {
    // ARRANGE
    (useSwrAxios as jest.Mock).mockReturnValue({
      data: mockMapsState,
      isValidating: false,
    });

    // ACT
    renderUseLoadMapsState({ site: true });

    // ASSERT
    expect(useSwrAxios).toHaveBeenCalledWith(
      expect.objectContaining({
        params: expect.objectContaining({
          showLastLoadOperation: true,
        }),
      })
    );
  });

  it('fetch data with specific container ID', () => {
    // ARRANGE
    (useSwrAxios as jest.Mock).mockReturnValue({
      data: mockMapsState,
      isValidating: false,
    });

    // ACT
    renderUseLoadMapsState({ site: 'SSF2', containerId: 123 });

    // ASSERT
    expect(useSwrAxios).toHaveBeenCalledWith(
      expect.objectContaining({
        params: expect.objectContaining({
          containerId: 123,
        }),
      })
    );
  });

  it('fetch data with specific container type', () => {
    // ARRANGE
    (useSwrAxios as jest.Mock).mockReturnValue({
      data: mockMapsState,
      isValidating: false,
    });

    // ACT
    renderUseLoadMapsState({ site: 'SSF2', containerType: 'TABLE' });

    // ASSERT
    expect(useSwrAxios).toHaveBeenCalledWith(
      expect.objectContaining({
        params: expect.objectContaining({
          containerType: 'TABLE',
        }),
      })
    );
  });

  it('handles error', () => {
    // ARRANGE
    const mockError = new Error('wrong');

    (useSwrAxios as jest.Mock).mockReturnValue({
      data: null,
      isValidating: false,
      error: mockError,
    });

    // ACT
    const { result } = renderUseLoadMapsState({ site: 'SSF2' });

    // ASSERT
    expect(useLogAxiosErrorInSnackbar).toHaveBeenCalledWith(mockError);
    expect(result.current.isLoading).not.toBeTruthy();
    expect(result.current.mapsState).toBeNull();
  });

  it('shows warning snackbar message when there data is empty for selectedDate', () => {
    (useSwrAxios as jest.Mock).mockReturnValue({
      data: {}, // empty data
      isValidating: true,
    });

    expect(warningSnackbar).not.toHaveBeenCalled();

    renderUseLoadMapsState({ site: 'LAX1', showWarning: true });

    expect(warningSnackbar).toHaveBeenCalled();
  });

  it('does not show snackbar warning when prop "showWarningWhenMapsStateIsEmpty" is falsey', () => {
    (useSwrAxios as jest.Mock).mockReturnValue({
      data: {}, // empty data
      isValidating: true,
    });

    renderUseLoadMapsState({ site: 'LAX1' });

    expect(warningSnackbar).not.toHaveBeenCalled();
  });

  it('returns `hasComments` flags', () => {
    const containerLocation1 = buildLAX1ContainerLocation({ containerType: 'PropTable' });
    const containerLocation2 = buildLAX1ContainerLocation({ containerType: 'PropTable' });
    const mapsState: MapsState = {
      [containerLocation1.ref]: { resourceState: buildResourceState({ containerLocation: containerLocation1 }) },
      [containerLocation2.ref]: { resourceState: buildResourceState({ containerLocation: containerLocation2 }) },
    };
    // ARRANGE
    (useSwrAxios as jest.Mock).mockReturnValue({
      data: mapsState,
      isValidating: false,
    });
    (useLoadCommentables as jest.Mock).mockReturnValue({
      commentables: [buildCommentable({ id: mapsState[containerLocation2.ref].resourceState.materialObj.id })],
      isLoading: false,
    });

    // ACT
    const { result } = renderUseLoadMapsState({ site: 'LAX1' });

    // ASSERT
    expect(result.current.isLoading).not.toBeTruthy();
    expect(result.current.mapsState[containerLocation1.ref].hasComments).toBe(false);
    expect(result.current.mapsState[containerLocation2.ref].hasComments).toBe(true);
  });
});
