import { SearchActions } from '@plentyag/app-production/src/resources-page/hooks/use-search';

import { FOCUSED_COLOR } from '../../constants';

import { renderOperationEllipsisLine } from './render-operation-ellipsis-line';
import { renderResourceIcon } from './render-resource-icon';
import { renderResourceLine } from './render-resource-line';
import { renderResourceOperations } from './render-resource-operations';

interface RenderFocusedResource {
  focusedResource: ProdResources.FocusedResource;
  focusedResourceIndex: number;
  search: SearchActions['search'];
  svg: d3.Selection<any, any, any, any>;
  scale: ProdResources.Scale;
  viewBounds: ProdResources.ViewBounds;
}

/**
 * Renders the operations (circles) and segments for the focused resource.
 * Ex: op1 ------ op2 ------ op3 ------ op4
 * @param focusedResource The genealogy data for the currently searched (focused) resource.
 * @param focusedResourceIndex Y vertical index at which the focused resource is drawn.
 * @param searchResult The resource state for the currently searched resource.
 * @param search Search function to call when line segment is selected.
 * @param svg The element to which the line will be appended.
 * @param scale The initial x and y scale to apply to the line.
 *
 */
export const renderFocusedResource = ({
  focusedResource,
  focusedResourceIndex,
  search,
  svg,
  scale,
  viewBounds,
}: RenderFocusedResource) => {
  const pathAttributes = {
    stroke: FOCUSED_COLOR,
    fill: FOCUSED_COLOR,
    strokeWidth: 2.0,
  };
  renderResourceLine({
    resource: focusedResource,
    yIndex: focusedResourceIndex,
    search,
    svg,
    scale,
    pathAttributes,
    viewBounds,
  });

  // render ellipsis for right side of resource (fwd in time)
  const laestDisplayedOpDate = new Date(focusedResource.operations[focusedResource.operations.length - 1].endDt);
  renderOperationEllipsisLine({
    resource: focusedResource,
    search,
    ellipsisStartDate: laestDisplayedOpDate,
    ellipsisDirection: 'forward',
    yIndex: focusedResourceIndex,
    operationNotShown: focusedResource.newestOperationNotShown,
    numberOfOperationsNotShown: focusedResource.numberOfNewerOperationsNotShown,
    isStillAlive: focusedResource.alive,
    svg,
    scale,
    viewBounds,
    color: FOCUSED_COLOR,
  });

  // render ellipsis for left side of resource (backward in time)
  const oldestDisplayedOpDate = new Date(focusedResource.operations[0].endDt);
  renderOperationEllipsisLine({
    resource: focusedResource,
    search,
    ellipsisStartDate: oldestDisplayedOpDate,
    ellipsisDirection: 'backward',
    yIndex: focusedResourceIndex,
    operationNotShown: focusedResource.oldestOperationNotShown,
    numberOfOperationsNotShown: focusedResource.numberOfOlderOperationsNotShown,
    svg,
    scale,
    viewBounds,
    color: FOCUSED_COLOR,
  });

  renderResourceOperations({
    resource: focusedResource,
    operations: focusedResource.operations,
    yIndex: focusedResourceIndex,
    search,
    svg,
    scale,
    viewBounds,
  });

  renderResourceIcon({
    operations: focusedResource.operations,
    yIndex: focusedResourceIndex,
    svg,
    scale,
    viewBounds,
  });
};
