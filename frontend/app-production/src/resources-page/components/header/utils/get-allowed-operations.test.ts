import { cloneDeep } from 'lodash';

import { mockResult, mockResultContainerOnly, mockResultMaterialOnly } from '../../search/mock-search-result';

import { getAllowedOperations } from './get-allowed-operations';

describe('getOperations()', () => {
  it('returns no operations if site name not found in resource', () => {
    const mockSearchResultWithNoLocation = cloneDeep(mockResult);
    mockSearchResultWithNoLocation.location.machine.siteName = undefined;

    const operations = getAllowedOperations(mockSearchResultWithNoLocation);

    expect(operations.length).toBe(0);
  });

  it('returns no operations for containerType that is "CARRIER"', () => {
    const mockSearchResultWithCarrierContainerType = cloneDeep(mockResult);
    mockSearchResultWithCarrierContainerType.containerObj.containerType = 'CARRIER';

    const operations = getAllowedOperations(mockSearchResultWithCarrierContainerType);

    expect(operations.length).toBe(0);
  });

  function expectToContainOperation(operations: ProdActions.AllowedOperation[], operationName: string) {
    expect(operations.find(op => op.name === operationName)).toBeTruthy();
  }

  it('returns trash, wash, move equipment and change crop when resource has container that is not already trashed', () => {
    const operations = getAllowedOperations(mockResultContainerOnly);

    expect(operations.length).toBe(4);
    expectToContainOperation(operations, 'TrashContainer');
    expectToContainOperation(operations, 'WashContainer');
    expectToContainOperation(operations, 'MoveContainer');
    expectToContainOperation(operations, 'AddOrChangeCrop');
  });

  it('returns trash, wash, move equipment, scrap operation and change crop when has both material and container', () => {
    const operations = getAllowedOperations(mockResult);

    expect(operations.length).toBe(5);
    expectToContainOperation(operations, 'TrashContainer');
    expectToContainOperation(operations, 'WashContainer');
    expectToContainOperation(operations, 'MoveContainer');
    expectToContainOperation(operations, 'ScrapMaterial');
    expectToContainOperation(operations, 'AddOrChangeCrop');
  });

  it('returns material-specific move and change crop operations when only has material', () => {
    const operations = getAllowedOperations(mockResultMaterialOnly);

    expect(operations.length).toBe(2);
    expectToContainOperation(operations, 'MoveMaterial');
    expectToContainOperation(operations, 'ChangeMaterialCrop');
  });

  it('returns untrash, wash, move equipment and change crop when resource has container that is already trashed', () => {
    const trashedContainer = cloneDeep(mockResultContainerOnly);
    trashedContainer.containerStatus = 'TRASHED';
    const operations = getAllowedOperations(trashedContainer);

    expect(operations.length).toBe(3);
    expectToContainOperation(operations, 'UntrashContainer');
    expectToContainOperation(operations, 'WashContainer');
    expectToContainOperation(operations, 'MoveContainer');
  });
});
