export const mockLabTestTypes = {
  details: {
    lab_test_types: [
      {
        created_at: '2020-06-18T22:19:51Z',
        created_by_username: 'drubio',
        lab_test_kind: 'Nutrient Analysis',
        lab_test_name: 'Waypoint_Nutrient Analysis',
        lab_test_provider: 'Waypoint',
        lab_test_type_id: 'eb936173-b1f0-49ac-90ea-435d2f12be3e',
        schema_results_and_thresholds_by_sample_type: {
          Product: {
            'Boron (B)': {
              acceptable_ranges: {
                gt: '20',
                lt: '25',
              },
              units: 'ppm',
            },
            'Calcium (Ca)': {
              acceptable_ranges: {
                gt: '2.4',
                lt: '2.46',
              },
              units: '%',
            },
          },
          'Leaf Tissue - Beet': {
            'Boron (B)': {
              acceptable_ranges: {
                gt: '30',
                lt: '85',
              },
              units: 'ppm',
            },
            'Iron (Fe)': {
              acceptable_ranges: {
                gt: '50',
                lt: '200',
              },
              units: 'ppm',
            },
          },
        },
        schema_submission_form_by_sample_type: {
          Product: ['Boron (B)', 'Calcium (Ca)'],
          'Leaf Tissue - Beet': ['Boron (B)', 'Iron (Fe)'],
        },
        source: {
          origin: {
            emails: ['waypoint@waypoint.com'],
          },
          triggers_by_sample_type: {
            Seed: {
              alert_at_if_no_result: '08:00',
              alert_in_x_days_if_no_result: 9,
            },
          },
          type: 'email',
        },
        updated_at: '2020-06-18T22:19:51Z',
        updated_by_username: 'drubio',
      },
      {
        created_at: '2020-03-30T22:57:45Z',
        created_by_username: 'drubio',
        lab_test_kind: 'Seed Pathogen',
        lab_test_name: 'IEH_Seed Pathogen',
        lab_test_provider: 'IEH',
        lab_test_type_id: '51335581-0973-45e8-b2ec-5ca4d6bd4a5d',
        schema_results_and_thresholds_by_sample_type: {
          Seed: {
            'Bacterial ID 16S': {},
            'Fungal ID ITS': {},
          },
        },
        schema_submission_form_by_sample_type: {
          Seed: ['Bacterial ID 16S', 'Fungal ID ITS'],
        },
        source: {
          origin: {
            emails: ['iehsalinas@iehinc.com', 'ieh.lfp@iehinc.com', 'ieh_report_system@iehinc.com', 'drubio@plenty.ag'],
          },
          triggers_by_sample_type: {
            Seed: {
              alert_at_if_no_result: '08:00',
              alert_in_x_days_if_no_result: 9,
            },
          },
          type: 'email',
        },
        updated_at: '2020-03-30T22:57:45Z',
        updated_by_username: 'drubio',
      },
    ],
  },
  success: 'Found 2 lab test types',
};
