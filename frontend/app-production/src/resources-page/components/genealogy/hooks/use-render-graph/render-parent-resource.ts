import { SearchActions } from '@plentyag/app-production/src/resources-page/hooks/use-search';

import { PARENT_COLOR } from '../../constants';
import { findOperationConsumingMaterialId, findOperationCreatingMaterialId } from '../../utils';

import { renderLineConnectingResources } from './render-line-connecting-resources';
import { renderOperationEllipsisLine } from './render-operation-ellipsis-line';
import { renderResourceIcon } from './render-resource-icon';
import { renderResourceLine } from './render-resource-line';
import { renderResourceOperations } from './render-resource-operations';

interface RenderParentResource {
  focusedResource: ProdResources.FocusedResource;
  focusedResourceIndex: number;
  search: SearchActions['search'];
  svg: d3.Selection<any, any, any, any>;
  scale: ProdResources.Scale;
  viewBounds: ProdResources.ViewBounds;
}

/**
 * Renders the parent of the focused resource (if it has one).
 * @param focusedResource The genealogy data for the currently searched (focused) resource.
 * @param focusedResourceIndex Y vertical index at which the focused resource is drawn.
 * @param search Search function to call when line segment is selected.
 * @param svg The element to which the line will be appended.
 * @param scale The initial x and y scale to apply to the line.
 */
export function renderParentResource({
  focusedResource,
  focusedResourceIndex,
  search,
  svg,
  scale,
  viewBounds,
}: RenderParentResource) {
  if (!focusedResource.parent) {
    return;
  }

  const parent = focusedResource.parent;

  const parentLineIndex = focusedResourceIndex + 0.5;

  const operationThatCreatedParent = findOperationCreatingMaterialId(focusedResource.operations, parent.materialId);

  if (operationThatCreatedParent) {
    renderLineConnectingResources({
      xDate: new Date(operationThatCreatedParent.endDt),
      yIndexStart: parentLineIndex,
      yIndexEnd: focusedResourceIndex,
      svg,
      scale,
      viewBounds,
    });
  }

  const operationThatConsumedParent = findOperationConsumingMaterialId(focusedResource.operations, parent.materialId);

  if (operationThatConsumedParent) {
    renderLineConnectingResources({
      xDate: new Date(operationThatConsumedParent.endDt),
      yIndexStart: parentLineIndex,
      yIndexEnd: focusedResourceIndex,
      svg,
      scale,
      viewBounds,
    });
  }

  const pathAttributes = {
    stroke: PARENT_COLOR,
    fill: PARENT_COLOR,
    strokeWidth: 2.0,
  };

  renderResourceLine({
    resource: parent,
    yIndex: parentLineIndex,
    search,
    svg,
    scale,
    pathAttributes,
    viewBounds,
  });

  // render ellipsis for right side of resource (fwd in time)
  const lastestDisplayedOpDate = new Date(parent.operations[parent.operations.length - 1].endDt);
  renderOperationEllipsisLine({
    resource: parent,
    search,
    ellipsisStartDate: lastestDisplayedOpDate,
    ellipsisDirection: 'forward',
    yIndex: parentLineIndex,
    operationNotShown: parent.newestOperationNotShown,
    numberOfOperationsNotShown: parent.numberOfNewerOperationsNotShown,
    isStillAlive: parent.alive,
    svg,
    scale,
    viewBounds,
    color: PARENT_COLOR,
  });

  // render ellipsis for left side of resource (backward in time)
  const oldestDisplayedOpDate = new Date(parent.operations[0].endDt);
  renderOperationEllipsisLine({
    resource: parent,
    search,
    ellipsisStartDate: oldestDisplayedOpDate,
    ellipsisDirection: 'backward',
    yIndex: parentLineIndex,
    operationNotShown: parent.oldestOperationNotShown,
    numberOfOperationsNotShown: parent.numberOfOlderOperationsNotShown,
    svg,
    scale,
    viewBounds,
    color: PARENT_COLOR,
  });

  renderResourceOperations({
    resource: parent,
    operations: parent.operations,
    yIndex: parentLineIndex,
    search,
    svg,
    scale,
    viewBounds,
  });

  renderResourceIcon({
    operations: parent.operations,
    yIndex: parentLineIndex,
    svg,
    scale,
    viewBounds,
  });
}
