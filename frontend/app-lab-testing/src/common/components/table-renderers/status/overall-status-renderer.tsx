import { Box } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { DownloadButton } from '../download-button';
import { Placeholder } from '../placeholder-renderer';

import { StatusIcon } from './status-icon';

interface Props {
  value: {
    containerRef: React.RefObject<HTMLDivElement>;
    status: boolean | null; // true if passed, false if failed, null --> pending/partial
    data: string; // pass, fail, pending, partial
    // if any lab blobs exists then this will have results that user can see.
    // test could be passed, failed, or incomplete, see: https://plentyag.atlassian.net/browse/SD-6013
    testResultsMetaData: LT.DownloadMetadata[];
  };
}

/**
 * Custom renderer for 'Status' column - displays the status summary for all tests in given row.
 * For tests that are failed or passed, will have tests results - provides a button to download and view results.
 */
export const OverallStatusRenderer: React.FC<Props> = ({ value }) => {
  if (!value) {
    return <Placeholder />;
  }
  const status = value.status;
  const statusData = value.data;
  const downloadMetaData = value.testResultsMetaData;

  const statusIcon: JSX.Element = <StatusIcon status={status} />;

  // if we have test results then provide status button to allow user to view the
  // lab test results.
  if (downloadMetaData && downloadMetaData.length > 0) {
    return (
      <Box component="div" display="flex" flexDirection="column" justifyContent="center" alignItems="flex-start">
        <DownloadButton
          containerRef={value.containerRef}
          downloadMetaData={downloadMetaData}
          buttonIcon={statusIcon}
          buttonText={statusData}
        />
      </Box>
    );
  } else {
    return (
      <Box component="span" display="flex" flexDirection="row" alignItems="center">
        {statusIcon}
        {statusData}
      </Box>
    );
  }
};
