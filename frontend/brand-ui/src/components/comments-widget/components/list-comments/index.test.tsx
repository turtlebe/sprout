import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { buildComment } from '@plentyag/core/src/test-helpers/mocks';
import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsListComments as dataTestIds, ListComments } from '.';

const onUpdate = jest.fn();
const onDelete = jest.fn();
const onLoadNextComments = jest.fn();
const comments = [buildComment({ content: 'Comment A' }), buildComment({ content: 'Comment B' })];

function renderListComments({ comments = [], ...props }: Partial<ListComments>) {
  return render(
    <ListComments
      comments={comments}
      total={props.total ?? comments.length}
      onLoadNextComments={onLoadNextComments}
      onUpdate={onUpdate}
      onDelete={onDelete}
      isLoading={false}
      {...props}
    />
  );
}

describe('ListComments', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockCurrentUser();
  });

  it('renders an empty placeholder', () => {
    const { queryByTestId } = renderListComments({});

    expect(queryByTestId(dataTestIds.emptyPlaceholder)).toBeInTheDocument();
  });

  it('does not render an empty placeholder', () => {
    const { queryByTestId } = renderListComments({ comments });

    expect(queryByTestId(dataTestIds.emptyPlaceholder)).not.toBeInTheDocument();
  });

  it('renders a loading state', () => {
    const { queryByTestId } = renderListComments({ isLoading: true });

    expect(queryByTestId(dataTestIds.emptyPlaceholder)).not.toBeInTheDocument();
  });

  it('does not render a load more callback', () => {
    const { queryByTestId } = renderListComments({ comments });

    expect(queryByTestId(dataTestIds.loadMore)).not.toBeInTheDocument();
  });

  it('renders a list of comments', () => {
    const { queryByTestId } = renderListComments({ comments });

    comments.forEach(comment => {
      expect(queryByTestId(dataTestIds.comment(comment).content)).toHaveTextContent(comment.content);
      expect(queryByTestId(dataTestIds.comment(comment).editButton)).toBeInTheDocument();
      expect(queryByTestId(dataTestIds.comment(comment).deleteButton)).toBeInTheDocument();
    });
  });

  it('renders a list of immutable comments', () => {
    const { queryByTestId } = renderListComments({ comments, inheritedCommentableId: comments[0].commentableId });

    expect(queryByTestId(dataTestIds.comment(comments[0]).editButton)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.comment(comments[0]).deleteButton)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.comment(comments[1]).editButton)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.comment(comments[1]).deleteButton)).toBeInTheDocument();
  });

  it('calls `onLoadNextComments` when clicking load more', () => {
    const { queryByTestId } = renderListComments({ comments, total: 5 });

    expect(queryByTestId(dataTestIds.loadMore)).toBeInTheDocument();
    expect(onLoadNextComments).toHaveBeenCalledTimes(0);

    queryByTestId(dataTestIds.loadMore).click();

    expect(onLoadNextComments).toHaveBeenCalledTimes(1);
  });
});
