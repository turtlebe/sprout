import { COMMENTS_URLS } from '@plentyag/core/src/constants';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { useDeleteRequest, usePostRequest, usePutRequest, useSwrAxios } from '@plentyag/core/src/hooks';
import { actAndAwaitForHook, buildPaginatedResponse } from '@plentyag/core/src/test-helpers';
import { buildComment } from '@plentyag/core/src/test-helpers/mocks';
import { uuidv4 } from '@plentyag/core/src/utils';
import { act, renderHook } from '@testing-library/react-hooks';

import { mockGlobalSnackbar } from '../../global-snackbar/test-helper';
import { buildNewComment } from '../utils';

import { DEFAULT_LIMIT, useCommentsApi } from './use-comments-api';

jest.mock('@plentyag/core/src/hooks/use-axios');
jest.mock('@plentyag/core/src/hooks/use-swr-axios');

const mockUseSwrAxios = useSwrAxios as jest.Mock;
const mockUsePostRequest = usePostRequest as jest.Mock;
const mockUsePutRequest = usePutRequest as jest.Mock;
const mockUseDeleteRequest = useDeleteRequest as jest.Mock;
const makePostRequest = jest.fn();
const makePutRequest = jest.fn();
const makeDeleteRequest = jest.fn();

const comments = [buildComment({}), buildComment({}), buildComment({})];
const { commentableId, commentableType, contextId, contextType } = buildComment({});

