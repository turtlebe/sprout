import {
  clearUnitPreferenceLocalStorage,
  setUnitPreferenceLocalStorage,
} from '@plentyag/app-environment/src/common/hooks/use-local-storage-units-preferences/test-helpers';
import { mockAlertRules, mockMetrics } from '@plentyag/app-environment/src/common/test-helpers';
import { mockMeasurementTypes } from '@plentyag/core/src/farm-def/test-helpers';
import { useSwrAxios } from '@plentyag/core/src/hooks';
import { AlertRuleType } from '@plentyag/core/src/types/environment';
import { renderHook } from '@testing-library/react-hooks';

import { useAlertRuleFormGenConfig } from '.';

jest.mock('@plentyag/core/src/hooks/use-swr-axios');

const [metric] = mockMetrics;
const [alertRule] = mockAlertRules;
const username = 'olittle';

const mockUseSwrAxios = useSwrAxios as jest.Mock;

describe('useAlertRuleFormGenConfig', () => {
  beforeEach(() => {
    mockUseSwrAxios.mockReturnValue({ data: mockMeasurementTypes });
  });

  describe('when creating an AlertRule', () => {
    it('serializes', () => {
      const { result } = renderHook(() => useAlertRuleFormGenConfig({ metric, username }));

      const formikValues = {
        alertRuleType: alertRule.alertRuleType,
        startsAt: alertRule.startsAt,
        endsAt: alertRule.endsAt,
        priority: alertRule.priority,
        isEnabled: alertRule.isEnabled,
        description: alertRule.description,
      };
      const serializedAlertRule = result.current.serialize(formikValues);

      expect(serializedAlertRule).toHaveProperty('createdBy', username);
      expect(serializedAlertRule).toHaveProperty('metricId', metric.id);
      expect(serializedAlertRule).toEqual(expect.objectContaining(formikValues));
    });

    it('converts isStateless, noDataTimeout and durationWindowSize in seconds when serializing', () => {
      const { result } = renderHook(() => useAlertRuleFormGenConfig({ metric, username }));

      const formikValues = {
        alertRuleType: alertRule.alertRuleType,
        startsAt: alertRule.startsAt,
        endsAt: alertRule.endsAt,
        priority: alertRule.priority,
        isEnabled: alertRule.isEnabled,
        description: alertRule.description,
        durationWindowSize: 5,
        durationWindowSizeResolve: 2,
        noDataTimeout: 10,
        isStateless: true,
      };
      const serializedAlertRule = result.current.serialize(formikValues);

      expect(serializedAlertRule).toHaveProperty('createdBy', username);
      expect(serializedAlertRule).toHaveProperty('metricId', metric.id);
      expect(serializedAlertRule).toEqual(
        expect.objectContaining({
          ...formikValues,
          durationWindowSize: 5 * 60,
          durationWindowSizeResolve: 2 * 60,
          noDataTimeout: 10 * 60,
          isStateless: true,
        })
      );
    });

    it('converts isStateless, noDataTimeout and durationWindowSize in minutes when deserializing', () => {
      const { result } = renderHook(() => useAlertRuleFormGenConfig({ metric, username }));

      const json = {
        durationWindowSize: 300,
        durationWindowSizeResolve: 120,
        noDataTimeout: 600,
        isStateless: true,
      };
      const formikValues = result.current.deserialize(json);

      expect(formikValues).toEqual({
        durationWindowSize: 5,
        durationWindowSizeResolve: 2,
        noDataTimeout: 10,
        isStateless: true,
      });
    });
  });

  describe('when updating an AlertRule', () => {
    it('serializes', () => {
      const { result } = renderHook(() => useAlertRuleFormGenConfig({ metric, alertRule, username }));

      const formikValues = alertRule;
      const serializedAlertRule = result.current.serialize(formikValues);

      expect(serializedAlertRule).toHaveProperty('updatedBy', username);
      expect(serializedAlertRule).toHaveProperty('metricId', alertRule.metricId);
      expect(serializedAlertRule).toEqual(
        expect.objectContaining({
          ...formikValues,
          durationWindowSize: undefined,
          durationWindowSizeResolve: undefined,
          noDataTimeout: undefined,
          isStateless: false,
          updatedBy: username,
        })
      );
      expect(serializedAlertRule.rules).toHaveLength(2);
      expect(serializedAlertRule.rules).toEqual(alertRule.rules);
    });

    describe('when the preferred unit is not equals to the default unit', () => {
      beforeEach(() => {
        setUnitPreferenceLocalStorage({ TEMPERATURE: 'F' });
      });

      afterEach(() => {
        clearUnitPreferenceLocalStorage();
      });

      it("serializes the rules' values to the default unit", () => {
        const rulesInCelsius = [
          { time: 1, gte: 0, lte: 20 },
          { time: 1, gte: 10, lte: 15 },
        ];
        const rulesInFahrenheit = [
          { time: 1, gte: 32, lte: 68 },
          { time: 1, gte: 50, lte: 59 },
        ];
        const alertRuleInCelsius = { ...alertRule, rules: rulesInCelsius };
        const formikValues = { ...alertRule, rules: rulesInFahrenheit };

        const { result } = renderHook(() =>
          useAlertRuleFormGenConfig({ metric, alertRule: alertRuleInCelsius, username })
        );

        const serializedAlertRule = result.current.serialize(formikValues);

        expect(serializedAlertRule.rules).toEqual(rulesInCelsius);
      });
    });
  });

  it('returns numerical AlertRuleTypes', () => {
    const { result } = renderHook(() => useAlertRuleFormGenConfig({ metric, alertRule, username }));

    const field = result.current.fields[0] as FormGen.FieldSelect;

    expect(field.name).toBe('alertRuleType');
    expect(field.options.map(option => (option as FormGen.ValueLabel).value)).toEqual([
      AlertRuleType.controlLimit,
      AlertRuleType.specLimit,
      AlertRuleType.specLimitDevices,
    ]);
  });

  it('returns non-numerical AlertRuleTypes', () => {
    const { result } = renderHook(() =>
      useAlertRuleFormGenConfig({ metric: { ...metric, measurementType: 'CATEGORICAL_STATE' }, alertRule, username })
    );

    const field = result.current.fields[0] as FormGen.FieldSelect;

    expect(field.name).toBe('alertRuleType');
    expect(field.options.map(option => (option as FormGen.ValueLabel).value)).toEqual([AlertRuleType.nonNumerical]);
  });
});
