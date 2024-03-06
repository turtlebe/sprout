import { Box } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { DownloadButton } from './download-button';
import { Placeholder } from './placeholder-renderer';

interface Props {
  value: {
    containerRef: React.RefObject<HTMLDivElement>;
    labTestProvider: string;
    formSubmissionMetadata: LT.DownloadMetadata[];
  };
}

/**
 * Custom renderer for 'Lab' column - form submissions events exists then button will allow downloading
 * of the cvs form. Otherwise will just show lab provider name.
 */
export const LabRenderer: React.FC<Props> = ({ value }) => {
  if (!value) {
    return <Placeholder />;
  }
  const downloadMetaData = value.formSubmissionMetadata;
  if (downloadMetaData && downloadMetaData.length > 0) {
    return (
      <Box component="div" display="flex" flexDirection="column" justifyContent="center" alignItems="flex-start">
        <DownloadButton
          containerRef={value.containerRef}
          downloadMetaData={downloadMetaData}
          buttonText={value.labTestProvider}
        />
      </Box>
    );
  } else {
    return <>{value.labTestProvider}</>;
  }
};
