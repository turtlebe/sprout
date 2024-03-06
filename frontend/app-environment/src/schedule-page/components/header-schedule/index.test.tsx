import { mockSchedules } from '@plentyag/app-environment/src/common/test-helpers';
import { getShortenedPath } from '@plentyag/core/src/utils';
import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { HeaderSchedule } from '.';

const [schedule] = mockSchedules;

describe('HeaderSchedule', () => {
  it('renders a placeholder in the Breadcrumbs', () => {
    const { container } = render(<HeaderSchedule schedule={schedule} isLoading={true} />, {
      wrapper: props => <MemoryRouter {...props} />,
    });

    expect(container).toHaveTextContent('--');
  });

  it('renders information about the schedule', () => {
    const { container } = render(<HeaderSchedule schedule={schedule} isLoading={false} />, {
      wrapper: props => <MemoryRouter {...props} />,
    });

    expect(container).toHaveTextContent(schedule.id);
    expect(container).toHaveTextContent(schedule.scheduleType);
    expect(container).toHaveTextContent(schedule.description);
    expect(container).toHaveTextContent(getShortenedPath(schedule.path));
  });
});
