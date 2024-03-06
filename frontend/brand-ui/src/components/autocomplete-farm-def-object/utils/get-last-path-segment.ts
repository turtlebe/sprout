import { AllowedObjects } from '../hooks/use-autocomplete-farm-def-object-store';

/**
 * Returns the last segment of the FarmDef Path for a given FarmDef Object.
 *
 * Example:
 *   - sites/SSF2 -> SSF2
 *   - sites/areas/BMP -> BMP
 *
 * @param object @see AllowedObjects
 * @return The last segment of the FarmDef Path
 */
export function getLastPathSegment(object: AllowedObjects): string {
  const lastIndex = object.path.lastIndexOf('/');
  return object.path.slice(lastIndex + 1);
}
