import { errorSnackbar, mockGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { useSwrAxios } from '@plentyag/core/src/hooks/use-swr-axios';

import { dataTestIds } from '../radio-group';
import { makeOptions, renderFormGenInputAsync } from '../test-helpers';

import { RadioGroupRemote } from '.';

jest.mock('@plentyag/core/src/hooks/use-swr-axios');

const mockUseSwrAxios = useSwrAxios as jest.Mock;

mockGlobalSnackbar();

const options = makeOptions({
  formGenField: {
    url: '/mock-endpoint',
    transformResponse: data => data,
  },
});

describe('RadioGroupRemote', () => {
  it('renders empty list loading', async () => {
    mockUseSwrAxios.mockReturnValue({ data: undefined });
    const [{ getByTestId }] = await renderFormGenInputAsync(RadioGroupRemote, options());
    expect(getByTestId(dataTestIds.radioGroup)).toBeEmptyDOMElement();
  });

  it('renders list of radio buttons when loading is complete', async () => {
    mockUseSwrAxios.mockReturnValue({
      data: [
        { value: 'radio1', label: 'Radio 1' },
        { value: 'radio2', label: 'Radio 2' },
      ],
    });
    const [{ getByTestId }] = await renderFormGenInputAsync(RadioGroupRemote, options());
    expect(getByTestId(dataTestIds.radioGroup).children).toHaveLength(2);
  });

  it('shows snackbar when error occurs during load', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockUseSwrAxios.mockImplementation((arg, opts) => {
      opts.onError('ouch');
      return { data: undefined };
    });
    await renderFormGenInputAsync(RadioGroupRemote, options());
    expect(errorSnackbar).toHaveBeenCalled();
    expect(consoleError).toHaveBeenCalled();
  });
});
