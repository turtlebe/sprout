export function getFaultsInfo(jsonString: string) {
  try {
    return JSON.parse(jsonString) || {};
  } catch (error) {
    return {};
  }
}
