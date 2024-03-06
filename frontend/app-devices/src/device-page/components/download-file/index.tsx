import { GetApp } from '@material-ui/icons';
import { Button, Link, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

const dataTestIds = {
  download: 'download-file-link',
  emptyState: 'download-file-empty-state',
};

export { dataTestIds as dataTestIdsDownloadFile };

export const EMPTY_STATE = 'No file uploaded yet.';

export interface DownloadFile {
  href?: string;
  'data-testid'?: string;
}

export const DownloadFile: React.FC<DownloadFile> = ({ href, 'data-testid': dataTestId }) => {
  return href ? (
    <Link
      href={href}
      target="_blank"
      style={{ textDecoration: 'none' }}
      data-testid={dataTestId ?? dataTestIds.download}
    >
      <Button color="default" variant="contained" startIcon={<GetApp />}>
        Download
      </Button>
    </Link>
  ) : (
    <Typography variant="subtitle2" color="textSecondary" data-testid={dataTestId ?? dataTestIds.emptyState}>
      {EMPTY_STATE}
    </Typography>
  );
};
