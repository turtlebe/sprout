import { changeTextArea } from '@plentyag/brand-ui/src/test-helpers';
import { COMMENTS_URLS } from '@plentyag/core/src/constants';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { useDeleteRequest, usePostRequest, usePutRequest, useSwrAxios } from '@plentyag/core/src/hooks';
import { buildPaginatedResponse } from '@plentyag/core/src/test-helpers';
import { buildComment } from '@plentyag/core/src/test-helpers/mocks';
import { render } from '@testing-library/react';
import React from 'react';

import { CommentsWidget, dataTestIdsCommentsWidget as dataTestIds } from '.';

jest.mock('@plentyag/core/src/hooks/use-axios');
jest.mock('@plentyag/core/src/hooks/use-swr-axios');

const comments = [buildComment({}), buildComment({})];
const comment = buildComment({});
const { commentableId, commentableType, contextId, contextType } = comment;
const username = 'olittle';
const mockUseSwrAxios = useSwrAxios as jest.Mock;
const mockUsePostRequest = usePostRequest as jest.Mock;
const mockUsePutRequest = usePutRequest as jest.Mock;
const mockUseDeleteRequest = useDeleteRequest as jest.Mock;
const makePostRequest = jest.fn();
const makePutRequest = jest.fn();
const makeDeleteRequest = jest.fn();
const revalidate = jest.fn();

function renderCommentsWidget() {
  return render(
    <CommentsWidget
      commentableId={commentableId}
      commentableType={commentableType}
      contextId={contextId}
      contextType={contextType}
    />
  );
}

describe('CommentsWidget', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockCurrentUser();

    revalidate.mockResolvedValue(true);
    mockUseSwrAxios.mockReturnValue({ data: buildPaginatedResponse(comments), isValidating: false, revalidate });
    mockUsePostRequest.mockReturnValue({ data: undefined, isLoading: false, makeRequest: makePostRequest });
    mockUsePutRequest.mockReturnValue({ data: undefined, isLoading: false, makeRequest: makePutRequest });
    mockUseDeleteRequest.mockReturnValue({ data: undefined, isLoading: false, makeRequest: makeDeleteRequest });
  });

  it('renders with a loading state', () => {
    mockUseSwrAxios.mockReturnValue({ data: undefined, isValidating: true, revalidate });

    const { queryByTestId } = renderCommentsWidget();

    expect(queryByTestId(dataTestIds.loader)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.listComments.emptyPlaceholder)).not.toBeInTheDocument();
  });

  it('renders without a loading state', () => {
    mockUseSwrAxios.mockReturnValue({ data: undefined, isValidating: false, revalidate });

    const { queryByTestId } = renderCommentsWidget();

    expect(queryByTestId(dataTestIds.loader)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.listComments.emptyPlaceholder)).toBeInTheDocument();
  });

  it('creates a comment', () => {
    const { queryByTestId } = renderCommentsWidget();

    expect(makePostRequest).toHaveBeenCalledTimes(0);

    // -> Type a new comment and submit
    changeTextArea(dataTestIds.newComment.textarea, 'New Comment');
    queryByTestId(dataTestIds.newComment.submit).click();

    expect(makePostRequest).toHaveBeenCalledTimes(1);
    expect(makePostRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          id: '',
          commentableId,
          commentableType,
          contextId,
          contextType,
          createdBy: username,
          updatedBy: username,
          createdAt: '',
          updatedAt: '',
          content: 'New Comment',
        },
      })
    );
  });

  it('updates a comment', () => {
    const newContent = comments[1].content + 'Updated';

    const { queryByTestId } = renderCommentsWidget();

    expect(makePutRequest).toHaveBeenCalledTimes(0);

    // -> Click edit on a commnent, enter a new content and submit
    queryByTestId(dataTestIds.listComments.comment(comments[1]).editButton).click();
    changeTextArea(dataTestIds.listComments.comment(comments[1]).editArea.textarea, newContent);
    queryByTestId(dataTestIds.listComments.comment(comments[1]).editArea.submit).click();

    expect(makePutRequest).toHaveBeenCalledTimes(1);
    expect(makePutRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        url: COMMENTS_URLS.updateUrl(comments[1]),
        data: { ...comments[1], content: newContent },
      })
    );
  });

  it('deletes a comment', () => {
    const { queryByTestId } = renderCommentsWidget();

    expect(makeDeleteRequest).toHaveBeenCalledTimes(0);

    // -> Click delete on a comment and confirm
    queryByTestId(dataTestIds.listComments.comment(comments[1]).deleteButton).click();
    queryByTestId(dataTestIds.listComments.comment(comments[1]).dialogConfirmation.confirm).click();

    expect(makeDeleteRequest).toHaveBeenCalledTimes(1);
    expect(makeDeleteRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        url: COMMENTS_URLS.deleteUrl(comments[1]),
      })
    );
  });
});
