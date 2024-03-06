// eslint-disable-next-line no-restricted-imports
import { IconButton } from '@material-ui/core';
import { FileCopyOutlined } from '@material-ui/icons';
import { Card, CardItem, Show } from '@plentyag/brand-ui/src/components';
import { Tooltip, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import { parseErrorMessage } from '@plentyag/core/src/utils/parse-error-message';
import React from 'react';
import { useCopyToClipboard } from 'react-use';

import { useGetParentChildResources } from '../../../common/hooks';
import { SearchActions, SearchState, useSearch } from '../../hooks/use-search';
import { ResourceLinkWithType } from '../resource-link-with-type';

const dataTestIds = getScopedDataTestIds(
  {
    card: 'card',
    parent: 'parent',
    parentResourceLink: 'parent-resource-link',
    children: 'children',
    childrenResourceLink: 'children-resource-link',
    copyButton: 'copy-button',
    loadingError: 'loading-error',
  },
  'FamilyResouresCard'
);

export { dataTestIds as dataTestIdsFamilyResouresCard };

export const FamilyResouresCard: React.FC = () => {
  const [, copyToClipboard] = useCopyToClipboard();
  const searchResult = useSearch<SearchState['searchResult'], SearchActions>(state => state.searchResult)[0];

  const {
    error: errorLoadingParentChildState,
    isLoading: isLoadingParentChildState,
    parentResource,
    childResources,
  } = useGetParentChildResources(searchResult);

  const hasParent = Boolean(searchResult.parentResourceStateId);
  const hasChildren = searchResult.childResourceStateIds && searchResult.childResourceStateIds.length > 0;
  const hasFamily = hasParent || hasChildren;

  function handleCopyChildrenResourceIds() {
    const childrenResourceIds = childResources?.map(resource => resource.containerObj?.serial).join('\n');
    copyToClipboard(childrenResourceIds);
  }

  const title = (
    <Typography>
      Family Resources{' '}
      <Show when={!errorLoadingParentChildState && childResources?.length > 0}>
        <Tooltip arrow placement="top" title={<Typography>Copy children resources IDs to clipboard.</Typography>}>
          <IconButton
            data-testid={dataTestIds.copyButton}
            onClick={handleCopyChildrenResourceIds}
            size="small"
            color="default"
          >
            <FileCopyOutlined fontSize="inherit" />
          </IconButton>
        </Tooltip>
      </Show>
    </Typography>
  );

  return (
    <Show when={hasFamily}>
      <Card data-testid={dataTestIds.card} title={title} isLoading={isLoadingParentChildState}>
        <Show when={Boolean(errorLoadingParentChildState)}>
          <CardItem data-testid={dataTestIds.loadingError} name="Error loading parent/children resources states:">
            <Typography>{parseErrorMessage(errorLoadingParentChildState || '')}</Typography>
          </CardItem>
        </Show>
        <Show when={Boolean(!errorLoadingParentChildState && parentResource)}>
          <CardItem data-testid={dataTestIds.parent} name="Parent">
            <ResourceLinkWithType data-testid={dataTestIds.parentResourceLink} resource={parentResource} />
          </CardItem>
        </Show>
        <Show when={Boolean(!errorLoadingParentChildState && childResources?.length > 0)}>
          <CardItem data-testid={dataTestIds.children} name="Children">
            <>
              {childResources?.map(resource => (
                <ResourceLinkWithType
                  key={resource.id}
                  data-testid={dataTestIds.childrenResourceLink}
                  resource={resource}
                />
              ))}
            </>
          </CardItem>
        </Show>
      </Card>
    </Show>
  );
};
