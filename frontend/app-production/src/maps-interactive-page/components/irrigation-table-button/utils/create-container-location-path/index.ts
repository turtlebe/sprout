interface CreateRackPathArguments {
  site: string;
  rack: number;
  level: number;
  bay: number;
}

/**
 * Constructs a full farm def path to a prop container using the rack, level, bay, and site.
 * Otherwise return undefined.
 *
 * Rack Path ex: sites/LAX1/areas/Propagation/lines/PropagationRack2/machines/PropLevel4/containerLocations/Bay22
 */
export function createContainerLocationPath({ site, rack, level, bay }: CreateRackPathArguments): string {
  if (typeof rack === 'number' && typeof level === 'number' && typeof bay === 'number' && site) {
    return `sites/${site}/areas/Propagation/lines/PropagationRack${rack}/machines/PropLevel${level}/containerLocations/Bay${bay}`;
  }
}
