export function getShortenedFarmDefPath(machine: ProdResources.Machine) {
  return [machine?.siteName, machine?.areaName, machine?.lineName, machine?.machineName].filter(item => item).join('/');
}
