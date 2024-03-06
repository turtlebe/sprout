import { useMapsInteractiveRouting } from '@plentyag/app-production/src/maps-interactive-page/hooks';
import { buildComment } from '@plentyag/core/src/test-helpers/mocks';
import { Comment } from '@plentyag/core/src/types';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { CommentsWidgetContext, dataTestIdsCommentsWidgetContext as dataTestIds } from './comments-widget-context';

jest.mock('@plentyag/app-production/src/maps-interactive-page/hooks/use-maps-interactive-routing');

const comment = buildComment({});
const commentWithoutContext = buildComment({ contextId: null, contextType: null });
const resourcesPageBasePath = '/path';

const mockUseMapsInteractiveRouting = useMapsInteractiveRouting as jest.Mock;

function renderCommentsWidgetContext(comment: Comment) {
  return render(<CommentsWidgetContext comment={comment} />, { wrapper: props => <MemoryRouter {...props} /> });
}

describe('CommentsWidgetContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseMapsInteractiveRouting.mockReturnValue({ resourcesPageBasePath });
  });

  it('renders a chip', () => {
    const { queryByTestId } = renderCommentsWidgetContext(comment);

    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.root).getAttribute('href')).toBe(
      `${resourcesPageBasePath}?q=${comment.contextId}`
    );
  });

  it('renders nothing when the comment does not have a context', () => {
    const { container } = renderCommentsWidgetContext(commentWithoutContext);

    expect(container).toBeEmptyDOMElement();
  });
});
