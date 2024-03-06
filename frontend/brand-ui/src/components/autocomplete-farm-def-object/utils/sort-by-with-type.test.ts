import { isDeviceLocation, isScheduleDefinition } from '@plentyag/core/src/farm-def/type-guards';
import { DeviceLocation, FarmDefObject, ScheduleDefinition } from '@plentyag/core/src/farm-def/types';

import { sortByWithType } from '.';

const ssf2 = {
  ref: 'ref',
  kind: 'site',
  path: 'sites/SSF2',
} as unknown as FarmDefObject;
const lar1 = {
  ref: 'ref',
  kind: 'site',
  path: 'sites/LAR1',
} as unknown as FarmDefObject;
const bmp = {
  ref: 'ref',
  kind: 'areas',
  path: 'sites/SSF2/areas/BMP',
} as unknown as FarmDefObject;

const deviceLocation1 = {
  ref: 'ref',
  kind: 'deviceLocation',
  path: `${ssf2.path}/deviceLocations/Camera1`,
} as unknown as DeviceLocation;
const deviceLocation2 = {
  ref: 'ref',
  kind: 'deviceLocation',
  path: `${bmp.path}/deviceLocations/Camera2`,
} as unknown as DeviceLocation;

const scheduleDefinition1 = {
  ref: 'ref',
  kind: 'scheduleDefinition',
  path: `${ssf2.path}/scheduleDefinitions/ThermalHumidity`,
} as unknown as ScheduleDefinition;
const scheduleDefinition2 = {
  ref: 'ref',
  kind: 'scheduleDefinition',
  path: `${bmp.path}/scheduleDefinitions/ThermalTemperature`,
} as unknown as ScheduleDefinition;

describe('sortByWithType', () => {
  describe('with isDeviceLocation', () => {
    it('sorts by path first with an exception for deviceLocation being higher priority', () => {
      expect(sortByWithType(isDeviceLocation)(ssf2, deviceLocation1)).toBe(1);
      expect(sortByWithType(isDeviceLocation)(deviceLocation1, ssf2)).toBe(-1);
      expect(sortByWithType(isDeviceLocation)(bmp, deviceLocation1)).toBe(1);
      expect(sortByWithType(isDeviceLocation)(deviceLocation1, bmp)).toBe(-1);
    });

    it('sorts by path when there is no deviceLocation', () => {
      expect(sortByWithType(isDeviceLocation)(ssf2, lar1)).toBe(1);
      expect(sortByWithType(isDeviceLocation)(lar1, ssf2)).toBe(-1);
      expect(sortByWithType(isDeviceLocation)(bmp, ssf2)).toBe(1);
      expect(sortByWithType(isDeviceLocation)(ssf2, bmp)).toBe(-1);
      expect(sortByWithType(isDeviceLocation)(bmp, lar1)).toBe(1);
      expect(sortByWithType(isDeviceLocation)(lar1, bmp)).toBe(-1);
    });

    it('sorts by path when there is only deviceLocation', () => {
      expect(sortByWithType(isDeviceLocation)(deviceLocation1, deviceLocation2)).toBe(1);
      expect(sortByWithType(isDeviceLocation)(deviceLocation2, deviceLocation1)).toBe(-1);
    });
  });

  describe('with isScheduleDefinition', () => {
    it('sorts by path first with an exception for scheduleDefinition being higher priority', () => {
      expect(sortByWithType(isScheduleDefinition)(ssf2, scheduleDefinition1)).toBe(1);
      expect(sortByWithType(isScheduleDefinition)(scheduleDefinition1, ssf2)).toBe(-1);
      expect(sortByWithType(isScheduleDefinition)(bmp, scheduleDefinition1)).toBe(1);
      expect(sortByWithType(isScheduleDefinition)(scheduleDefinition1, bmp)).toBe(-1);
    });

    it('sorts by path when there is no scheduleDefinition', () => {
      expect(sortByWithType(isScheduleDefinition)(ssf2, lar1)).toBe(1);
      expect(sortByWithType(isScheduleDefinition)(lar1, ssf2)).toBe(-1);
      expect(sortByWithType(isScheduleDefinition)(bmp, ssf2)).toBe(1);
      expect(sortByWithType(isScheduleDefinition)(ssf2, bmp)).toBe(-1);
      expect(sortByWithType(isScheduleDefinition)(bmp, lar1)).toBe(1);
      expect(sortByWithType(isScheduleDefinition)(lar1, bmp)).toBe(-1);
    });

    it('sorts by path when there is only scheduleDefinition', () => {
      expect(sortByWithType(isScheduleDefinition)(scheduleDefinition1, scheduleDefinition2)).toBe(1);
      expect(sortByWithType(isScheduleDefinition)(scheduleDefinition2, scheduleDefinition1)).toBe(-1);
    });

    it('sorts by path when there is two different type of objects', () => {
      expect(sortByWithType(isScheduleDefinition)(scheduleDefinition1, deviceLocation1)).toBe(-1);
      expect(sortByWithType(isScheduleDefinition)(deviceLocation1, scheduleDefinition1)).toBe(1);
    });
  });
});
