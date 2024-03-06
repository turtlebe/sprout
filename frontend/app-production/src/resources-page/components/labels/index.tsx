import { Add, Clear } from '@material-ui/icons';
import { useGetOperationsPaths } from '@plentyag/app-production/src/common/hooks';
import { Box, Button, Tooltip } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { SearchActions, SearchState, useSearch } from '../../hooks/use-search';

import { getLabels } from './get-labels';
import { useGetAddLabelOperations } from './hooks/use-get-add-label-operations';
import { LabelTooltip } from './label-tooltip';
import { useStyles } from './styles';

export const dataTestIds = {
  removeButton: 'remove-button',
  removeButtonTooltip: 'remove-button-tooltip',
  addButton: 'add-button',
};

export interface Label {
  resourceId: string;
  name: string;
  type: ProdResources.LabelTypes;
}

interface Labels {
  removeLabel: React.Dispatch<React.SetStateAction<ProdActions.Operation>>;
  addLabel: React.Dispatch<React.SetStateAction<ProdActions.Operation>>;
}

export const REMOVE_CONTAINER_LABEL = 'RemoveContainerLabel';
export const REMOVE_MATERIAL_LABEL = 'RemoveMaterialLabel';
export const ADD_LABEL = 'AddLabelGeneral';
const labelOperations = [REMOVE_CONTAINER_LABEL, REMOVE_MATERIAL_LABEL, ADD_LABEL];

/**
 * Renders Add and Remove label buttons for current resource state.
 */
export const Labels: React.FC<Labels> = React.memo(props => {
  const searchResult = useSearch<SearchState['searchResult'], SearchActions>(state => state.searchResult)[0];
  const classes = useStyles();

  const site = searchResult?.location?.machine?.siteName;
  const { isLoading, operationPaths } = useGetOperationsPaths(labelOperations, 'request', site);

  const removeContainerLabelOperationPath = operationPaths.get(REMOVE_CONTAINER_LABEL);
  const removeMaterialLabelOperationPath = operationPaths.get(REMOVE_MATERIAL_LABEL);
  const addLabelOperationPath = operationPaths.get(ADD_LABEL);

  const { isLoading: isLoadingContainerAddLabelOperations, foundAddLabelOperations: containerAddLabelOperations } =
    useGetAddLabelOperations('CONTAINER', searchResult);
  const { isLoading: isLoadingMaterialAddLabelOperations, foundAddLabelOperations: materialAddLabelOperations } =
    useGetAddLabelOperations('MATERIAL', searchResult);

  function handleRemoveLabel(label: Label) {
    const removeLabelOperationPath =
      label.type === 'CONTAINER' ? removeContainerLabelOperationPath : removeMaterialLabelOperationPath;

    const prefilledArgs =
      label.type === 'CONTAINER'
        ? {
            id: { isDisabled: true, value: searchResult.containerObj?.serial || searchResult.materialObj?.lotName },
            label: { isDisabled: true, value: label.name },
            is_rework: { isDisabled: false, value: true },
          }
        : {
            id: { isDisabled: true, value: searchResult.containerObj?.serial || searchResult.materialObj?.lotName },
            label: { isDisabled: true, value: label.name },
          };

    const removeLabelOperation: ProdActions.Operation = {
      path: removeLabelOperationPath,
      prefilledArgs,
      context: {
        materialType: searchResult.materialObj?.materialType,
        containerType: searchResult.containerObj?.containerType,
      },
    };
    props.removeLabel(removeLabelOperation);
  }

  function handleAddLabel() {
    const containerLabels = searchResult.materialLabels ?? [];
    const materialLabels = searchResult.containerLabels ?? [];

    const addLabelOperation: ProdResources.AddLabel = {
      path: addLabelOperationPath,
      prefilledArgs: {
        id: {
          isDisabled: true,
          value: searchResult.containerObj?.serial || searchResult.materialObj?.lotName,
        },
      },
      context: {
        materialType: searchResult.materialObj?.materialType,
        containerType: searchResult.containerObj?.containerType,
        existingLabels: containerLabels.concat(materialLabels),
      },
    };
    props.addLabel(addLabelOperation);
  }

  const removeButtons = getLabels(searchResult).map(label => {
    const className =
      label.type === 'CONTAINER' ? classes.removeContainerLabelButton : classes.removeMaterialLabelButton;

    const labelToolTip = (
      <LabelTooltip
        label={label}
        isLoading={
          label.type === 'CONTAINER' ? isLoadingContainerAddLabelOperations : isLoadingMaterialAddLabelOperations
        }
        labelOperations={label.type === 'CONTAINER' ? containerAddLabelOperations : materialAddLabelOperations}
      />
    );

    const isDisabled =
      !removeContainerLabelOperationPath || !removeMaterialLabelOperationPath || isLoading || !searchResult?.isLatest;
    return (
      <Tooltip
        data-testid={dataTestIds.removeButtonTooltip}
        key={label.name}
        arrow
        title={isDisabled ? '' : labelToolTip}
      >
        <Button
          data-testid={dataTestIds.removeButton}
          className={className}
          variant="outlined"
          disabled={isDisabled}
          startIcon={<Clear />}
          onClick={() => handleRemoveLabel(label)}
        >
          {label.name}
        </Button>
      </Tooltip>
    );
  });

  return (
    <Box display="flex" flexWrap="wrap">
      {removeButtons}
      <Button
        data-testid={dataTestIds.addButton}
        className={classes.addLabelButton}
        disabled={!addLabelOperationPath || isLoading || !searchResult?.isLatest}
        variant="outlined"
        startIcon={<Add />}
        onClick={handleAddLabel}
      >
        label
      </Button>
    </Box>
  );
});
