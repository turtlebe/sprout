import { getMaterialCommentableId } from '@plentyag/app-production/src/common/utils';
import { useSwrAxios } from '@plentyag/core/src/hooks';
import { buildPaginatedResponse } from '@plentyag/core/src/test-helpers';
import { buildCommentable } from '@plentyag/core/src/test-helpers/mocks';
import { CommentableType } from '@plentyag/core/src/types';
import { renderHook } from '@testing-library/react-hooks';
import { uniq } from 'lodash';

import { mockMapsState } from '../../test-helpers/mock-maps-state';

import { useLoadCommentables } from '.';

jest.mock('@plentyag/core/src/hooks/use-swr-axios');

const mockUseSwrAxios = useSwrAxios as jest.Mock;

describe('useLoadCommentables', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns an emtpy array and not loading when mapsState is undefined', () => {
    mockUseSwrAxios.mockReturnValue({ data: undefined, isValidating: false, error: undefined });

    const { result } = renderHook(() => useLoadCommentables(undefined));

    expect(result.current.commentables).toEqual([]);
    expect(result.current.isLoading).toEqual(false);
    expect(mockUseSwrAxios).toHaveBeenCalledTimes(1);
    expect(mockUseSwrAxios).toHaveBeenCalledWith(false);
  });

  it('fetches commentables for each materials', () => {
    const commentableIds = uniq(
      Object.values(mockMapsState)
        .map(resource => getMaterialCommentableId(resource.resourceState))
        .filter(Boolean)
    );
    const commentables = [buildCommentable({ id: commentableIds[0], type: CommentableType.loadedTable })];
    mockUseSwrAxios.mockReturnValue({
      data: buildPaginatedResponse(commentables),
      isValidating: false,
      error: undefined,
    });

    const { result } = renderHook(() => useLoadCommentables(mockMapsState));

    expect(result.current.commentables).toEqual(commentables);
    expect(result.current.isLoading).toEqual(false);
    expect(mockUseSwrAxios).toHaveBeenCalledTimes(1);
    expect(mockUseSwrAxios).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/api/swagger/comments-service/commentables-api/search-commentables',
        method: 'POST',
        data: { ids: commentableIds, limit: commentableIds.length },
      })
    );
  });
});
