import { Launch } from '@material-ui/icons';
import { getSourceType } from '@plentyag/app-environment/src/common/utils';
import { PATHS } from '@plentyag/app-environment/src/paths';
import { Show } from '@plentyag/brand-ui/src/components';
import { Box, Chip, IconButton, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { AnyObservation } from '@plentyag/core/src/types';
import { SourceType } from '@plentyag/core/src/types/environment';
import { isNormalizedObservation, isRolledUpByTimeObservation } from '@plentyag/core/src/types/type-guards';
import React from 'react';
import { Link } from 'react-router-dom';

const dataTestIds = {
  sourceType: (sourceType: SourceType) => `metric-source-type-${sourceType}`,
  link: 'metric-source-link',
};

export { dataTestIds as dataTestIdsObservationSource };

export interface ObservationSource {
  observation: AnyObservation;
  fontSize?: string;
}

export const ObservationSource: React.FC<ObservationSource> = ({ observation, fontSize }) => {
  const LinkTo = ({ to }) => (
    <Link to={to} target="_blank" data-testid={dataTestIds.link}>
      <IconButton icon={Launch} />
    </Link>
  );

  const Text = ({ children }) => <Typography style={{ fontSize }}>{children}</Typography>;
  const sourceType = getSourceType(observation);

  function getContent() {
    if (isRolledUpByTimeObservation(observation)) {
      return (
        <>
          <Show when={sourceType === SourceType.ignition}>
            <Text>{observation.tagPath}</Text>
            <LinkTo to={PATHS.ignitionTagsPage(observation.tagPath)} />
          </Show>
          <Show when={sourceType === SourceType.device}>
            <Text>{observation.deviceId}</Text>
            <LinkTo to={PATHS.devicePage(observation.deviceId)} />
          </Show>
          <Show when={sourceType === SourceType.derived}>
            <Text>{observation.observationName}</Text>
            <LinkTo to={PATHS.derivedObservationsDefinitionsPage(observation.observationName)} />
          </Show>
          <Show when={sourceType === SourceType.other}>
            <Chip label={`client-id: ${observation.clientId ?? '--'}`} />
            <Box padding={1} />
            <Chip label={`device-id: ${observation.deviceId ?? '--'}`} />
            <Box padding={1} />
            <Chip label={`tag-path: ${observation.tagPath ?? '--'}`} />
          </Show>
        </>
      );
    }

    if (isNormalizedObservation(observation)) {
      return (
        <>
          <Show when={sourceType === SourceType.ignition}>
            <Text>{observation.otherProperties?.tagPath}</Text>
            <LinkTo to={PATHS.ignitionTagsPage(observation.otherProperties?.tagPath)} />
          </Show>
          <Show when={sourceType === SourceType.device}>
            <Text>{observation.deviceId}</Text>
            <LinkTo to={PATHS.devicePage(observation.deviceId)} />
          </Show>
          <Show when={sourceType === SourceType.derived}>
            <Text>{observation.observationName}</Text>
            <LinkTo to={PATHS.derivedObservationsDefinitionsPage(observation.observationName)} />
          </Show>
        </>
      );
    }

    return (
      <>
        <Show when={sourceType === SourceType.ignition}>
          <Text>{observation.otherProperties?.tagPath}</Text>
          <LinkTo to={PATHS.ignitionTagsPage(observation.otherProperties?.tagPath)} />
        </Show>
        <Show when={sourceType === SourceType.device}>
          <Text>{observation.deviceId}</Text>
          <LinkTo to={PATHS.devicePage(observation.deviceId)} />
        </Show>
        <Show when={sourceType === SourceType.derived}>
          <Text>{observation.name}</Text>
          <LinkTo to={PATHS.derivedObservationsDefinitionsPage(observation.name)} />
        </Show>
        <Show when={sourceType === SourceType.other}>
          <Chip label={`client-id: ${observation.clientId ?? '--'}`} />
          <Box padding={1} />
          <Chip label={`device-id: ${observation.deviceId ?? '--'}`} />
          <Box padding={1} />
          <Chip label={`tag-path: ${observation.otherProperties?.tagPath ?? '--'}`} />
        </Show>
      </>
    );
  }

  return (
    <Box display="flex" alignItems="center">
      <Chip label={sourceType} data-testid={dataTestIds.sourceType(sourceType)} />
      <Box padding={1} />
      {getContent()}
    </Box>
  );
};
