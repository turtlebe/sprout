import { Schedule as IconSchedule, PermDeviceInformation } from '@material-ui/icons';
import { Show } from '@plentyag/brand-ui/src/components/show';
import { Box, Chip } from '@plentyag/brand-ui/src/material-ui/core';
import { isChildDeviceLocation, isDeviceLocation, isScheduleDefinition } from '@plentyag/core/src/farm-def/type-guards';
import { isSchedule } from '@plentyag/core/src/types/environment/type-guards';
import { TreeNodeCount } from '@plentyag/core/src/utils/observation-groups';
import React from 'react';

import { AutocompleteOptionWithCount } from '../../autocomplete-option-with-count';
import { AllowedObjects, useAutocompleteFarmDefObjectStore } from '../hooks';
import { getLastPathSegment, getScheduleTimeLabel } from '../utils';

interface AutocompleteOption {
  id: string;
  option: AllowedObjects;
  showDeviceLocations: boolean;
  showScheduleDefinitions: boolean;
  showScheduleDefinitionParents: boolean;
  treeObservationGroups: TreeNodeCount;
}

export const AutocompleteOption: React.FC<AutocompleteOption> = ({
  id,
  option,
  showDeviceLocations,
  showScheduleDefinitions,
  showScheduleDefinitionParents,
  treeObservationGroups,
}) => {
  const [state] = useAutocompleteFarmDefObjectStore(id);

  if (!showDeviceLocations && !showScheduleDefinitions && !showScheduleDefinitionParents && !treeObservationGroups) {
    return <>{getLastPathSegment(option)}</>;
  }

  if (isSchedule(option)) {
    return (
      <Box>
        <Box display="flex" alignItems="center">
          <IconSchedule />
          {getLastPathSegment(option)}
          <Box padding={0.25} />
          <Chip label={`Priority: ${option.priority}`} />
          <Box padding={0.25} />
          <Chip label={getScheduleTimeLabel(option)} />
        </Box>
        <Show when={Boolean(option.description)}>
          <Box padding={0.25} />
          <>{option.description}</>
        </Show>
      </Box>
    );
  }

  if (isDeviceLocation(option) || isChildDeviceLocation(option)) {
    return (
      <>
        <PermDeviceInformation />
        {getLastPathSegment(option)}
      </>
    );
  }

  if (isScheduleDefinition(option)) {
    return (
      <>
        <IconSchedule />
        {getLastPathSegment(option)}
      </>
    );
  }

  if (showDeviceLocations && state.deviceLocationCountMap.has(option.path)) {
    return <>{getLastPathSegment(option) + ` (${state.deviceLocationCountMap.get(option.path)})`}</>;
  }

  if (showScheduleDefinitions && state.scheduleDefinitionCountMap.has(option.path)) {
    return <>{getLastPathSegment(option) + ` (${state.scheduleDefinitionCountMap.get(option.path)})`}</>;
  }

  // When asking for the parents who have a ScheduleDefinitions, we don't want to show the count.
  if (showScheduleDefinitionParents && state.scheduleDefinitionCountMap.has(option.path)) {
    return <>{getLastPathSegment(option)}</>;
  }

  if (treeObservationGroups) {
    const node = treeObservationGroups.children[option.path];
    if (node) {
      return (
        <AutocompleteOptionWithCount
          label={getLastPathSegment(option)}
          count={node.count}
          lastObservedAt={node.lastObservedAt}
        />
      );
    }
  }

  return <>{getLastPathSegment(option)}</>;
};
