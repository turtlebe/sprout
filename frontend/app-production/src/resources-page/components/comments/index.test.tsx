import { AppProductionTestWrapper } from '@plentyag/app-production/src/common/test-helpers';
import {
  buildLAX1ContainerLocation,
  buildMaterialObject,
  buildResourceState,
} from '@plentyag/app-production/src/common/test-helpers/mock-builders';
import {
  getMaterialCommentableId,
  getMaterialCommentableType,
  getMaterialContextId,
  getMaterialContextType,
} from '@plentyag/app-production/src/common/utils';
import { useSearch } from '@plentyag/app-production/src/resources-page/hooks/use-search';
import { CommentsWidget } from '@plentyag/brand-ui/src/components';
import { buildComment } from '@plentyag/core/src/test-helpers/mocks';
import { Comment, CommentableType, ContextType } from '@plentyag/core/src/types';
import { uuidv4 } from '@plentyag/core/src/utils';
import { render } from '@testing-library/react';
import React from 'react';

import { Comments, dataTestIdsComments as dataTestIds } from '.';

jest.mock('@plentyag/brand-ui/src/components/comments-widget');
jest.mock('@plentyag/app-production/src/resources-page/hooks/use-search');

const mockUseSearch = useSearch as jest.Mock;
const MockCommentsWidget = CommentsWidget as jest.Mock;
const resource = buildResourceState({
  containerLocation: buildLAX1ContainerLocation({ containerType: 'Tower' }),
  materialObj: buildMaterialObject({ materialType: 'LOADED_TOWER' }),
});
const commentWithSameContext = buildComment({
  commentableId: resource.materialId,
  commentableType: CommentableType.loadedTower,
  contextId: resource.containerId,
  contextType: ContextType.tower,
});
const commentWithoutContext = buildComment({
  commentableId: resource.materialId,
  commentableType: CommentableType.loadedTable,
  contextId: null,
  contextType: null,
});
const commentWithDifferentContext = buildComment({
  commentableId: resource.materialId,
  commentableType: CommentableType.loadedTable,
  contextId: uuidv4(),
  contextType: ContextType.table,
});

function renderComments(comment: Comment) {
  MockCommentsWidget.mockImplementation(({ renderContext }) => renderContext(comment));

  return render(<Comments />, { wrapper: AppProductionTestWrapper });
}

describe('Comments', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    mockUseSearch.mockReturnValue([resource]);
  });

  it('renders without context when the context is the same than the commentable', () => {
    const { container } = renderComments(commentWithSameContext);

    expect(MockCommentsWidget).toHaveBeenCalledTimes(1);
    expect(MockCommentsWidget).toHaveBeenCalledWith(
      {
        commentableId: getMaterialCommentableId(resource),
        commentableType: getMaterialCommentableType(resource),
        contextId: getMaterialContextId(resource),
        contextType: getMaterialContextType(resource),
        renderContext: expect.any(Function),
      },
      {}
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders without context when the context is missing', () => {
    const { container } = renderComments(commentWithoutContext);

    expect(MockCommentsWidget).toHaveBeenCalledTimes(1);
    expect(MockCommentsWidget).toHaveBeenCalledWith(
      {
        commentableId: getMaterialCommentableId(resource),
        commentableType: getMaterialCommentableType(resource),
        contextId: getMaterialContextId(resource),
        contextType: getMaterialContextType(resource),
        renderContext: expect.any(Function),
      },
      {}
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders with context when the context is different', () => {
    const { queryByTestId } = renderComments(commentWithDifferentContext);

    expect(MockCommentsWidget).toHaveBeenCalledTimes(1);
    expect(MockCommentsWidget).toHaveBeenCalledWith(
      {
        commentableId: getMaterialCommentableId(resource),
        commentableType: getMaterialCommentableType(resource),
        contextId: getMaterialContextId(resource),
        contextType: getMaterialContextType(resource),
        renderContext: expect.any(Function),
      },
      {}
    );

    expect(queryByTestId(dataTestIds.context)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.context).getAttribute('href')).toBe(
      `/production/sites/LAX1/farms/LAX1/resources?q=${commentWithDifferentContext.contextId}`
    );
  });
});
