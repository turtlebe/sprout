import { axiosRequest } from '@plentyag/core/src/utils/request';
import { act, renderHook } from '@testing-library/react-hooks';

import { useManualCreateEvent } from './use-manual-create-event';

jest.mock('@plentyag/core/src/utils/request');

const mockAxiosRequest = axiosRequest as jest.Mock;

function createHook(onManualFieldChangedCallback: () => void) {
  const { result, waitForNextUpdate } = renderHook(() => useManualCreateEvent(onManualFieldChangedCallback));
  return { result, waitForNextUpdate };
}

async function createHookAndSendEvent(onManualFieldChangedCallback: () => void) {
  const { result, waitForNextUpdate } = createHook(onManualFieldChangedCallback);

  await act(async () => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    result.current.createEvent({
      plenty_username: 'test_user',
      lab_test_manual_field_name: 'fake_field',
      lab_test_manual_field_value: true,
      lab_test_sample_id: '1234',
    });
    await waitForNextUpdate();
  });

  return result;
}

describe('useManualCreateEvent', () => {
  it('on success should call update - to update swr cache', async () => {
    const mockResult = {
      details: ['some-bogus-data'],
      success: 'yeah',
    };
    mockAxiosRequest.mockResolvedValue({ data: mockResult });

    const mockManualFieldChangedCallback = jest.fn();
    const result = await createHookAndSendEvent(mockManualFieldChangedCallback);

    expect(mockManualFieldChangedCallback).toHaveBeenCalled();
    expect(result.current.error).toBeFalsy();
    expect(result.current.isLoading).toBeFalsy();
  });

  it('throws exception if more than one result returned', async () => {
    const mockResult = {
      details: ['some-bogus-data', 'whoops-should-only-have-one-item-in-array'],
      success: 'yeah',
    };
    mockAxiosRequest.mockResolvedValue({ data: mockResult });

    const mockManualFieldChangedCallback = jest.fn();
    const { result } = createHook(mockManualFieldChangedCallback);

    try {
      await act(async () => {
        await result.current.createEvent({
          plenty_username: 'test_user',
          lab_test_manual_field_name: 'fake_field',
          lab_test_manual_field_value: true,
          lab_test_sample_id: '1234',
        });
        expect(false).toBe(true); // shouldn't get here as exception should be thrown.
      });
    } catch (err) {
      expect(mockManualFieldChangedCallback).not.toHaveBeenCalled();
      expect(err.toString()).toEqual('Error: Unexpected number of updated samples, only exepected one.');
    }
  });

  it('should error return if 200 ok result has error', async () => {
    const mockResult = {
      details: ['some-bogus-data'],
      error: 'bad-input', // error from backend
    };
    mockAxiosRequest.mockResolvedValue({ data: mockResult });

    const mockManualFieldChangedCallback = jest.fn();
    const result = await createHookAndSendEvent(mockManualFieldChangedCallback);

    expect(mockManualFieldChangedCallback).not.toHaveBeenCalled();
    expect(result.current.error).toBe(mockResult.error);
    expect(result.current.isLoading).toBeFalsy();
  });

  it('returns error when axios promise fails.', async () => {
    const error = 'error-result';
    mockAxiosRequest.mockRejectedValue({
      response: error,
    });

    const mockManualFieldChangedCallback = jest.fn();
    const result = await createHookAndSendEvent(mockManualFieldChangedCallback);

    expect(mockManualFieldChangedCallback).not.toHaveBeenCalled();
    expect(result.current.error).toBe(error);
    expect(result.current.isLoading).toBeFalsy();
  });
});
