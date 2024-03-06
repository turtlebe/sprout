import { root } from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object/test-helpers';

import { getAvailableDeviceLocations } from '.';

const sprinkleGroup =
  root.sites['SSF2'].areas['VerticalGrow'].lines['GrowRoom'].machines['GrowLane1'].deviceLocations['SprinkleGroup'];

describe('getAvailableDeviceLocations', () => {
  it('returns an array of all device locations', () => {
    const { deviceLocations, childDeviceLocations } = getAvailableDeviceLocations(root);
    expect(deviceLocations).toHaveLength(3);

    const deviceLocationPaths = deviceLocations.map(deviceLocation => deviceLocation.path);
    expect(deviceLocationPaths).toContain('sites/SSF2/areas/Seeding/lines/TraySeeding/deviceLocations/Camera');
    expect(deviceLocationPaths).toContain('sites/SSF2/areas/Seeding/lines/TraySeeding/deviceLocations/Camera2');
    expect(deviceLocationPaths).toContain('sites/SSF2/deviceLocations/Camera');

    expect(childDeviceLocations).toHaveLength(2);
    expect(childDeviceLocations[0].properties.deviceTypes).toEqual(sprinkleGroup.deviceTypes);
    expect(childDeviceLocations[1].properties.deviceTypes).toEqual(sprinkleGroup.deviceTypes);
    const childDeviceLocationsPaths = childDeviceLocations.map(childDeviceLocation => childDeviceLocation.path);
    expect(childDeviceLocationsPaths).toContain(
      'sites/SSF2/areas/VerticalGrow/lines/GrowRoom/machines/GrowLane1/deviceLocations/SprinkleGroup/locations/SprinkleSp1p1'
    );
    expect(childDeviceLocationsPaths).toContain(
      'sites/SSF2/areas/VerticalGrow/lines/GrowRoom/machines/GrowLane1/deviceLocations/SprinkleGroup/locations/SprinkleSp1p2'
    );
  });
});
