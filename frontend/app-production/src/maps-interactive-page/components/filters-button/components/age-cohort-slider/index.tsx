import { useQueryParameter } from '@plentyag/app-production/src/maps-interactive-page/hooks/use-query-parameter';
import { MapsState } from '@plentyag/app-production/src/maps-interactive-page/types';
import { Box, Checkbox, FormControlLabel, Slider } from '@plentyag/brand-ui/src/material-ui/core';
import { ChangeEvent, FC, MouseEvent } from 'react';

import { DEFAULT_ALL, DEFAULT_ALL_RECORD } from './constants';
import { useSliderDataFromMapsState } from './hooks/use-slider-data-from-maps-state';
import { useStyles } from './styles';
import { hasLoadDates } from './utils/has-load-dates';

const dataTestIds = {
  root: 'age-cohort-slider',
  showAll: 'age-cohort-slider-show-all',
  slider: 'age-cohort-slider-slider',
};

export { dataTestIds as dataTestIdsAgeCohortSlider };

interface AgeCohortSlider {
  mapsState: MapsState;
}

export const AgeCohortSlider: FC<AgeCohortSlider> = ({ mapsState }) => {
  const { parameters, setParameters } = useQueryParameter();

  const { selectedDate, ageCohortDate } = parameters;

  const classes = useStyles({});
  const { marks, marksRecord, value } = useSliderDataFromMapsState(mapsState, selectedDate, ageCohortDate);

  const isShowAll = value === DEFAULT_ALL.value;
  const min = marks?.[0]?.value;
  const max = marks?.[marks?.length - 1]?.value;
  const isDisabled = !Boolean(mapsState) || !hasLoadDates(mapsState);

  const handleChange = (_e: ChangeEvent, newValue: number) => {
    if (value !== newValue) {
      const ageCohortDate = marksRecord[newValue.toString()].ageCohortDate;
      setParameters({ ageCohortDate });
    }
  };

  const handleCheckClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const newValue = isShowAll ? marksRecord[min] : DEFAULT_ALL_RECORD;
    setParameters({ ageCohortDate: newValue.ageCohortDate });
  };

  const valueLabelFormat = value => {
    const label = marksRecord?.[value.toString()]?.shortLabel;
    if (!label || label === 'Today') {
      return label;
    }
    return `Day ${label}`;
  };

  return (
    <Box data-testid={dataTestIds.root} className={classes.root}>
      <Box className={classes.selectAll}>
        <FormControlLabel
          value={DEFAULT_ALL.value}
          control={
            <Checkbox
              disabled={isDisabled}
              color="primary"
              checked={isShowAll}
              onClick={handleCheckClick}
              data-testid={dataTestIds.showAll}
            />
          }
          label="Show All"
          labelPlacement="bottom"
        />
      </Box>
      <Box className={classes.slider} px={3}>
        <Slider
          data-testid={dataTestIds.slider}
          disabled={isShowAll || isDisabled}
          classes={{ valueLabel: classes.valueLabel }}
          aria-label="Age Cohort Slider"
          step={null}
          min={min}
          max={max}
          valueLabelDisplay={isShowAll ? 'off' : 'on'} // show 'on' if enabled
          valueLabelFormat={valueLabelFormat}
          value={value}
          marks={marks}
          onChange={handleChange}
        />
      </Box>
    </Box>
  );
};
