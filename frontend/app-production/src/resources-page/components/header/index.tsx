import { getMaterialCommentableId, getMaterialCommentableType } from '@plentyag/app-production/src/common/utils';
import { ButtonViewComments } from '@plentyag/brand-ui/src/components';
import { Box, Drawer, Grid, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { ActionsForm } from '../../../actions-form-page/components';
import { EditResource, Operations } from '../../../common/components';
import { SearchActions, SearchState, useSearch } from '../../hooks/use-search';
import { Labels } from '../labels';
import { Location } from '../location';

import { getAllowedOperations, getTitle } from './utils';

export const dataTestIds = {
  header: 'header',
  title: 'title',
  drawer: 'drawer',
  commentIcon: 'comment-icon',
};

export interface Header {
  onCommentClick?: () => void;
}

export const Header: React.FC<Header> = React.memo(({ onCommentClick }) => {
  const [searchResult, { refreshSearch }] = useSearch<SearchState['searchResult'], SearchActions>(
    state => state.searchResult
  );
  const [selectedOperation, selectOperation] = React.useState<ProdActions.Operation>();

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  function handleCloseActionForm() {
    // prevent closing while submission in progress.
    if (!isSubmitting) {
      selectOperation(null);
      refreshSearch();
    }
  }

  if (!searchResult) {
    return null;
  }

  const allowedOperations = getAllowedOperations(searchResult);

  return (
    <Grid data-testid={dataTestIds.header} container spacing={4}>
      <Grid item sm={12} md={6}>
        <Box display="flex" alignItems="center">
          <Typography data-testid={dataTestIds.title} variant="h5">
            {getTitle(searchResult)}
          </Typography>
          {onCommentClick && (
            <ButtonViewComments
              onClick={onCommentClick}
              data-testid={dataTestIds.commentIcon}
              commentableId={getMaterialCommentableId(searchResult)}
              commentableType={getMaterialCommentableType(searchResult)}
            />
          )}
        </Box>
        <Box mt={1} mb={1}>
          <Location location={searchResult?.location} />
        </Box>
        <Box mb={1}>
          {searchResult.containerId && (
            <Typography component="p" variant="caption">
              Container ID: {searchResult.containerId}
            </Typography>
          )}
          {searchResult.materialId && (
            <Typography component="p" variant="caption">
              Material ID: {searchResult.materialId}
            </Typography>
          )}
          {searchResult && (
            <Typography component="p" variant="caption">
              Last Action Date: {new Date(searchResult.updatedAt).toLocaleString()}
            </Typography>
          )}
        </Box>

        <Labels removeLabel={selectOperation} addLabel={selectOperation} />
      </Grid>
      <Grid item sm={12} md={6}>
        <Operations
          selectOperation={selectOperation}
          siteName={searchResult?.location?.machine?.siteName}
          allowedOperations={allowedOperations}
          areOperationsEnabled={searchResult.isLatest}
        />
        <EditResource resourceState={searchResult} onClose={handleCloseActionForm} />
      </Grid>
      <Drawer
        data-testid={dataTestIds.drawer}
        anchor="right"
        open={!!selectedOperation}
        onClose={handleCloseActionForm}
      >
        {selectedOperation && (
          <ActionsForm
            operation={selectedOperation}
            disableSubmitAfterSuccess={true}
            onIsSubmittingChange={setIsSubmitting}
          />
        )}
      </Drawer>
    </Grid>
  );
});
