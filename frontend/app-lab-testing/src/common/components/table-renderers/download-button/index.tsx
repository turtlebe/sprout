import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { DownloadItemButton } from './download-item-button';
import { DownloadItemsDialog } from './download-items-dialog';

const useStyles = makeStyles(() => ({
  button: {
    textTransform: 'none',
    maxHeight: '1.6rem',
    paddingLeft: '0.1rem',
    paddingRight: '0.1rem',
    paddingTop: 0,
    paddingBottom: 0,
  },
}));

interface DownloadButton {
  containerRef: React.RefObject<HTMLDivElement>;
  downloadMetaData: LT.DownloadMetadata[];
  buttonIcon?: JSX.Element;
  buttonText: string;
}

/**
 * React component displays a single button if there is only one item to be downloaded.
 * If there are multiple items to download then clicking then button will display a dialog
 * with a list of buttons so user can select which results (by date) they want to download.
 */
export const DownloadButton: React.FC<DownloadButton> = props => {
  const classes = useStyles({});
  const [isResultsModalOpen, openResultsModal] = React.useState<boolean>(false);

  // note: will fail loading if downloadMetaData length is zero, shouldn't normally happen.
  const firstUuid = props.downloadMetaData.length > 0 ? props.downloadMetaData[0].uuid : 'no-uuid';

  function openModal() {
    openResultsModal(true);
  }

  return (
    <>
      <DownloadItemButton
        containerRef={props.containerRef}
        downloadUuid={firstUuid}
        startIcon={props.buttonIcon}
        text={props.buttonText}
        className={classes.button}
        size="small"
        onClick={props.downloadMetaData.length > 1 ? openModal : undefined}
      />
      <DownloadItemsDialog
        containerRef={props.containerRef}
        testResults={props.downloadMetaData}
        isOpen={isResultsModalOpen}
        onClose={() => openResultsModal(false)}
      />
    </>
  );
};
