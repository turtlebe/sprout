import {
  mockConfirmedUploadHistoryEntry,
  mockCreatedUploadHistoryEntry,
} from '@plentyag/app-production-admin/src/import-plans-page/test-helpers/mock-upload-history';
import { renderHook } from '@testing-library/react-hooks';

import { useProcessUploadHistory } from '.';

describe('useProcessUploadHistory', () => {
  it('should convert upload history to appropriate line items', () => {
    const { result } = renderHook(() =>
      useProcessUploadHistory([mockConfirmedUploadHistoryEntry, mockCreatedUploadHistoryEntry])
    );

    // -- should have 3 instead of 2 because there is 1 pending creation and 2 tasks created
    expect(result.current).toHaveLength(3);

    expect(result.current[0].uploadId).toEqual('plenty-workcenter-uploads:7fc10450-2e1a-49bf-ae2a-91312e25a59c3');
    expect(result.current[0].plannedDate).toEqual('2042-07-21');
    expect(result.current[0].workcenter).toEqual('Seed');
    expect(result.current[0].status).toEqual('CREATED_SUCCESSFULLY');

    expect(result.current[1].uploadId).toEqual('plenty-workcenter-uploads:7fc10450-2e1a-49bf-ae2a-91312e25a59c3');
    expect(result.current[1].plannedDate).toEqual('2042-07-22');
    expect(result.current[1].workcenter).toEqual('Seed');
    expect(result.current[1].status).toEqual('CREATED_SUCCESSFULLY');

    expect(result.current[2].uploadId).toEqual('plenty-workcenter-uploads:7fc10450-2e1a-49bf-ae2a-91312e25a59c2');
    expect(result.current[2].status).toEqual('CONFIRMED_CREATE_TASKS');
  });
});
