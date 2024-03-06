import { mockGenealogyData } from '../../hooks/use-genealogy/mock-genealogy-data';

import { findAllOperations } from '.';

describe('FindAllOperations', () => {
  it('finds all nested operations in mock data', () => {
    const allOperations = findAllOperations(mockGenealogyData);
    expect(allOperations).toHaveLength(16);
  });

  it('find no operations', () => {
    const emptyGenealogyData: ProdResources.FocusedResource = {
      numberOfNewerOperationsNotShown: 0,
      newestOperationNotShown: null,
      numberOfOlderOperationsNotShown: 0,
      oldestOperationNotShown: null,
      operations: [],
      parent: null,
      alive: false,
    };
    const allOperations = findAllOperations(emptyGenealogyData);
    expect(allOperations).toHaveLength(0);
  });

  it('find two operations', () => {
    const operation2: ProdResources.FocusedOperation = {
      id: '123',
      type: 'Remove Label',
      username: 'test',
      startDt: '123',
      endDt: '123',
      machine: null,
      stateIn: null,
      stateOut: {
        id: 'xyz',
        isLatest: false,
        childResourceStateIds: [],
        location: null,
        updatedAt: '',
      },
      antecedents: [],
      subsequents: [],
      materialsCreated: [],
      materialsConsumed: [],
    };

    const subsequent: ProdResources.Subsequent = {
      materialId: 'abc',
      numberOfNewerOperationsNotShown: 0,
      newestOperationNotShown: null,
      numberOfOlderOperationsNotShown: 0,
      oldestOperationNotShown: null,
      operations: [operation2],
      parent: null,
      hasSubsequents: false,
      alive: false,
    };

    const operation1: ProdResources.FocusedOperation = {
      id: '123',
      type: 'Add Label',
      username: 'test',
      startDt: '123',
      endDt: '123',
      machine: null,
      stateIn: null,
      stateOut: {
        id: 'xyz',
        isLatest: false,
        childResourceStateIds: [],
        location: null,
        updatedAt: '',
      },
      antecedents: [],
      subsequents: [subsequent],
      materialsCreated: [],
      materialsConsumed: [],
    };

    const exampleGenealogyData: ProdResources.FocusedResource = {
      numberOfNewerOperationsNotShown: 0,
      newestOperationNotShown: null,
      numberOfOlderOperationsNotShown: 0,
      oldestOperationNotShown: null,
      operations: [operation1],
      parent: null,
      alive: false,
    };

    const allOperations = findAllOperations(exampleGenealogyData);
    expect(allOperations).toHaveLength(2);
    expect(allOperations[0]).toEqual(operation1);
    expect(allOperations[1]).toEqual(operation2);
  });
});
