import {
  buildAlertRule,
  buildMetric,
  buildSchedule,
  buildWidget,
  buildWidgetItem,
} from '@plentyag/app-environment/src/common/test-helpers';
import { act, renderHook } from '@testing-library/react-hooks';

import { useWidgetItemHandlers } from '.';

describe('useWidgetItemHandlers', () => {
  describe('deleteItem', () => {
    const getWidget = () =>
      buildWidget({
        items: [
          buildWidgetItem(
            buildMetric({
              path: 'sites/LAR1/NorthBuilding/GP1',
              measurementType: 'TEMPERATURE',
              observationName: 'AirTemperature',
            })
          ),
          buildWidgetItem(
            buildMetric({
              path: 'sites/LAR1/NorthBuilding/GP2',
              measurementType: 'TEMPERATURE',
              observationName: 'AirTemperature',
            })
          ),
          buildWidgetItem(
            buildMetric({
              path: 'sites/LAR1/NorthBuilding/GP3',
              measurementType: 'TEMPERATURE',
              observationName: 'AirTemperature',
            })
          ),
        ],
      });

    it('deletes the first item', () => {
      const widget = getWidget();
      const { items } = widget;

      const { result } = renderHook(() => useWidgetItemHandlers({ widget }));

      expect(result.current.items).toEqual(items);

      act(() => result.current.deleteItem(items[0]));

      expect(items).toHaveLength(3); // did not mutate the original array
      expect(result.current.items).toHaveLength(2);
      expect(result.current.items).toEqual([items[1], items[2]]);
    });

    it('deletes the second item', () => {
      const widget = getWidget();
      const { items } = widget;

      const { result } = renderHook(() => useWidgetItemHandlers({ widget }));

      expect(result.current.items).toEqual(items);

      act(() => result.current.deleteItem(items[1]));

      expect(result.current.items).toHaveLength(2);
      expect(result.current.items).toEqual([items[0], items[2]]);
    });

    it('deletes the third item', () => {
      const widget = getWidget();
      const { items } = widget;

      const { result } = renderHook(() => useWidgetItemHandlers({ widget }));

      expect(result.current.items).toEqual(items);

      act(() => result.current.deleteItem(items[2]));

      expect(result.current.items).toHaveLength(2);
      expect(result.current.items).toEqual([items[0], items[1]]);
    });
  });

  describe('addItem', () => {
    it('adds a Metric', () => {
      const widget = buildWidget({});
      const metric = buildMetric({});

      const { result } = renderHook(() => useWidgetItemHandlers({ widget }));

      expect(result.current.items).toHaveLength(0);

      act(() => result.current.addItem(metric));

      expect(result.current.items).toEqual([
        {
          widgetId: widget.id,
          itemId: metric.id,
          itemType: 'METRIC',
          metric,
          id: 'new-item-0',
          options: {},
          createdAt: '',
          createdBy: '',
          updatedAt: '',
          updatedBy: '',
        },
      ]);
    });

    it('adds a Metric with an option for an alertRule', () => {
      const widget = buildWidget({});
      const metric = buildMetric({});
      const alertRuleId = buildAlertRule({}).id;

      const { result } = renderHook(() => useWidgetItemHandlers({ widget }));

      expect(result.current.items).toHaveLength(0);

      act(() => result.current.addItem(metric, { alertRuleId }));

      expect(result.current.items).toEqual([
        {
          widgetId: widget.id,
          itemId: metric.id,
          itemType: 'METRIC',
          metric,
          id: 'new-item-0',
          options: { alertRuleId },
          createdAt: '',
          createdBy: '',
          updatedAt: '',
          updatedBy: '',
        },
      ]);
    });

    it('adds a Schedule', () => {
      const widget = buildWidget({});
      const schedule = buildSchedule({});

      const { result } = renderHook(() => useWidgetItemHandlers({ widget }));

      expect(result.current.items).toHaveLength(0);

      act(() => result.current.addItem(schedule));

      expect(result.current.items).toEqual([
        {
          widgetId: widget.id,
          itemId: schedule.id,
          itemType: 'SCHEDULE',
          schedule,
          id: 'new-item-0',
          options: {},
          createdAt: '',
          createdBy: '',
          updatedAt: '',
          updatedBy: '',
        },
      ]);
    });
  });

  describe('editItem', () => {
    const widget = buildWidget({
      items: [
        buildWidgetItem(
          buildMetric({
            path: 'sites/LAR1/NorthBuilding/GP1',
            measurementType: 'TEMPERATURE',
            observationName: 'AirTemperature',
          })
        ),
        buildWidgetItem(
          buildMetric({
            path: 'sites/LAR1/NorthBuilding/GP2',
            measurementType: 'TEMPERATURE',
            observationName: 'AirTemperature',
          })
        ),
        buildWidgetItem(
          buildMetric({
            path: 'sites/LAR1/NorthBuilding/GP3',
            measurementType: 'TEMPERATURE',
            observationName: 'AirTemperature',
          })
        ),
        buildWidgetItem(buildSchedule({})),
      ],
    });
    const { items } = widget;

    it('replaces a metric', () => {
      const newMetric = buildMetric({
        path: 'sites/LAR1/NorthBuilding/GP1',
        measurementType: 'TEMPERATURE',
        observationName: 'PodTemperature',
      });

      const { result } = renderHook(() => useWidgetItemHandlers({ widget }));

      act(() => result.current.editItem(items[1], newMetric));

      expect(result.current.items).toEqual([
        ...items.slice(0, 1),
        { ...items[1], itemId: newMetric.id, itemType: 'METRIC', metric: newMetric },
        ...items.slice(2),
      ]);
    });

    it('replaces a metric with an alert rule', () => {
      const newMetric = buildMetric({
        path: 'sites/LAR1/NorthBuilding/GP1',
        measurementType: 'TEMPERATURE',
        observationName: 'PodTemperature',
      });
      const alertRuleId = buildAlertRule({}).id;

      const { result } = renderHook(() => useWidgetItemHandlers({ widget }));

      act(() => result.current.editItem(items[1], newMetric, { alertRuleId }));

      expect(result.current.items).toEqual([
        ...items.slice(0, 1),
        { ...items[1], itemId: newMetric.id, itemType: 'METRIC', metric: newMetric, options: { alertRuleId } },
        ...items.slice(2),
      ]);
    });

    it('replaces a schedule', () => {
      const newSchedule = buildSchedule({});
      const { result } = renderHook(() => useWidgetItemHandlers({ widget }));

      act(() => result.current.editItem(items[3], newSchedule));

      expect(result.current.items).toEqual([
        ...items.slice(0, 3),
        { ...items[3], itemId: newSchedule.id, itemType: 'SCHEDULE', schedule: newSchedule },
      ]);
    });
  });
});
