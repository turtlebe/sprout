import { useGetUrlForUuid } from '@plentyag/app-lab-testing/src/common/hooks/use-get-url-for-uuid';
import { dataTestIdsSnackbar } from '@plentyag/brand-ui/src/components/snackbar';
import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIds, DownloadItemButton } from './download-item-button';

jest.mock('../../../../common/hooks/use-get-url-for-uuid');

const mockUseGetUrlForUuid = useGetUrlForUuid as jest.Mock;

describe('DownloadItemButton', () => {
  it('failed fetch should show snackbar error', () => {
    function mockErrorImpl() {
      function makeRequest({ onError }) {
        onError('ouch');
      }
      const isLoading = false;
      return { isLoading, makeRequest };
    }

    mockUseGetUrlForUuid.mockImplementation(mockErrorImpl);

    const containerRef = React.createRef<HTMLDivElement>();
    const { queryByTestId } = render(
      <DownloadItemButton containerRef={containerRef} downloadUuid={'xyz'} text="test" />
    );

    expect(queryByTestId(dataTestIdsSnackbar.snackbar)).not.toBeInTheDocument();

    const button = queryByTestId(dataTestIds.button);
    button && button.click(); // start fetch

    expect(queryByTestId(dataTestIdsSnackbar.snackbar)).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsSnackbar.alert)).toHaveTextContent('Error downloading data');
  });

  it('fetch success invoke window.open with url', () => {
    const successData = {
      details: { url: 'https://www.somefile.com/file.pdf' },
    };
    function mockSuccessImpl() {
      function makeRequest({ onSuccess }) {
        onSuccess(successData);
      }
      const isLoading = false;
      return { isLoading, makeRequest };
    }

    const mockWindowOpen = jest.fn();
    const origWindowOpen = window.open;
    window.open = mockWindowOpen;

    mockUseGetUrlForUuid.mockImplementation(mockSuccessImpl);

    const containerRef = React.createRef<HTMLDivElement>();
    const { queryByTestId } = render(
      <DownloadItemButton containerRef={containerRef} downloadUuid={'xyz'} text="test" />
    );

    const button = queryByTestId(dataTestIds.button);
    button && button.click(); // start fetch

    expect(queryByTestId(dataTestIdsSnackbar.snackbar)).not.toBeInTheDocument();
    expect(mockWindowOpen).toBeCalledWith(successData.details.url, '_blank');
    window.open = origWindowOpen;
  });
});
