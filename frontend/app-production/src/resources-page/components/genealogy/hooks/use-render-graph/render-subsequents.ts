import { SearchActions } from '@plentyag/app-production/src/resources-page/hooks/use-search';

import { DEFAULT_COLOR } from '../../constants';
import { findOperationCreatingMaterialId, getOperationsDateRange } from '../../utils';

import { renderLineConnectingResources } from './render-line-connecting-resources';
import { renderOperationEllipsisLine } from './render-operation-ellipsis-line';
import { renderResourceIcon } from './render-resource-icon';
import { renderResourceLine } from './render-resource-line';
import { renderResourceOperations } from './render-resource-operations';
import { offSet } from './utils';

interface SubsequentResource {
  range: { start: Date; end: Date };
  resource: ProdResources.Subsequent;
}

interface RenderSubsequents {
  focusedResource: ProdResources.FocusedResource;
  focusedResourceIndex: number;
  search: SearchActions['search'];
  svg: d3.Selection<any, any, any, any>;
  scale: ProdResources.Scale;
  viewBounds: ProdResources.ViewBounds;
}

/**
 * Renders the subsequent resources lines (including segemnts, operations, etc.)
 * @param focusedResource The genealogy data for the currently searched (focused) resource.
 * @param focusedResourceIndex Y vertical index at which the focused resource is drawn.
 * @param focusedResourceMaterialId Material id for the focused resource.
 * @param search Search function to call when line segment is selected.
 * @param svg The element to which the line will be appended.
 * @param scale The initial x and y scale to apply to the line.
 */
export function renderSubsequents({
  focusedResource,
  focusedResourceIndex,
  search,
  svg,
  scale,
  viewBounds,
}: RenderSubsequents) {
  const subsequents: SubsequentResource[] = [];
  focusedResource.operations.forEach(op => {
    op.subsequents.forEach(subsequent => {
      const subseqentRange = getOperationsDateRange(subsequent.operations);
      subsequents.push({ range: subseqentRange, resource: subsequent });
    });
  });

  // order subsequents by oldest start date
  subsequents.sort((a, b) => b.range.start.getTime() - a.range.start.getTime());

  // draw subsequent lines.
  subsequents.forEach((subsequent, index) => {
    // skip subsequent if parent already has materialId, so we don't double render.
    if (focusedResource.parent && subsequent.resource.materialId === focusedResource.parent.materialId) {
      return;
    }

    const subsequentIndex = offSet(index) + focusedResourceIndex;

    const operationThatCreatedSubsequent = findOperationCreatingMaterialId(
      focusedResource.operations,
      subsequent.resource.materialId
    );

    if (operationThatCreatedSubsequent) {
      renderLineConnectingResources({
        xDate: new Date(operationThatCreatedSubsequent.endDt),
        yIndexStart: subsequentIndex,
        yIndexEnd: focusedResourceIndex,
        svg,
        scale,
        viewBounds,
      });
    }

    const pathAttributes = {
      stroke: DEFAULT_COLOR,
      fill: DEFAULT_COLOR,
      strokeWidth: 2.0,
    };

    renderResourceLine({
      resource: subsequent.resource,
      yIndex: subsequentIndex,
      search,
      svg,
      scale,
      pathAttributes,
      viewBounds,
    });

    // render ellipsis for right side of resource (fwd in time)
    const lastestDisplayedOpDate = new Date(
      subsequent.resource.operations[subsequent.resource.operations.length - 1].endDt
    );
    renderOperationEllipsisLine({
      resource: subsequent.resource,
      search,
      ellipsisStartDate: lastestDisplayedOpDate,
      ellipsisDirection: 'forward',
      yIndex: subsequentIndex,
      operationNotShown: subsequent.resource.newestOperationNotShown,
      numberOfOperationsNotShown: subsequent.resource.numberOfNewerOperationsNotShown,
      isStillAlive: subsequent.resource.alive,
      hasAntecedentOrSubsequents: subsequent.resource.hasSubsequents,
      svg,
      scale,
      viewBounds,
      color: DEFAULT_COLOR,
    });
    // render ellipsis for left side of resource (backward in time)
    const oldestDisplayedOpDate = new Date(subsequent.resource.operations[0].endDt);
    renderOperationEllipsisLine({
      resource: subsequent.resource,
      search,
      ellipsisStartDate: oldestDisplayedOpDate,
      ellipsisDirection: 'backward',
      yIndex: subsequentIndex,
      operationNotShown: subsequent.resource.oldestOperationNotShown,
      numberOfOperationsNotShown: subsequent.resource.numberOfOlderOperationsNotShown,
      svg,
      scale,
      viewBounds,
      color: DEFAULT_COLOR,
    });

    // don't draw operation created by focused resource.
    const filteredOps = subsequent.resource.operations.filter(op => op.id !== operationThatCreatedSubsequent.id);
    renderResourceOperations({
      resource: subsequent.resource,
      operations: filteredOps,
      yIndex: subsequentIndex,
      search,
      svg,
      scale,
      viewBounds,
    });

    renderResourceIcon({
      operations: subsequent.resource.operations,
      yIndex: subsequentIndex,
      svg,
      scale,
      viewBounds,
    });
  });
}
