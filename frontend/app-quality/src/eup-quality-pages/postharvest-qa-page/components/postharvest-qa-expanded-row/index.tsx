import { CircularProgressCentered } from '@plentyag/brand-ui/src/components';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@plentyag/brand-ui/src/material-ui/core';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React from 'react';

import { useFetchAssessmentTypes } from '../../hooks';
import { useFetchPostharvestTallyBySku } from '../../hooks/use-fetch-postharvest-tally-by-sku';
import { getPostharvestQaId } from '../../utils/get-postharvest-qa-id';
import { getTallyValue } from '../../utils/get-tally-value';

import { useStyles } from './styles';

const dataTestIds = getScopedDataTestIds(
  {
    loading: 'loading',
    assessments: 'row-assessments',
    assessmentRow: (key: string) => `row-assessments-${key}`,
  },
  'postharvest-qa-expanded-row'
);

export { dataTestIds as dataTestIdsPostharvestQaExpandedRow };

export interface PostharvestQaExpandedRow {
  siteName: string;
  farmName: string;
  lotName: string;
  skuName: string;
}

export const PostharvestQaExpandedRow: React.FC<PostharvestQaExpandedRow> = ({
  siteName,
  farmName,
  lotName,
  skuName,
}) => {
  const classes = useStyles({});

  const { assessmentTypes, isLoading: isLoadingAssessmentTypes } = useFetchAssessmentTypes();

  const { postharvestSkuTally, isLoading: isLoadingTally } = useFetchPostharvestTallyBySku({
    siteName,
    farmName,
    lotName,
    skuName,
  });

  const isLoading = isLoadingAssessmentTypes || isLoadingTally;

  if (isLoading) {
    return (
      <Box width="100%">
        <CircularProgressCentered data-testid={dataTestIds.loading} />
      </Box>
    );
  }

  return (
    <Box pl={6} className={classes.root} data-testid={dataTestIds.root}>
      <Box className={classes.layout}>
        <Box flex={1}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.title}>Assessment</TableCell>
                  <TableCell className={classes.title} align="right">
                    Tally
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody data-testid={dataTestIds.assessments}>
                {assessmentTypes.map(assessmentType => {
                  const label = assessmentType.label;
                  const key = `${getPostharvestQaId({ lot: lotName, sku: skuName })}_${assessmentType.name}`;
                  return (
                    !assessmentType.validation.hideFromTally && (
                      <TableRow key={key} data-testid={dataTestIds.assessmentRow(key)}>
                        <TableCell className={classes.content}>{label}</TableCell>
                        <TableCell className={classes.content} align="right">
                          {getTallyValue(
                            postharvestSkuTally.tallyResults.assessmentTally.find(
                              assessment => assessment.name === assessmentType.name
                            )?.values
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};
