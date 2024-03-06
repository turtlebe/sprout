import { useLocalStorageTimeSummarization } from '@plentyag/app-environment/src/common/hooks';
import { Dropdown, DropdownItem, DropdownItemText } from '@plentyag/brand-ui/src/components';
import { TimeSummarization } from '@plentyag/core/src/types/environment';
import React from 'react';
import { titleCase } from 'voca';

const dataTestIds = {
  root: 'dropdown-time-summarization-root',
  item: (timeSummarization: TimeSummarization) => `dropdown-time-summarization-item-${timeSummarization}`,
};

export { dataTestIds as dataTestIdsDropdownTimeSummarization };

export interface DropdownTimeSummarization {
  onChange: (timeSummarization: TimeSummarization) => void;
}

/**
 * Dropdown that lets the user choose a certain Time Summarization.
 *
 * When using ODS RolledUpByTimeObservationsAPI, multiple values are available: median, mean, min, max.
 *
 * This dropdown lets the user choose which value gets displayed on the chart.
 */
export const DropdownTimeSummarization: React.FC<DropdownTimeSummarization> = ({ onChange }) => {
  const [currentTimeSummarization, setTimeSummarization] = useLocalStorageTimeSummarization();

  const handleChange = (timeSummarization: TimeSummarization) => {
    if (currentTimeSummarization === timeSummarization) {
      return;
    }

    setTimeSummarization(timeSummarization);
    onChange(timeSummarization);
  };

  return (
    <Dropdown
      color="default"
      variant="outlined"
      label={titleCase(currentTimeSummarization)}
      data-testid={dataTestIds.root}
    >
      {Object.values(TimeSummarization).map(timeSummarization => (
        <DropdownItem
          key={timeSummarization}
          onClick={() => handleChange(timeSummarization)}
          data-testid={dataTestIds.item(timeSummarization)}
        >
          <DropdownItemText>{titleCase(timeSummarization)}</DropdownItemText>
        </DropdownItem>
      ))}
    </Dropdown>
  );
};