describe('useCommentsApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockCurrentUser();
    mockGlobalSnackbar();

    makePostRequest.mockImplementation(({ data, onSuccess }) => onSuccess(data));
    makePutRequest.mockImplementation(({ data, onSuccess }) => onSuccess(data));
    makeDeleteRequest.mockImplementation(({ onSuccess }) => onSuccess());
    mockUseSwrAxios.mockReturnValue({ data: buildPaginatedResponse(comments), isValidating: false });
    mockUsePostRequest.mockReturnValue({ data: undefined, isLoading: false, makeRequest: makePostRequest });
    mockUsePutRequest.mockReturnValue({ data: undefined, isLoading: false, makeRequest: makePutRequest });
    mockUseDeleteRequest.mockReturnValue({ data: undefined, isLoading: false, makeRequest: makeDeleteRequest });
  });

  it('returns a state for a new comment', () => {
    const newComment = buildComment({ content: 'new content' });
    const { result } = renderHook(() => useCommentsApi({ commentableId, commentableType, contextId, contextType }));

    expect(result.current.newComment).toEqual(
      buildNewComment({ commentableId, commentableType, contextId, contextType, username: 'olittle' })
    );

    act(() => result.current.setNewComment(newComment));

    expect(result.current.newComment).toEqual(newComment);
  });

  it('returns an empty list of comments and a loading state', () => {
    mockUseSwrAxios.mockReturnValue({ data: undefined, isValidating: true });

    const { result } = renderHook(() => useCommentsApi({ commentableId, commentableType, contextId, contextType }));

    expect(result.current.comments).toEqual([]);
    expect(result.current.isLoading).toBe(true);
    expect(mockUseSwrAxios).toHaveBeenCalledWith({
      url: COMMENTS_URLS.searchUrl(),
      method: 'POST',
      data: { commentableIds: [commentableId], order: 'desc', limit: DEFAULT_LIMIT, offset: 0 },
    });
  });

  it('fetchs comments for the two commentableId', () => {
    mockUseSwrAxios.mockReturnValue({ data: undefined, isValidating: true });
    const otherCommentableId = uuidv4();

    const { result } = renderHook(() =>
      useCommentsApi({
        commentableId,
        commentableType,
        contextId,
        contextType,
        inheritedCommentableId: otherCommentableId,
      })
    );

    expect(result.current.comments).toEqual([]);
    expect(result.current.isLoading).toBe(true);
    expect(mockUseSwrAxios).toHaveBeenCalledWith({
      url: COMMENTS_URLS.searchUrl(),
      method: 'POST',
      data: { commentableIds: [commentableId, otherCommentableId], order: 'desc', limit: DEFAULT_LIMIT, offset: 0 },
    });
  });

  it('returns a list of comments', () => {
    const { result } = renderHook(() => useCommentsApi({ commentableId, commentableType, contextId, contextType }));

    expect(result.current.comments).toEqual(comments);
    expect(result.current.isLoading).toBe(false);
    expect(mockUseSwrAxios).toHaveBeenCalledWith({
      url: COMMENTS_URLS.searchUrl(),
      method: 'POST',
      data: { commentableIds: [commentableId], order: 'desc', limit: DEFAULT_LIMIT, offset: 0 },
    });
  });

  it('fetches the next page of comments', () => {
    expect(mockUseSwrAxios).toHaveBeenCalledTimes(0);

    const { result } = renderHook(() => useCommentsApi({ commentableId, commentableType, contextId, contextType }));

    expect(result.current.comments).toEqual(comments);
    expect(result.current.isLoading).toBe(false);
    expect(mockUseSwrAxios).toHaveBeenCalledTimes(2);
    expect(mockUseSwrAxios).toHaveBeenNthCalledWith(2, {
      url: COMMENTS_URLS.searchUrl(),
      method: 'POST',
      data: { commentableIds: [commentableId], order: 'desc', limit: DEFAULT_LIMIT, offset: 0 },
    });

    act(() => result.current.handleLoadNextComments());

    expect(mockUseSwrAxios).toHaveBeenCalledTimes(3);
    expect(mockUseSwrAxios).toHaveBeenNthCalledWith(3, {
      url: COMMENTS_URLS.searchUrl(),
      method: 'POST',
      data: { commentableIds: [commentableId], order: 'desc', limit: DEFAULT_LIMIT, offset: DEFAULT_LIMIT },
    });
  });

  it('creates a comment', async () => {
    const newComment = buildNewComment({ commentableId, commentableType, contextId, contextType, username: 'olittle' });

    const { result } = renderHook(() => useCommentsApi({ commentableId, commentableType, contextId, contextType }));

    expect(makePostRequest).toHaveBeenCalledTimes(0);

    await actAndAwaitForHook(() => result.current.handleCreateComment(newComment));

    expect(makePostRequest).toHaveBeenCalledTimes(1);
    expect(makePostRequest).toHaveBeenCalledWith(expect.objectContaining({ data: newComment }));
  });

  it('updates a comment', async () => {
    const updatedComment = { ...comments[1], content: 'new-content' };
    const done = jest.fn();

    const { result } = renderHook(() => useCommentsApi({ commentableId, commentableType, contextId, contextType }));

    expect(done).toHaveBeenCalledTimes(0);
    expect(makePutRequest).toHaveBeenCalledTimes(0);
    expect(result.current.comments).toEqual(comments);

    await actAndAwaitForHook(() => result.current.handleUpdateComment(updatedComment, done));

    expect(done).toHaveBeenCalledTimes(1);
    expect(makePutRequest).toHaveBeenCalledTimes(1);
    expect(makePutRequest).toHaveBeenCalledWith(
      expect.objectContaining({ url: COMMENTS_URLS.updateUrl(updatedComment), data: updatedComment })
    );
  });

  it('logs an error and revert to the original coments when updating fails', () => {});

  it('deletes a comment', async () => {
    const deletedComment = comments[1];
    const done = jest.fn();
    makeDeleteRequest.mockImplementation(({ onSuccess }) => onSuccess(deletedComment));

    const { result } = renderHook(() => useCommentsApi({ commentableId, commentableType, contextId, contextType }));

    expect(done).toHaveBeenCalledTimes(0);
    expect(makeDeleteRequest).toHaveBeenCalledTimes(0);
    expect(mockUseDeleteRequest).not.toHaveBeenCalledTimes(0);
    expect(mockUseDeleteRequest).toHaveBeenCalledWith({ headers: { 'X-Deleted-By': 'olittle' } });
    expect(result.current.comments).toEqual(comments);

    await actAndAwaitForHook(() => result.current.handleDeleteComment(deletedComment, done));

    expect(done).toHaveBeenCalledTimes(1);
    expect(makeDeleteRequest).toHaveBeenCalledTimes(1);
    expect(makeDeleteRequest).toHaveBeenCalledWith(
      expect.objectContaining({ url: COMMENTS_URLS.deleteUrl(deletedComment) })
    );
  });
});
