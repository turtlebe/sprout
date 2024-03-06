import { buildMetric, buildSchedule, mockDashboards } from '@plentyag/app-environment/src/common/test-helpers';
import { DateTimeFormat } from '@plentyag/core/src/utils';
import { DateTime } from 'luxon';

import { getFilename, getLastSegment, prefix } from './get-filename';

const startDateTime = new Date('2023-01-01T00:00:00Z');
const endDateTime = new Date('2023-01-03T00:00:00Z');
const metrics = [buildMetric({}), buildMetric({})];
const schedule = buildSchedule({});
const [dashboard] = mockDashboards;
const widgetName = 'WidgetTestName';
const dates = `${DateTime.fromJSDate(startDateTime).toFormat(DateTimeFormat.SQL_WITHOUT_SECONDS)}-${DateTime.fromJSDate(
  endDateTime
).toFormat(DateTimeFormat.SQL_WITHOUT_SECONDS)}`;

describe('getFilename', () => {
  it('returns a name with the first Metric by default', () => {
    const filename = `${prefix}-${getLastSegment(metrics[0].path)}-${metrics[0].observationName}-${dates}`;

    expect(getFilename({ startDateTime, endDateTime, metrics })).toEqual(filename);
    expect(getFilename({ startDateTime, endDateTime, metrics, dashboard })).toEqual(filename);
    expect(getFilename({ startDateTime, endDateTime, metrics, widgetName })).toEqual(filename);
  });

  it('returns a name with the Schedule info', () => {
    const filename = `${prefix}-${getLastSegment(schedule.path)}-${dates}`;

    expect(getFilename({ startDateTime, endDateTime, metrics, schedule })).toEqual(filename);
  });

  it('returns a name with the Dashboard/Widget info', () => {
    const filename = `${prefix}-${dashboard.name}-${widgetName}-${dates}`;

    expect(getFilename({ startDateTime, endDateTime, metrics, dashboard, widgetName })).toEqual(filename);
  });
});
