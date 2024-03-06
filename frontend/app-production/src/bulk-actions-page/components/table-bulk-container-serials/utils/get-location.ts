export function getLocation(location: ProdResources.Location) {
  const machine = location?.machine;
  return machine && [machine.siteName, machine.areaName, machine.lineName].join('/');
}
