import IconButton from '@material-ui/core/IconButton';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { LegendColor } from '@plentyag/app-environment/src/common/components/legend-color';
import { getColorForValue } from '@plentyag/app-environment/src/common/utils';
import { COLORS, DEFAULT_DATA_INTERPOLATION } from '@plentyag/app-environment/src/common/utils/constants';
import { Show } from '@plentyag/brand-ui/src/components';
import { Box, Collapse, Grid, Tooltip } from '@plentyag/brand-ui/src/material-ui/core';
import { RolledUpByTimeObservation } from '@plentyag/core/src/types';
import { DataInterpolation, DataInterpolationType } from '@plentyag/core/src/types/environment';
import { uniq } from 'lodash';
import React from 'react';

const dataTestIds = {
  root: 'graph-legend-non-numerical-item-root',
  button: 'collapsable-graph-legend-non-numerical-items-button',
  expanded: 'collapsable-graph-legend-non-numerical-items-expanded',
  notExpanded: 'collapsable-graph-legend-non-numerical-items-not-expanded',
  item: (value: string) => `graph-legend-non-numerical-item-${value}`,
};
const DEFAULT_DISPLAY_LIMIT = 5;

export { dataTestIds as dataTestIdsGraphLegendNonNumerical };

export interface GraphLegendNonNumerical {
  observations: RolledUpByTimeObservation[];
  dataInterpolation?: DataInterpolation;
}

export const GraphLegendNonNumerical: React.FC<GraphLegendNonNumerical> = ({
  observations = [],
  dataInterpolation = DEFAULT_DATA_INTERPOLATION,
}) => {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const valuesDomain = uniq(observations.map(o => o.value));
  const valuesDomainDisplayed = expanded ? valuesDomain : valuesDomain.slice(0, DEFAULT_DISPLAY_LIMIT);

  const ValuesDomain = ({ 'data-testid': dataTestId }) => (
    <div data-testid={dataTestId}>
      {dataInterpolation.value === DataInterpolationType.step ? (
        <Box key="Data" display="flex" alignItems="center" padding={1} data-testid={dataTestIds.item('data')}>
          <LegendColor backgroundColor={COLORS.data} />
          <Box padding={0.5} />
          Data
        </Box>
      ) : (
        valuesDomainDisplayed.map(value => (
          <Box key={value} display="flex" alignItems="center" padding={1} data-testid={dataTestIds.item(value)}>
            <LegendColor backgroundColor={getColorForValue(value)} />
            <Box padding={0.5} />
            {value}
          </Box>
        ))
      )}
    </div>
  );

  return (
    <Grid container>
      <Grid item xs={10}>
        <Box display="flex" flexWrap="wrap" data-testid={dataTestIds.root}>
          <Show when={!expanded}>
            <ValuesDomain data-testid={dataTestIds.notExpanded} />
          </Show>
          <Show when={Boolean(valuesDomain.length > DEFAULT_DISPLAY_LIMIT)}>
            <Box display="flex" width="100%" justifyContent="center" paddingBottom={1}>
              <Tooltip
                title={`Click to ${expanded ? 'hide' : 'show'} all ${
                  valuesDomain.length - DEFAULT_DISPLAY_LIMIT
                } observations`}
              >
                <IconButton
                  onClick={handleExpandClick}
                  aria-label="expand"
                  aria-expanded={expanded}
                  data-testid={dataTestIds.button}
                >
                  {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                </IconButton>
              </Tooltip>
            </Box>
            <Collapse in={expanded}>
              <ValuesDomain data-testid={dataTestIds.expanded} />
            </Collapse>
          </Show>
        </Box>
      </Grid>
    </Grid>
  );
};
