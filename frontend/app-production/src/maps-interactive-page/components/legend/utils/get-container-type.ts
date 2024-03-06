import { MapsState } from '../../../types';

export function getContainerType(mapsState: MapsState) {
  const stateWithContainer =
    mapsState &&
    Object.values(mapsState).find(mapState => {
      return mapState?.resourceState?.containerObj?.containerType;
    });

  return stateWithContainer?.resourceState.containerObj.containerType;
}
