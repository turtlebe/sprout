import { Container } from '../../../types';

/**
 * Validates the edited serial number, such that this function returns false if
 * new serial number already exists, otherwise returns true. Also invokes callback "onSerialChanged"
 * if serial number is not a dup.
 */
export function containerSerialValueSetter({
  newSerialNumber,
  oldSerialNumber,
  containers,
  onSerialChanged,
}: {
  newSerialNumber: string;
  oldSerialNumber: string;
  containers: Container[];
  onSerialChanged: (oldSerial: string, newSerial: string) => void;
}): boolean {
  // don't allow edited value if new serial value already exists
  const isDup = containers.filter(container => container.serial === newSerialNumber).length > 0;
  if (!isDup) {
    onSerialChanged(oldSerialNumber, newSerialNumber);
  }
  return !isDup;
}
