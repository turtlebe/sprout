import { useQueryParameter } from '@plentyag/app-production/src/maps-interactive-page/hooks/use-query-parameter';
import {
  mockMapsState,
  mockMapsStateWithLoadDataLastLoadOperation,
} from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-maps-state';
import { render } from '@testing-library/react';
import { DateTime } from 'luxon';

import { AgeCohortSlider, dataTestIdsAgeCohortSlider as dataTestIds } from '.';

import { DEFAULT_ALL, DEFAULT_ALL_RECORD } from './constants';
import { useSliderDataFromMapsState } from './hooks/use-slider-data-from-maps-state';
import { mockMarks, mockMarksRecord } from './test-helpers/mock-marks';

jest.mock('./hooks/use-slider-data-from-maps-state');
const mockUseSliderDataFromMapsState = useSliderDataFromMapsState as jest.Mock;

jest.mock('@plentyag/app-production/src/maps-interactive-page/hooks/use-query-parameter');
const mockUseQueryParameter = useQueryParameter as jest.Mock;
const selectedDate = DateTime.fromISO('2021-02-14T00:00:00.000Z');
const mockSetParameters = jest.fn();
const mockParameters = {
  selectedDate,
  ageCohortDate: DEFAULT_ALL_RECORD.ageCohortDate,
};

describe('AgeCohortSlider', () => {
  beforeEach(() => {
    mockUseQueryParameter.mockReturnValue({
      parameters: mockParameters,
      setParameters: mockSetParameters,
    });
    mockUseSliderDataFromMapsState.mockReturnValue({
      marks: mockMarks,
      marksRecord: mockMarksRecord,
      value: DEFAULT_ALL.value,
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  function renderAgeCohortSlider(mapsState) {
    return render(<AgeCohortSlider mapsState={mapsState} />, {
      wrapper: ({ children }) => <div style={{ width: '500px', height: '50px' }}>{children}</div>,
    });
  }

  it('renders', () => {
    const { queryByTestId } = renderAgeCohortSlider(mockMapsStateWithLoadDataLastLoadOperation);
    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
  });

  it('should be disabled if there are no load date in state data', () => {
    const { queryByTestId } = renderAgeCohortSlider(mockMapsState);

    expect(queryByTestId(dataTestIds.showAll)).toHaveClass('Mui-disabled');
    expect(queryByTestId(dataTestIds.slider)).toHaveClass('Mui-disabled');
  });

  it('should choose minimum value in slider when "Show All" is unchecked', () => {
    const { queryByTestId } = renderAgeCohortSlider(mockMapsStateWithLoadDataLastLoadOperation);

    expect(queryByTestId(dataTestIds.slider)).toHaveClass('Mui-disabled');
    expect(queryByTestId(dataTestIds.showAll)).not.toHaveClass('Mui-disabled');
    expect(queryByTestId(dataTestIds.showAll).querySelector('input').checked).toBeTruthy();

    queryByTestId(dataTestIds.showAll).click();

    expect(mockSetParameters).toHaveBeenCalledWith(
      expect.objectContaining({ ageCohortDate: mockMarksRecord[0].ageCohortDate })
    );
  });

  it('should disable slider and select "All (-1)" value when "Show All" is checked', () => {
    mockUseSliderDataFromMapsState.mockReturnValue({
      marks: mockMarks,
      marksRecord: mockMarksRecord,
      value: mockMarksRecord[1].value,
    });

    const { queryByTestId } = renderAgeCohortSlider(mockMapsStateWithLoadDataLastLoadOperation);

    expect(queryByTestId(dataTestIds.slider)).not.toHaveClass('Mui-disabled');
    expect(queryByTestId(dataTestIds.showAll)).not.toHaveClass('Mui-disabled');
    expect(queryByTestId(dataTestIds.showAll).querySelector('input').checked).toBeFalsy();

    queryByTestId(dataTestIds.showAll).click();

    expect(mockSetParameters).toHaveBeenCalledWith(
      expect.objectContaining({ ageCohortDate: DEFAULT_ALL_RECORD.ageCohortDate })
    );
  });

  it('should still parse as a valid "value" if the value is 0 which indicates the first marks record', () => {
    mockUseSliderDataFromMapsState.mockReturnValue({
      marks: mockMarks,
      marksRecord: mockMarksRecord,
      value: 0,
    });

    const { queryByTestId } = renderAgeCohortSlider(mockMapsStateWithLoadDataLastLoadOperation);

    expect(queryByTestId(dataTestIds.showAll).querySelector('input').checked).toBeFalsy();
  });
});
