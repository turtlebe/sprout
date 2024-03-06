import { Container, SerialStatus } from '../../../types';

import { containerSerialValueSetter } from './container-serial-value-setter';

const mockContainers: Container[] = [
  { isSelected: false, serial: 'xyz', serialStatus: SerialStatus.invalidSerial },
  { isSelected: false, serial: 'P900-0008046A:LK65-LM28-5Y', serialStatus: SerialStatus.valid },
];

describe('containerSerialValueSetter', () => {
  it('returns false when new serial already exists', () => {
    const mockOnSerialChanged = jest.fn();

    expect(
      containerSerialValueSetter({
        newSerialNumber: 'P900-0008046A:LK65-LM28-5Y', // already exists
        oldSerialNumber: 'xyz',
        containers: mockContainers,
        onSerialChanged: mockOnSerialChanged,
      })
    ).toBe(false);

    expect(mockOnSerialChanged).not.toHaveBeenCalled();
  });

  it('returns true when new serial does not exist', () => {
    const mockOnSerialChanged = jest.fn();

    expect(
      containerSerialValueSetter({
        newSerialNumber: 'P900-0008480B:R9R6-WY5F-5W', // does not exist
        oldSerialNumber: 'xyz',
        containers: mockContainers,
        onSerialChanged: mockOnSerialChanged,
      })
    ).toBe(true);

    expect(mockOnSerialChanged).toHaveBeenCalledWith('xyz', 'P900-0008480B:R9R6-WY5F-5W');
  });
});
