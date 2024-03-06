import { getShortenedPath } from '@plentyag/core/src/utils';
import { render } from '@testing-library/react';
import React from 'react';

import { mockSchedules } from '../../test-helpers';

import { ChipSchedule, dataTestIdsChipSchedule as dataTestIds } from '.';

const [schedule] = mockSchedules;

describe('ChipSchedule', () => {
  it('renders a Schedule', () => {
    const { queryByTestId } = render(<ChipSchedule schedule={schedule} />);

    expect(queryByTestId(dataTestIds.type)).toHaveTextContent('Schedule');
    expect(queryByTestId(dataTestIds.path)).toHaveTextContent(getShortenedPath(schedule.path));
    expect(queryByTestId(dataTestIds.actionDefinitionKey)).not.toBeInTheDocument();
  });

  it('renders a Schedule with an actionDefinitionKey', () => {
    const actionDefinitionKey = 'actionDefinitionKey';
    const { queryByTestId } = render(<ChipSchedule schedule={schedule} actionDefinitionKey={actionDefinitionKey} />);

    expect(queryByTestId(dataTestIds.type)).toHaveTextContent('Schedule');
    expect(queryByTestId(dataTestIds.path)).toHaveTextContent(getShortenedPath(schedule.path));
    expect(queryByTestId(dataTestIds.actionDefinitionKey)).toHaveTextContent(actionDefinitionKey);
  });
});
