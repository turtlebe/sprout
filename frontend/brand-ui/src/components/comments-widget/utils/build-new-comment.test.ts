import { CommentableType, ContextType } from '@plentyag/core/src/types';

import { buildNewComment } from './build-new-comment';

describe('buildNewComment', () => {
  it('buidls an new comment', () => {
    const commentableId = '1';
    const commentableType = CommentableType.loadedTable;
    const contextId = '2';
    const contextType = ContextType.table;
    const username = 'olittle';

    expect(
      buildNewComment({
        commentableId,
        commentableType,
        contextId,
        contextType,
        username,
      })
    ).toEqual({
      id: '',
      commentableId,
      commentableType,
      contextId,
      contextType,
      content: '',
      createdBy: username,
      updatedBy: username,
      createdAt: '',
      updatedAt: '',
    });
  });
});
