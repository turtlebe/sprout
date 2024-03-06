import { SearchActions } from '@plentyag/app-production/src/resources-page/hooks/use-search';

import { DEFAULT_COLOR } from '../../constants';
import { findOperationCreatingMaterialId, getOperationsDateRange } from '../../utils';

import { renderLineConnectingResources } from './render-line-connecting-resources';
import { renderOperationEllipsisLine } from './render-operation-ellipsis-line';
import { renderResourceIcon } from './render-resource-icon';
import { renderResourceLine } from './render-resource-line';
import { renderResourceOperations } from './render-resource-operations';
import { offSet } from './utils/offset';
interface AntecedentResource {
  range: { start: Date; end: Date };
  resource: ProdResources.Antecedent;
}

interface RenderAntecedents {
  focusedResource: ProdResources.FocusedResource;
  focusedResourceIndex: number;
  focusedResourceMaterialId: string;
  search: SearchActions['search'];
  svg: d3.Selection<any, any, any, any>;
  scale: ProdResources.Scale;
  viewBounds: ProdResources.ViewBounds;
}

/**
 * Renders the antecedents resources lines (including segemnts, operations, etc.)
 * @param focusedResource The genealogy data for the currently searched (focused) resource.
 * @param focusedResourceIndex Y vertical index at which the focused resource is drawn.
 * @param focusedResourceMaterialId Material id for the focused resource.
 * @param search Search function to call when line segment is selected.
 * @param svg The element to which the line will be appended.
 * @param scale The initial x and y scale to apply to the line.
 */
export function renderAntecedents({
  focusedResource,
  focusedResourceIndex,
  focusedResourceMaterialId,
  search,
  svg,
  scale,
  viewBounds,
}: RenderAntecedents) {
  const antecedents: AntecedentResource[] = [];
  focusedResource.operations.forEach(op => {
    op.antecedents.forEach(antecedent => {
      const antecedentRange = getOperationsDateRange(antecedent.operations);
      antecedents.push({ range: antecedentRange, resource: antecedent });
    });
  });

  // order antecedents by oldest end date
  antecedents.sort((a, b) => a.range.end.getTime() - b.range.end.getTime());

  // draw antecedent lines.
  antecedents.forEach((antecedent, index) => {
    const antecedentIndex = offSet(index) + focusedResourceIndex;

    const antecedentOperationThatCreatedFocusedResource = findOperationCreatingMaterialId(
      antecedent.resource.operations,
      focusedResourceMaterialId
    );

    if (antecedentOperationThatCreatedFocusedResource) {
      renderLineConnectingResources({
        xDate: new Date(antecedentOperationThatCreatedFocusedResource.endDt),
        yIndexStart: antecedentIndex,
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
      resource: antecedent.resource,
      yIndex: antecedentIndex,
      search,
      svg,
      scale,
      pathAttributes,
      viewBounds,
    });

    // render ellipsis for right side of resource (fwd in time)
    const lastestDisplayedOpDate = new Date(
      antecedent.resource.operations[antecedent.resource.operations.length - 1].endDt
    );
    renderOperationEllipsisLine({
      resource: antecedent.resource,
      search,
      ellipsisStartDate: lastestDisplayedOpDate,
      ellipsisDirection: 'forward',
      yIndex: antecedentIndex,
      operationNotShown: antecedent.resource.newestOperationNotShown,
      numberOfOperationsNotShown: antecedent.resource.numberOfNewerOperationsNotShown,
      isStillAlive: antecedent.resource.alive,
      svg,
      scale,
      viewBounds,
      color: DEFAULT_COLOR,
    });

    // render ellipsis for left side of resource (backward in time)
    const oldestDisplayedOpDate = new Date(antecedent.resource.operations[0].endDt);
    renderOperationEllipsisLine({
      resource: antecedent.resource,
      search,
      ellipsisStartDate: oldestDisplayedOpDate,
      ellipsisDirection: 'backward',
      yIndex: antecedentIndex,
      operationNotShown: antecedent.resource.oldestOperationNotShown,
      numberOfOperationsNotShown: antecedent.resource.numberOfOlderOperationsNotShown,
      hasAntecedentOrSubsequents: antecedent.resource.hasAntecedents,
      svg,
      scale,
      viewBounds,
      color: DEFAULT_COLOR,
    });

    // don't draw operation that created focused resource.
    const filteredOps = antecedent.resource.operations.filter(
      op => op.id !== antecedentOperationThatCreatedFocusedResource?.id
    );
    renderResourceOperations({
      resource: antecedent.resource,
      operations: filteredOps,
      yIndex: antecedentIndex,
      search,
      svg,
      scale,
      viewBounds,
    });

    renderResourceIcon({
      operations: antecedent.resource.operations,
      yIndex: antecedentIndex,
      svg,
      scale,
      viewBounds,
    });
  });
}
