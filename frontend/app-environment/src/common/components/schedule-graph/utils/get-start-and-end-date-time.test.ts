import { mockSchedules } from '@plentyag/app-environment/src/common/test-helpers';
import { getEditModeStartDateTime } from '@plentyag/app-environment/src/common/utils';
import moment from 'moment';

import { getStartAndEndDateTime } from '.';

jest.mock('@plentyag/app-environment/src/common/utils/get-edit-mode-start-date-time');

const mockGetEditModeStartDateTime = getEditModeStartDateTime as jest.Mock;

const [schedule] = mockSchedules;

describe('getStartAndEndDateTime', () => {
  it('returns the startDateTime and endDateTime when not editing', () => {
    const startDateTime = moment('2020-01-01T00:00:00Z').toDate();
    const endDateTime = moment('2020-02-01T00:00:00Z').toDate();

    expect(
      getStartAndEndDateTime({
        startDateTime,
        endDateTime,
        isEditing: false,
        schedule,
      })
    ).toEqual({
      startDateTime,
      endDateTime,
    });

    expect(mockGetEditModeStartDateTime).not.toHaveBeenCalled();
  });

  it("returns the Schedule's startsAt + repeatInterval when editing", () => {
    const startDateTime = moment('2020-01-01T00:00:00Z').toDate();
    const endDateTime = moment('2020-02-01T00:00:00Z').toDate();

    mockGetEditModeStartDateTime.mockReturnValue(moment(schedule.startsAt));

    expect(
      getStartAndEndDateTime({
        startDateTime,
        endDateTime,
        isEditing: true,
        schedule,
      })
    ).toEqual({
      startDateTime: moment(schedule.startsAt).toDate(),
      endDateTime: moment(schedule.startsAt).add(schedule.repeatInterval, 'seconds').toDate(),
    });

    expect(mockGetEditModeStartDateTime).toHaveBeenCalledWith(schedule);
  });
});
