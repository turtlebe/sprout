import { isValidTimeGranularity } from '@plentyag/app-environment/src/common/utils';
import { Dropdown, DropdownItem, DropdownItemText } from '@plentyag/brand-ui/src/components';
import { TimeGranularity } from '@plentyag/core/src/types/environment';
import { isEqual } from 'lodash';
import React from 'react';

const dataTestIds = {
  root: 'dropdown-time-granularity',
  item: (timeGranularity: TimeGranularity) => `dropdown-time-granularity-item-${timeGranularity.value}`,
};

export { dataTestIds as dataTestIdsDropdownTimeGranularity };

export interface DropdownTimeGranularity {
  startDateTime: Date;
  endDateTime: Date;
  timeGranularity: TimeGranularity;
  timeGranularities: TimeGranularity[];
  onChange: (timeGranularity: TimeGranularity) => void;
}

/**
 * Dropdown that lets the user choose a certain Time Granularity.
 *
 * When using ODS RolledUpByTimeObservationsAPI, obsevations are rolled up every X minutes
 * where X corresponds to the Time Granularity.
 */
export const DropdownTimeGranularity: React.FC<DropdownTimeGranularity> = ({
  startDateTime,
  endDateTime,
  timeGranularity,
  timeGranularities,
  onChange,
}) => {
  const [currentTimeGranularity, setTimeGranularity] = React.useState<TimeGranularity>(timeGranularity);

  const handleChange = (timeGranularity: TimeGranularity) => {
    if (currentTimeGranularity === timeGranularity) {
      return;
    }

    setTimeGranularity(timeGranularity);
    onChange(timeGranularity);
  };

  React.useEffect(() => {
    if (!isEqual(currentTimeGranularity, timeGranularity)) {
      setTimeGranularity(timeGranularity);
    }
  }, [timeGranularity]);

  return (
    <Dropdown color="default" variant="outlined" label={currentTimeGranularity.label} data-testid={dataTestIds.root}>
      {timeGranularities.map(timeGranularity => (
        <DropdownItem
          key={timeGranularity.value}
          onClick={() => handleChange(timeGranularity)}
          disabled={!isValidTimeGranularity({ timeGranularity, startDateTime, endDateTime })}
          data-testid={dataTestIds.item(timeGranularity)}
        >
          <DropdownItemText>{timeGranularity.label}</DropdownItemText>
        </DropdownItem>
      ))}
    </Dropdown>
  );
};
