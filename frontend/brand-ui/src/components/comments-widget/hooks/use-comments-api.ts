import { COMMENTS_URLS } from '@plentyag/core/src/constants';
import { useCoreStore } from '@plentyag/core/src/core-store';
import {
  useDeletedByHeader,
  useDeleteRequest,
  usePostRequest,
  usePutRequest,
  useSwrAxios,
} from '@plentyag/core/src/hooks';
import { Comment, CommentableType, ContextType, PaginatedList } from '@plentyag/core/src/types';
import {
  getArrayWithoutIndex,
  getArrayWithUpdatedIndex,
  parseErrorMessage,
  sortByDate,
} from '@plentyag/core/src/utils';
import { uniqBy } from 'lodash';
import React from 'react';

import { useGlobalSnackbar } from '../../global-snackbar';
import { buildNewComment } from '../utils';

export const DEFAULT_LIMIT = 100;

export interface UseCommentsApi {
  commentableId: string;
  commentableType: CommentableType;
  contextId: string;
  contextType: ContextType;
  inheritedCommentableId?: string;
  limit?: number;
}

export interface UseCommentsApiReturn {
  comments: Comment[];
  total: number;
  isLoading: boolean;
  newComment: Comment;
  setNewComment: React.Dispatch<React.SetStateAction<Comment>>;
  handleCreateComment: (comment: Comment) => void;
  handleUpdateComment: (comment: Comment, done: () => void) => void;
  handleDeleteComment: (comment: Comment, done: () => void) => void;
  handleLoadNextComments: () => void;
}

export const useCommentsApi = ({
  commentableId,
  commentableType,
  contextId,
  contextType,
  inheritedCommentableId,
  limit = DEFAULT_LIMIT,
}: UseCommentsApi): UseCommentsApiReturn => {
  // Miscellanous
  const [coreStore] = useCoreStore();
  const { username } = coreStore.currentUser;
  const deletedByHeader = useDeletedByHeader();
  const snackbar = useGlobalSnackbar();

  // States
  const [offset, setOffset] = React.useState<number>(0);
  const [comments, setComments] = React.useState([]);
  const [newComment, setNewComment] = React.useState<Comment>(
    buildNewComment({ commentableId, commentableType, contextId, contextType, username })
  );

  const commentableIds = [commentableId, inheritedCommentableId].filter(Boolean);
  // Fetching Data
  const { data, isValidating } = useSwrAxios<PaginatedList<Comment>>({
    url: COMMENTS_URLS.searchUrl(),
    method: 'POST',
    data: { commentableIds, order: 'desc', limit, offset },
  });
  const { makeRequest: makePostRequest, isLoading: isCreating } = usePostRequest<Comment, Comment>({
    url: COMMENTS_URLS.createUrl(),
  });
  const { makeRequest: makePutRequest, isLoading: isUpdating } = usePutRequest<Comment, Comment>({});
  const { makeRequest: makeDeleteRequest, isLoading: isDeleting } = useDeleteRequest<Comment>({
    headers: deletedByHeader,
  });

  // Effects
  React.useEffect(() => {
    if (data?.data?.length > 0) {
      // aggregate current comments with new comments fetched and dedup
      const rawComments = uniqBy([...comments, ...data?.data], 'id');

      // reverse the order so that the list is from oldest to most recent
      rawComments.sort(sortByDate({ attribute: 'createdAt', order: 'asc' }));

      // refresh comments state
      setComments(rawComments);
    }
  }, [data?.data]);

  // Handlers
  const errorHandler = error => {
    const message = parseErrorMessage(error);
    snackbar.errorSnackbar({ message });
  };

  const handleCreateComment: UseCommentsApiReturn['handleCreateComment'] = comment => {
    makePostRequest({
      data: comment,
      onSuccess: response => {
        setNewComment(buildNewComment({ commentableId, commentableType, contextId, contextType, username }));
        setComments([...comments, response]);
      },
      onError: errorHandler,
    });
  };

  const handleUpdateComment: UseCommentsApiReturn['handleUpdateComment'] = (updatedComment, done) => {
    makePutRequest({
      url: COMMENTS_URLS.updateUrl(updatedComment),
      data: updatedComment,
      onSuccess: response => {
        const index = comments.findIndex(comment => comment.id === response.id);
        setComments(getArrayWithUpdatedIndex(comments, response, index));
        done();
      },
      onError: error => {
        errorHandler(error);
        done();
      },
    });
  };

  const handleDeleteComment: UseCommentsApiReturn['handleDeleteComment'] = (deletedComment, done) => {
    makeDeleteRequest({
      url: COMMENTS_URLS.deleteUrl(deletedComment),
      onSuccess: response => {
        const index = comments.findIndex(comment => comment.id === response.id);
        setComments(getArrayWithoutIndex(comments, index));
        done();
      },
      onError: error => {
        errorHandler(error);
        done();
      },
    });
  };

  const handleLoadNextComments: UseCommentsApiReturn['handleLoadNextComments'] = () => {
    setOffset(offset + limit);
  };

  // Computed properties
  const isLoading = isValidating || isCreating || isUpdating || isDeleting;

  return {
    newComment,
    setNewComment,
    isLoading,
    comments,
    total: data?.meta?.total ?? 0,
    handleCreateComment,
    handleUpdateComment,
    handleDeleteComment,
    handleLoadNextComments,
  };
};
