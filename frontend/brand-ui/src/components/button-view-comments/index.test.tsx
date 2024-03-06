import { dataTestIdsFakeTooltipTitle } from '@plentyag/brand-ui/src/test-helpers/mock-tooltip';
import { COMMENTS_URLS } from '@plentyag/core/src/constants';
import { useSwrAxios } from '@plentyag/core/src/hooks';
import { buildPaginatedResponse } from '@plentyag/core/src/test-helpers';
import { buildComment } from '@plentyag/core/src/test-helpers/mocks';
import { Comment, CommentableType } from '@plentyag/core/src/types';
import { render } from '@testing-library/react';
import React from 'react';

import { ButtonViewComments, dataTestIdsButtonViewComments as dataTestIds } from '.';

const onClick = jest.fn();
const commentableId = 'commentableId';
const commentableType = CommentableType.deviceId;

const url = COMMENTS_URLS.listUrl({ commentableIds: [commentableId], commentableType, limit: 1, order: 'desc' });

jest.mock('@plentyag/core/src/hooks/use-swr-axios');

const mockUseSwrAxios = useSwrAxios as jest.Mock;

function renderButtonViewComments(props: Partial<ButtonViewComments> = {}) {
  return render(
    <ButtonViewComments onClick={onClick} commentableId={commentableId} commentableType={commentableType} {...props} />
  );
}

describe('ButtonViewComments', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseSwrAxios.mockImplementation(() => ({ data: undefined, isValidating: false }));
  });

  it('returns a button with a default tooltip', () => {
    expect(mockUseSwrAxios).not.toHaveBeenCalled();

    const { queryByTestId } = renderButtonViewComments();

    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsFakeTooltipTitle.title)).toHaveTextContent('View Comments');
    expect(queryByTestId(dataTestIds.lastComment)).not.toBeInTheDocument();
    expect(mockUseSwrAxios).toHaveBeenCalledWith({ url });
  });

  it('returns a button with a default tooltip when commentableId is undefined', () => {
    expect(mockUseSwrAxios).not.toHaveBeenCalled();

    const { queryByTestId } = renderButtonViewComments({ commentableId: undefined });

    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsFakeTooltipTitle.title)).toHaveTextContent('View Comments');
    expect(queryByTestId(dataTestIds.lastComment)).not.toBeInTheDocument();
    expect(mockUseSwrAxios).toHaveBeenCalledWith(undefined);
  });

  it('returns a button with a default tooltip when there are no comments', () => {
    mockUseSwrAxios.mockImplementation(() => ({ data: buildPaginatedResponse<Comment>([]), isValidating: false }));

    expect(mockUseSwrAxios).not.toHaveBeenCalled();

    const { queryByTestId } = renderButtonViewComments();

    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsFakeTooltipTitle.title)).toHaveTextContent('View Comments');
    expect(queryByTestId(dataTestIds.lastComment)).not.toBeInTheDocument();
    expect(mockUseSwrAxios).toHaveBeenCalledWith({ url });
  });

  it('returns a button with a tooltip containing the last comment', () => {
    const data = buildPaginatedResponse<Comment>([
      buildComment({ content: 'comment a' }),
      buildComment({ content: 'comment b' }),
    ]);
    mockUseSwrAxios.mockImplementation(() => ({ data, isValidating: false }));

    expect(mockUseSwrAxios).not.toHaveBeenCalled();

    const { queryByTestId } = renderButtonViewComments();

    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsFakeTooltipTitle.title)).toHaveTextContent('View Comments');
    expect(queryByTestId(dataTestIds.lastComment)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.lastComment)).toHaveTextContent(data.data[0].content);
    expect(mockUseSwrAxios).toHaveBeenCalledWith({ url });
  });
});
