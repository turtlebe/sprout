import { mockChildResourcesMapsState } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-maps-state';
import { renderHook } from '@testing-library/react-hooks';

import { useTableGraphData } from '.';

describe('useTableGraphData', () => {
  it('serializes map state data into graph data (i.e. TableRowsData[])', () => {
    // ACT
    const { result } = renderHook(() =>
      useTableGraphData({ siteName: 'SSF2', traysState: mockChildResourcesMapsState })
    );

    // ASSERT
    // -- check for correct data in designated coordinate
    // -- automatically fill in "undefined" for missing resource data for that tray
    expect(result.current.tableRows).toEqual([
      { rowName: 'F', resources: [undefined, undefined, undefined, undefined, undefined, undefined] },
      { rowName: 'E', resources: [undefined, undefined, undefined, undefined, undefined, undefined] },
      { rowName: 'D', resources: [undefined, undefined, undefined, undefined, undefined, undefined] },
      {
        rowName: 'C',
        resources: [
          mockChildResourcesMapsState.C1.resourceState,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
        ],
      },
      { rowName: 'B', resources: [undefined, undefined, undefined, undefined, undefined, undefined] },
      { rowName: 'A', resources: [undefined, undefined, undefined, undefined, undefined, undefined] },
    ]);
  });
});
