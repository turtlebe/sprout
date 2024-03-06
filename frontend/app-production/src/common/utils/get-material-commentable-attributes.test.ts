import { CommentableType, ContextType } from '@plentyag/core/src/types';

import {
  buildLAX1ContainerLocation,
  BuildLAX1ContainerLocation,
  buildMaterialObject,
  BuildMaterialObject,
  buildResourceState,
} from '../test-helpers/mock-builders';

import {
  getMaterialCommentableId,
  getMaterialCommentableType,
  getMaterialContextId,
  getMaterialContextType,
} from './get-material-commentable-attributes';

interface TextResourceStateData {
  containerType: BuildLAX1ContainerLocation['containerType'];
  materialType: BuildMaterialObject['materialType'];
  expectedCommentableType: CommentableType;
  expectedContextType: ContextType;
}

const emptyResource = buildResourceState({
  containerLocation: buildLAX1ContainerLocation({ containerType: 'PropTable' }),
  materialObj: null,
});
const resources: TextResourceStateData[] = [
  {
    containerType: 'GermTray',
    materialType: 'LOADED_TRAY',
    expectedCommentableType: undefined,
    expectedContextType: undefined,
  },
  {
    containerType: 'GermTable',
    materialType: 'LOADED_TABLE',
    expectedCommentableType: undefined,
    expectedContextType: undefined,
  },
  {
    containerType: 'PropTray',
    materialType: 'LOADED_TRAY',
    expectedCommentableType: undefined,
    expectedContextType: undefined,
  },
  {
    containerType: 'PropTable',
    materialType: 'LOADED_TABLE',
    expectedCommentableType: CommentableType.loadedTable,
    expectedContextType: ContextType.table,
  },
  {
    containerType: 'Tower',
    materialType: 'LOADED_TOWER',
    expectedCommentableType: CommentableType.loadedTower,
    expectedContextType: ContextType.tower,
  },
];

describe('getMaterialCommentableId', () => {
  it.each(resources)('returns the lotName for %s', ({ containerType, materialType }) => {
    const resourceState = buildResourceState({
      containerLocation: buildLAX1ContainerLocation({ containerType }),
      materialObj: buildMaterialObject({ materialType }),
    });

    expect(getMaterialCommentableId(resourceState)).toBe(resourceState.materialObj.id);
  });

  it('returns undefined when there is no material', () => {
    expect(getMaterialCommentableId(emptyResource)).toBe(undefined);
  });
});

describe('getMaterialCommentableType', () => {
  it.each(resources)(
    'returns the CommentableType for %s',
    ({ containerType, materialType, expectedCommentableType }) => {
      const resourceState = buildResourceState({
        containerLocation: buildLAX1ContainerLocation({ containerType }),
        materialObj: buildMaterialObject({ materialType }),
      });

      expect(getMaterialCommentableType(resourceState)).toBe(expectedCommentableType);
    }
  );
});

describe('getMaterialContextId', () => {
  it.each(resources)('returns the container ID for %s', ({ containerType, materialType }) => {
    const resourceState = buildResourceState({
      containerLocation: buildLAX1ContainerLocation({ containerType }),
      materialObj: buildMaterialObject({ materialType }),
    });

    expect(getMaterialContextId(resourceState)).toBe(resourceState.containerObj.id);
  });

  it('returns undefined when there is no material', () => {
    expect(getMaterialCommentableId(emptyResource)).toBe(undefined);
  });
});

describe('getMaterialContextType', () => {
  it.each(resources)('returns the ContextType for %s', ({ containerType, materialType, expectedContextType }) => {
    const resourceState = buildResourceState({
      containerLocation: buildLAX1ContainerLocation({ containerType }),
      materialObj: buildMaterialObject({ materialType }),
    });

    expect(getMaterialContextType(resourceState)).toBe(expectedContextType);
  });
});
