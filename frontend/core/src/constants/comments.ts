import { Comment } from '@plentyag/core/src/types';

import { toQueryParams } from '../utils';

export const COMMENTS_URLS = {
  createUrl: () => '/api/swagger/comments-service/comments-api/create-comment',
  updateUrl: (comment: Comment) => `/api/swagger/comments-service/comments-api/update-comment/${comment.id}`,
  deleteUrl: (comment: Comment) => `/api/swagger/comments-service/comments-api/delete-comment/${comment.id}`,
  searchUrl: () => '/api/swagger/comments-service/comments-api/search-comments',
  listUrl: queryParams =>
    `/api/swagger/comments-service/comments-api/list-comments${toQueryParams(queryParams, {
      doNotEncodeArray: true,
      encodeKeyUsingSnakeCase: true,
    })}`,
};

export const COMMENTABLE_URLS = {
  searchUrl: () => '/api/swagger/comments-service/commentables-api/search-commentables',
};
