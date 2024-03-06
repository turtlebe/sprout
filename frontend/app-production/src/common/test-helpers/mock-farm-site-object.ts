import { FarmDefSite } from '@plentyag/core/src/farm-def/types';

export const mockFarmDefSiteObj: FarmDefSite = {
  id: 'cacbd544-6143-48c3-8a72-f2d09bc2fbb7',
  kind: 'site',
  path: 'sites/SSF2',
  name: 'SSF2',
  properties: {},
  address: '570 Eccles Ave, South San Francisco, CA 94080',
  country: 'United States',
  timezone: 'America/Los_Angeles',
  areas: {
    BMP: {
      id: 'b9fbfa27-8a6f-4f0e-9105-33334cd31be6',
      kind: 'area',
      name: 'BMP',
      path: 'sites/SSF2/areas/BMP',
      lines: {},
      properties: {},
    },
    VerticalGrow: {
      id: 'ab6e72fe-7d7c-4f2f-aa06-59d9afd2c0be',
      kind: 'area',
      name: 'VerticalGrow',
      path: 'sites/SSF2/areas/VerticalGrow',
      lines: {},
      properties: {},
    },
    TaurusGrow: {
      id: 'b5a1e5b6-27b5-4d43-8e13-c942ba199126',
      kind: 'area',
      name: 'TaurusGrow',
      path: 'sites/SSF2/areas/TaurusGrow',
      lines: {},
      properties: {},
    },
  },
  farms: {
    Tigris: {
      id: '0ece1479-2e40-458b-9b17-154f11270006',
      kind: 'farm',
      name: 'Tigris',
      path: 'sites/SSF2/farms/Tigris',
      class: 'TigrisFarm',
      properties: {},
      workCenters: {},
      mappings: [
        {
          to: 'b9fbfa27-8a6f-4f0e-9105-33334cd31be6',
          from: '0ece1479-2e40-458b-9b17-154f11270006',
          kind: 'mapping',
          type: 'relates',
        },
        {
          to: 'ab6e72fe-7d7c-4f2f-aa06-59d9afd2c0be',
          from: '0ece1479-2e40-458b-9b17-154f11270006',
          kind: 'mapping',
          type: 'relates',
        },
      ],
    },
  },
};
