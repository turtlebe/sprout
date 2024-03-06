import { changeTextArea } from '@plentyag/brand-ui/src/test-helpers';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { buildComment } from '@plentyag/core/src/test-helpers/mocks';
import { DateTimeFormat } from '@plentyag/core/src/utils';
import { render } from '@testing-library/react';
import { DateTime } from 'luxon';
import React from 'react';

import { dataTestIdsListItemComment as dataTestIds, ListItemComment } from '.';

const onUpdate = jest.fn();
const onDelete = jest.fn();

describe('ListItemComment', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockCurrentUser();
  });

  it('renders an editable Comment', () => {
    const comment = buildComment({});

    const { queryByTestId } = render(<ListItemComment comment={comment} onUpdate={onUpdate} onDelete={onDelete} />);

    expect(queryByTestId(dataTestIds.avatar)).toHaveTextContent(comment.createdBy[0].toUpperCase());
    expect(queryByTestId(dataTestIds.username)).toHaveTextContent(comment.createdBy);
    expect(queryByTestId(dataTestIds.createdAt)).toHaveTextContent(
      DateTime.fromISO(comment.createdAt).toFormat(DateTimeFormat.US_DEFAULT)
    );
    expect(queryByTestId(dataTestIds.content)).toHaveTextContent(comment.content);
    expect(queryByTestId(dataTestIds.editButton)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.deleteButton)).toBeInTheDocument();
  });

  it('renders an immutable Comment', () => {
    const comment = buildComment({});

    const { queryByTestId } = render(
      <ListItemComment comment={comment} onUpdate={onUpdate} onDelete={onDelete} immutable />
    );

    expect(queryByTestId(dataTestIds.editButton)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.deleteButton)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.edited)).not.toBeInTheDocument();
  });

  it('renders a non editable Comment', () => {
    const comment = buildComment({ username: 'sbell' });

    const { queryByTestId } = render(<ListItemComment comment={comment} onUpdate={onUpdate} onDelete={onDelete} />);

    expect(queryByTestId(dataTestIds.editButton)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.deleteButton)).not.toBeInTheDocument();
  });

  it('renders an edited Comment', () => {
    const comment = buildComment({ createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-02T00:00:00Z' });

    const { queryByTestId } = render(
      <ListItemComment comment={comment} onUpdate={onUpdate} onDelete={onDelete} immutable />
    );

    expect(queryByTestId(dataTestIds.edited)).toBeInTheDocument();
  });

  it('renders a custom Context', () => {
    const comment = buildComment({ username: 'sbell' });

    const { container } = render(
      <ListItemComment
        comment={comment}
        onUpdate={onUpdate}
        onDelete={onDelete}
        renderContext={comment => <div>ContextId: {comment.contextId}</div>}
      />
    );

    expect(container).toHaveTextContent(`ContextId: ${comment.contextId}`);
  });

  it('updates the comment', () => {
    const comment = buildComment({});
    const content = comment.content + 'Edited';

    const { queryByTestId } = render(<ListItemComment comment={comment} onUpdate={onUpdate} onDelete={onDelete} />);

    expect(queryByTestId(dataTestIds.editArea.submit)).not.toBeInTheDocument();

    queryByTestId(dataTestIds.editButton).click();

    expect(onUpdate).toHaveBeenCalledTimes(0);
    expect(queryByTestId(dataTestIds.editArea.submit)).toBeInTheDocument();

    changeTextArea(dataTestIds.editArea.textarea, content);
    queryByTestId(dataTestIds.editArea.submit).click();

    expect(onUpdate).toHaveBeenCalledTimes(1);
    expect(onUpdate).toHaveBeenCalledWith({ ...comment, content }, expect.any(Function));
  });

  it('deletes the comment', () => {
    const comment = buildComment({});

    const { queryByTestId } = render(<ListItemComment comment={comment} onUpdate={onUpdate} onDelete={onDelete} />);

    expect(onDelete).toHaveBeenCalledTimes(0);

    queryByTestId(dataTestIds.deleteButton).click();
    queryByTestId(dataTestIds.dialogConfirmation.confirm).click();

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith(comment, expect.any(Function));
  });
});
