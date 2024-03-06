import {
  buildLAX1ContainerLocation,
  buildMaterialObject,
  buildResourceState,
} from '@plentyag/app-production/src/common/test-helpers/mock-builders';

import { isCommentable } from './is-commentable';

describe('isCommentable', () => {
  it('returns false when the resource is a tray in germination', () => {
    const containerLocation = buildLAX1ContainerLocation({ containerType: 'GermTray' });
    const materialObj = buildMaterialObject({ materialType: 'LOADED_TRAY' });
    const resource = buildResourceState({ containerLocation, materialObj });

    expect(isCommentable(resource)).toBe(false);
  });

  it('returns false when the resource is a tray in propagation', () => {
    const containerLocation = buildLAX1ContainerLocation({ containerType: 'PropTray' });
    const materialObj = buildMaterialObject({ materialType: 'LOADED_TRAY' });
    const resource = buildResourceState({ containerLocation, materialObj });

    expect(isCommentable(resource)).toBe(false);
  });

  it('returns false when the resource is a table in germination', () => {
    const containerLocation = buildLAX1ContainerLocation({ containerType: 'GermTable' });
    const materialObj = buildMaterialObject({ materialType: 'LOADED_TABLE' });
    const resource = buildResourceState({ containerLocation, materialObj });

    expect(isCommentable(resource)).toBe(false);
  });

  it('returns true when the resource is a table in propagation', () => {
    const containerLocation = buildLAX1ContainerLocation({ containerType: 'PropTable' });
    const materialObj = buildMaterialObject({ materialType: 'LOADED_TABLE' });
    const resource = buildResourceState({ containerLocation, materialObj });

    expect(isCommentable(resource)).toBe(true);
  });

  it('returns true when the resource is a table in propagation without material', () => {
    const containerLocation = buildLAX1ContainerLocation({ containerType: 'PropTable' });
    const resource = buildResourceState({ containerLocation, materialObj: null });

    expect(isCommentable(resource)).toBe(false);
  });

  it('returns true when the resource is a tower in vertical grow', () => {
    const containerLocation = buildLAX1ContainerLocation({ containerType: 'Tower' });
    const materialObj = buildMaterialObject({ materialType: 'LOADED_TOWER' });
    const resource = buildResourceState({ containerLocation, materialObj });

    expect(isCommentable(resource)).toBe(true);
  });

  it('returns true when the resource is a tower in vertical grow without material', () => {
    const containerLocation = buildLAX1ContainerLocation({ containerType: 'Tower' });
    const resource = buildResourceState({ containerLocation, materialObj: null });

    expect(isCommentable(resource)).toBe(false);
  });
});
