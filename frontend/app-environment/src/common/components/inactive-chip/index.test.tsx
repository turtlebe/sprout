import { mockAlertRules, mockSchedules } from '@plentyag/app-environment/src/common/test-helpers';
import { render } from '@testing-library/react';
import moment from 'moment';
import React from 'react';

import { InactiveChip } from '.';

const [schedule] = mockSchedules;
const [alertRule] = mockAlertRules;
const startsAt = moment().subtract(2, 'day').format();

describe('InactiveChip', () => {
  it('renders nothing when the schedule is undefined', () => {
    const { container } = render(<InactiveChip alertRuleOrSchedule={undefined} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when the schedule is active', () => {
    const { container } = render(
      <InactiveChip alertRuleOrSchedule={{ ...schedule, startsAt, activatesAt: startsAt }} />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when the schedule is active (activatesAt is in the past)', () => {
    const activatesAt = moment().subtract(1, 'day').format();

    const { container } = render(<InactiveChip alertRuleOrSchedule={{ ...schedule, startsAt, activatesAt }} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders the chip when the schedule is inactive', () => {
    const activatesAt = moment().add(1, 'day').format();

    const { container } = render(<InactiveChip alertRuleOrSchedule={{ ...schedule, startsAt, activatesAt }} />);

    expect(container).not.toBeEmptyDOMElement();
    expect(container).toHaveTextContent(`Schedule is inactive until ${moment(activatesAt).format('LLL')}`);
  });

  it('renders the chip when the schedule is inactive', () => {
    const activatesAt = moment().add(1, 'day').format();
    const endsAt = moment().add(2, 'day').format();

    const { container } = render(<InactiveChip alertRuleOrSchedule={{ ...schedule, startsAt, activatesAt, endsAt }} />);

    expect(container).not.toBeEmptyDOMElement();
    expect(container).toHaveTextContent(`Schedule is inactive until ${moment(activatesAt).format('LLL')}`);
  });

  it('renders the chip when the schedule has ended', () => {
    const endsAt = moment().subtract(1, 'second').format();

    const { container } = render(
      <InactiveChip alertRuleOrSchedule={{ ...schedule, startsAt, activatesAt: startsAt, endsAt }} />
    );

    expect(container).not.toBeEmptyDOMElement();
    expect(container).toHaveTextContent(`Schedule ended on ${moment(endsAt).format('LLL')}`);
  });

  it('renders the chip when the alert rule has ended', () => {
    const endsAt = moment().subtract(1, 'second').format();

    const { container } = render(
      <InactiveChip alertRuleOrSchedule={{ ...alertRule, startsAt, activatesAt: startsAt, endsAt }} />
    );

    expect(container).not.toBeEmptyDOMElement();
    expect(container).toHaveTextContent(`Alert Rule ended on ${moment(endsAt).format('LLL')}`);
  });

  it('renders the chip when the schedule ends in the future', () => {
    const endsAt = moment().add(1, 'second').format();

    const { container } = render(
      <InactiveChip alertRuleOrSchedule={{ ...schedule, startsAt, activatesAt: startsAt, endsAt }} />
    );

    expect(container).not.toBeEmptyDOMElement();
    expect(container).toHaveTextContent(`Schedule ends on ${moment(endsAt).format('LLL')}`);
  });

  it('renders the chip when the alert rule ends in the future', () => {
    const endsAt = moment().add(1, 'second').format();

    const { container } = render(
      <InactiveChip alertRuleOrSchedule={{ ...alertRule, startsAt, activatesAt: startsAt, endsAt }} />
    );

    expect(container).not.toBeEmptyDOMElement();
    expect(container).toHaveTextContent(`Alert Rule ends on ${moment(endsAt).format('LLL')}`);
  });
});
