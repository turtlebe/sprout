import { Metric } from '@plentyag/core/src/types/environment';

export function getUnitConfigMinMax(metrics: Metric[]) {
  const mins = [];
  const maxs = [];

  metrics.filter(Boolean).forEach(metric => {
    mins.push(metric.unitConfig.min);
    maxs.push(metric.unitConfig.max);
  });

  return {
    min: mins.length ? Math.min(...mins) : NaN,
    max: maxs.length ? Math.max(...maxs) : NaN,
  };
}
