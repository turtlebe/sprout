import { AllowedObjects } from '../hooks';

import { filterOptionWithShortenedPath } from '.';

// Build a fake FDS Object for testing purposes.
// We only care about the path and the kind attributes.
function fdsObject(path: string, kind?: string) {
  const object = { ref: 'ref', path, kind } as unknown as AllowedObjects;
  return object;
}

describe('filterOptionWithShortenedPath', () => {
  it('returns true', () => {
    const farmDefPath = 'sites/SSF2/areas/Propagation/lines/PropagationRack';
    expect(filterOptionWithShortenedPath('SSF2/Propagation/', fdsObject(farmDefPath))).toBe(true);
    expect(filterOptionWithShortenedPath('SSF2/Propagation/PropagationRack', fdsObject(farmDefPath))).toBe(true);
    expect(filterOptionWithShortenedPath('SSF2/Propagation/Propagation', fdsObject(farmDefPath))).toBe(true);
  });

  it('returns false', () => {
    const farmDefPath = 'sites/SSF2/areas/Propagation/lines/PropagationRack';
    expect(filterOptionWithShortenedPath('SSF2', fdsObject(farmDefPath))).toBe(false);
    expect(filterOptionWithShortenedPath('SSF2/', fdsObject(farmDefPath))).toBe(false);
    expect(filterOptionWithShortenedPath('SSF2/Propagation', fdsObject(farmDefPath))).toBe(false);
    expect(filterOptionWithShortenedPath('SSF2/Propagation/PropagationRack/', fdsObject(farmDefPath))).toBe(false);
  });

  it('filters farmDef objects based on the input value', () => {
    expect(filterOptionWithShortenedPath('SSF2/', fdsObject('sites/SSF2/areas/QAQC'))).toBe(true);
    expect(filterOptionWithShortenedPath('SSF2/QA', fdsObject('sites/SSF2/areas/QAQC'))).toBe(true);
    expect(filterOptionWithShortenedPath('SSF2/QAQC', fdsObject('sites/SSF2/areas/QAQC'))).toBe(true);
    // trailing slash indicates that we want the children of QAQC
    expect(filterOptionWithShortenedPath('SSF2/QAQC/', fdsObject('sites/SSF2/areas/QAQC'))).toBe(false);
    expect(filterOptionWithShortenedPath('SSF2/QAQC/', fdsObject('sites/SSF2/areas/QAQC/lines/QAQCRoom'))).toBe(true);
  });

  it('filters children', () => {
    expect(filterOptionWithShortenedPath('SSF2/BMP/', fdsObject('sites/SSF2/areas/QAQC'))).toBe(false);
    expect(filterOptionWithShortenedPath('SSF2/BMP/', fdsObject('sites/SSF2/areas/CentralProcessing'))).toBe(false);
    expect(filterOptionWithShortenedPath('SSF2/BMP/', fdsObject('sites/SSF2/areas/QAQC/lines/QAQCRoom'))).toBe(false);
    expect(
      filterOptionWithShortenedPath('SSF2/BMP/', fdsObject('sites/SSF2/areas/CentralProcessing/lines/TowerProcessing'))
    ).toBe(false);
    expect(filterOptionWithShortenedPath('SSF2/BMP/', fdsObject('sites/SSF2/areas/BMP/lines/NorthBMP'))).toBe(true);
  });

  it('filters siblings when not maching the search term', () => {
    expect(filterOptionWithShortenedPath('SSF2/BM', fdsObject('sites/SSF2/areas/QAQC'))).toBe(false);
    expect(filterOptionWithShortenedPath('SSF2/BM', fdsObject('sites/SSF2/areas/CentralProcessing'))).toBe(false);
    expect(filterOptionWithShortenedPath('SSF2/BM', fdsObject('sites/SSF2/areas/BMP'))).toBe(true);
  });

  it('filters sites', () => {
    expect(filterOptionWithShortenedPath('SSF', fdsObject('sites/LAX'))).toBe(false);
    expect(filterOptionWithShortenedPath('SSF', fdsObject('sites/SSF2'))).toBe(true);
    expect(filterOptionWithShortenedPath('SSF2', fdsObject('sites/SSF2'))).toBe(true);
    expect(filterOptionWithShortenedPath('SSF2/', fdsObject('sites/SSF2'))).toBe(false);
  });

  it('filters grand children', () => {
    expect(filterOptionWithShortenedPath('SSF2/', fdsObject('sites/SSF2/areas/BMP'))).toBe(true);
    expect(filterOptionWithShortenedPath('SSF2/', fdsObject('sites/SSF2/areas/BMP/lines/NorthBMP'))).toBe(false);
    expect(filterOptionWithShortenedPath('SSF2', fdsObject('sites/SSF2/areas/BMP/lines/NorthBMP'))).toBe(false);
  });

  it('filters ancestors', () => {
    expect(filterOptionWithShortenedPath('SSF2/BMP/NorthBMP', fdsObject('sites/SSF2/areas/BMP'))).toBe(false);
    expect(filterOptionWithShortenedPath('SSF2/BMP/NorthBMP/', fdsObject('sites/SSF2/areas/BMP'))).toBe(false);
    expect(filterOptionWithShortenedPath('SSF2/BMP/NorthBMP', fdsObject('sites/SSF2'))).toBe(false);
    expect(filterOptionWithShortenedPath('SSF2/BMP/NorthBMP/', fdsObject('sites/SSF2'))).toBe(false);
  });

  it('is case insensitive', () => {
    expect(filterOptionWithShortenedPath('ssf2/bmp', fdsObject('sites/SSF2/areas/BMP'))).toBe(true);
    expect(filterOptionWithShortenedPath('ssf2/bmp/', fdsObject('sites/SSF2/areas/BMP/lines/NorthBMP'))).toBe(true);
  });

  it('supports ScheduleDefinition at the MachineZone level', () => {
    const scheduleDefinition = fdsObject(
      'sites/LAR1/areas/NorthBuilding/lines/GP12/machines/LightSystemA/machineZones/Back/scheduleDefinitions/SetIntensity'
    );
    expect(filterOptionWithShortenedPath('LAR1/NorthBuilding/GP12/LightSystemA/Back/', scheduleDefinition)).toBe(true);
    expect(filterOptionWithShortenedPath('LAR1/NorthBuilding/GP12/LightSystemA/Back/Set', scheduleDefinition)).toBe(
      true
    );
    expect(
      filterOptionWithShortenedPath('LAR1/NorthBuilding/GP12/LightSystemA/Back/SetIntensity', scheduleDefinition)
    ).toBe(true);
  });

  it('supports ChildDeviceLocation at the MachineZone level', () => {
    const childDeviceLocation = fdsObject(
      'sites/LAX1/areas/VerticalGrow/lines/GrowRoom1/machines/LightPlane1AA/deviceLocations/SprinkleGroup/locations/SprinkleSp19p7',
      'childDeviceLocation'
    );

    expect(filterOptionWithShortenedPath('LAX1/VerticalGrow/GrowRoom1/LightPlane1AA/', childDeviceLocation)).toBe(true);

    expect(
      filterOptionWithShortenedPath('LAX1/VerticalGrow/GrowRoom1/LightPlane1AA/SprinkleSp19', childDeviceLocation)
    ).toBe(true);
    expect(filterOptionWithShortenedPath('LAX1/VerticalGrow/GrowRoom1/SprinkleSp19', childDeviceLocation)).toBe(false);
    expect(
      filterOptionWithShortenedPath('LAX1/VerticalGrow/GrowRoom1/LightPlane1AA/SprinkleSp18', childDeviceLocation)
    ).toBe(false);
  });
});
