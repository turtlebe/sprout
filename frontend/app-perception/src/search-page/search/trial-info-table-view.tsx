import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { SearchResult } from '../../common/types/interfaces';

const dataTestIds = {
  table: 'trial-info-view-table',
  header: 'trial-info-view-table-header',
  row: (trialId: string) => `trial-info-view-row-${trialId}`,
};

export { dataTestIds as dataTestIdsTrialInfoView };

interface TrialInfoView {
  results: SearchResult[];
  onBackToSearch: () => void;
}

export const TrialInfoView: React.FC<TrialInfoView> = ({ results, onBackToSearch }) => {
  return (
    <Box display="flex" flexDirection="column" flexGrow={1}>
      <Button onClick={onBackToSearch}>Back to Search</Button>
      <TableContainer data-testid={dataTestIds.table}>
        <Table size="small">
          <TableHead data-testid={dataTestIds.header}>
            <TableRow>
              <TableCell>POS UUID</TableCell>
              <TableCell>Trial Number</TableCell>
              <TableCell>Treatment Number</TableCell>
              <TableCell>Plot Id</TableCell>
              <TableCell>Plant Id</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results &&
              results.map(result =>
                result.trials.map(trial => (
                  <TableRow key={result.uuid} data-testid={dataTestIds.row(result.uuid)}>
                    <TableCell>{result.uuid}</TableCell>
                    <TableCell>{trial.trialNum}</TableCell>
                    <TableCell>{trial.treatmentNum}</TableCell>
                    <TableCell>{trial.plotId}</TableCell>
                    <TableCell>{trial.plantId}</TableCell>
                  </TableRow>
                ))
              )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
