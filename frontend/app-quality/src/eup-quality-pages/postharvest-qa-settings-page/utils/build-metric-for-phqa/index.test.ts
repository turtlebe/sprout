import { OBSERVATION_PATH } from '@plentyag/app-quality/src/eup-quality-pages/postharvest-qa-page/constants';

import { buildMetricForPhqa } from '.';

describe('buildMetricForPhqa', () => {
  it('returns metric model', () => {
    // ACT
    const result = buildMetricForPhqa('jvu', 'FullSealAssessmentFailPercentage');

    // ASSERT
    expect(result).toEqual({
      createdBy: 'jvu',
      measurementType: 'PERCENTAGE',
      observationName: 'FullSealAssessmentFailPercentage',
      path: OBSERVATION_PATH,
      unitConfig: {
        max: 100,
        min: 0,
      },
      alertRules: [],
    });
  });
});
