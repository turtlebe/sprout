import { useGetUrlForUuid } from '@plentyag/app-lab-testing/src/common/hooks/use-get-url-for-uuid';
import { Snackbar, useSnackbar } from '@plentyag/brand-ui/src/components/snackbar';
import { Button, CircularProgress, Portal } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

export const dataTestIds = {
  button: 'button',
};

interface DownloadItemButton extends Button {
  containerRef: React.RefObject<HTMLDivElement>;
  downloadUuid: string;
  text: string;
}

/**
 * Button to download a single item with given S3 bucket UUID.
 */
export const DownloadItemButton: React.FC<DownloadItemButton> = ({ text, downloadUuid, containerRef, ...props }) => {
  const snackbarProps = useSnackbar();

  const { isLoading, makeRequest } = useGetUrlForUuid(downloadUuid);

  function onError() {
    snackbarProps.errorSnackbar &&
      snackbarProps.errorSnackbar({
        message: 'Error downloading data. Check network connection and try again, otherwise contact FarmOS support.',
      });
  }

  function onSuccess(data: any) {
    if (data.details) {
      window.open(data.details.url, '_blank');
    }

    // ToDo: current API can return error even on 200 ok.
    if (data.error) {
      onError();
    }
  }

  function startFetch() {
    return makeRequest({
      onSuccess,
      onError,
    });
  }

  return (
    <>
      <Portal container={containerRef.current}>
        <Snackbar {...snackbarProps} />
      </Portal>
      <Button
        {...props}
        data-testid={dataTestIds.button}
        startIcon={isLoading ? <CircularProgress size="1rem" color="primary" /> : props.startIcon}
        size={props.size}
        className={props.className}
        variant="outlined"
        onClick={props.onClick ? props.onClick : startFetch}
      >
        {text}
      </Button>
    </>
  );
};
