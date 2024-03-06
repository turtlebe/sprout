import { createContainerLocationPath } from '.';

describe('createContainerLocationPath', () => {
  it('gets the path', () => {
    expect(createContainerLocationPath({ site: 'LAX1', rack: 2, level: 4, bay: 22 })).toEqual(
      'sites/LAX1/areas/Propagation/lines/PropagationRack2/machines/PropLevel4/containerLocations/Bay22'
    );
  });

  it('returns undefined when some data not provided', () => {
    expect(createContainerLocationPath({ site: 'LAX1', rack: 2, level: 4, bay: undefined })).toEqual(undefined);
    expect(createContainerLocationPath({ site: 'LAX1', rack: 2, level: undefined, bay: 22 })).toEqual(undefined);
    expect(createContainerLocationPath({ site: 'LAX1', rack: undefined, level: 4, bay: 22 })).toEqual(undefined);
    expect(createContainerLocationPath({ site: undefined, rack: 2, level: 4, bay: 22 })).toEqual(undefined);
  });
});
