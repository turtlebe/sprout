import { FarmDefObject } from '@plentyag/core/src/farm-def/types';
import { renderHook } from '@testing-library/react-hooks';

import { useGetFarmDefObjectByPath } from '..';

import { useGetOperationsPaths } from '.';

// note: test data has two "AddLabel" methods - one is a "tell" and other is "command"
const mockFarmDefSiteObject: FarmDefObject = {
  id: 'cacbd544-6143-48c3-8a72-f2d09bc2fbb7',
  kind: 'site',
  path: 'sites/SSF2',
  name: 'SSF2',
  properties: {},
  interfaces: {
    TigrisSite: {
      ref: 'cacbd544-6143-48c3-8a72-f2d09bc2fbb7:interface-TigrisSite',
      kind: 'interface',
      name: 'TigrisSite',
      path: 'sites/SSF2/interfaces/TigrisSite',
      class: 'Interface',
      parentPath: 'sites/SSF2',
      methods: {
        Trash: {
          kind: 'method',
          name: 'Trash',
          path: 'sites/SSF2/interfaces/TigrisSite/methods/Trash',
          type: 'tell',
          description: 'Trash an equipment',
          parentPath: 'sites/SSF2/interfaces/TigrisSite',
        },
        MoveContainer: {
          kind: 'method',
          name: 'MoveContainer',
          path: 'sites/SSF2/interfaces/TigrisSite/methods/MoveContainer',
          type: 'tell',
          description: 'Move container',
          parentPath: 'sites/SSF2/interfaces/TigrisSite',
        },
        AddLabel: {
          kind: 'method',
          name: 'AddLabel',
          path: 'sites/SSF2/interfaces/TigrisSite/methods/AddLabel',
          type: 'tell',
          description:
            'Adds a label to a given container. Behind the scene the label may be attached to the container or the material depending on the specific label.',
          parentPath: 'sites/SSF2/interfaces/TigrisSite',
        },
      },
    },
    Traceability: {
      ref: 'cacbd544-6143-48c3-8a72-f2d09bc2fbb7:interface-Traceability',
      kind: 'interface',
      name: 'Traceability',
      path: 'sites/SSF2/interfaces/Traceability',
      class: 'Interface',
      parentPath: 'sites/SSF2',
      methods: {
        AddLabel: {
          kind: 'method',
          name: 'AddLabel',
          path: 'sites/SSF2/interfaces/Traceability/methods/AddLabel',
          type: 'request',
          description: 'Adds a label to the specified entity.',
          parentPath: 'sites/SSF2/interfaces/Traceability',
        },
      },
    },
  },
};

jest.mock('../use-get-farm-def-object-by-path');
const mockUseGetFarmDefObjectByPath = useGetFarmDefObjectByPath as jest.Mock;

const testOperations = ['Trash', 'MoveContainer', 'Wash', 'AddLabel'];

describe('useGetOperationsPaths', () => {
  it('returns no operations when siteName not provided', () => {
    mockUseGetFarmDefObjectByPath.mockImplementation(() => {
      return { error: undefined, isValidating: false, data: [] };
    });
    const { result } = renderHook(() => useGetOperationsPaths(testOperations, undefined));
    expect(result.current.operationPaths.size).toBe(0);
  });

  it('returns found "tell" operations', () => {
    mockUseGetFarmDefObjectByPath.mockImplementation(() => {
      return { error: undefined, isValidating: false, data: mockFarmDefSiteObject };
    });
    const { result } = renderHook(() => useGetOperationsPaths(testOperations, 'tell', 'SSF2'));
    const operationsPaths = result.current.operationPaths;
    expect(operationsPaths.size).toBe(3);
    expect(operationsPaths.get('Trash')).toBeTruthy();
    expect(operationsPaths.get('MoveContainer')).toBeTruthy();
    expect(operationsPaths.get('AddLabel')).toBe(
      mockFarmDefSiteObject.interfaces['TigrisSite']['methods']['AddLabel'].path
    );
  });

  it('returns found "request" operations', () => {
    mockUseGetFarmDefObjectByPath.mockImplementation(() => {
      return { error: undefined, isValidating: false, data: mockFarmDefSiteObject };
    });
    const { result } = renderHook(() => useGetOperationsPaths(testOperations, 'request', 'SSF2'));
    const operationsPaths = result.current.operationPaths;
    expect(operationsPaths.size).toBe(1);
    expect(operationsPaths.get('AddLabel')).toBe(
      mockFarmDefSiteObject.interfaces['Traceability']['methods']['AddLabel'].path
    );
  });
});
