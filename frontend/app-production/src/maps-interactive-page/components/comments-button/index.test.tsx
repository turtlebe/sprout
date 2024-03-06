import {
  buildLAX1ContainerLocation,
  buildMaterialObject,
  buildResourceState,
} from '@plentyag/app-production/src/common/test-helpers/mock-builders';
import {
  getMaterialCommentableId,
  getMaterialCommentableType,
  getMaterialContextId,
  getMaterialContextType,
} from '@plentyag/app-production/src/common/utils';
import { CommentsWidget } from '@plentyag/brand-ui/src/components';
import { render } from '@testing-library/react';
import React from 'react';

import { CommentsButton, dataTestIdsCommentsButton as dataTestIds } from '.';

jest.mock('@plentyag/brand-ui/src/components/comments-widget');

const MockCommentsWidget = CommentsWidget as jest.Mock;

const germTableContainerLocation = buildLAX1ContainerLocation({ containerType: 'GermTable' });
const propTableContainerLocation = buildLAX1ContainerLocation({ containerType: 'PropTable' });
const towerContainerLocation = buildLAX1ContainerLocation({ containerType: 'Tower' });
const loadedTray = buildMaterialObject({ materialType: 'LOADED_TRAY' });
const loadedTable = buildMaterialObject({ materialType: 'LOADED_TABLE' });
const loadedTower = buildMaterialObject({ materialType: 'LOADED_TOWER' });

function getData(containerLocation, materialObj = null) {
  return {
    containerLocation,
    resourceState: buildResourceState({ containerLocation, materialObj }),
    lastLoadOperation: null,
  };
}

function renderCommentsButton(data) {
  return render(<CommentsButton data={data} parentWidth={400} />);
}

describe('CommentsButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    MockCommentsWidget.mockImplementation(() => <div />);
  });

  it('does not show button for an empty table in germination', () => {
    const data = getData(germTableContainerLocation);
    const { queryByTestId } = renderCommentsButton(data);

    expect(queryByTestId(dataTestIds.root)).not.toBeInTheDocument();
  });

  it('does not show button for a table in germination', () => {
    const data = getData(germTableContainerLocation, loadedTray);
    const { queryByTestId } = renderCommentsButton(data);

    expect(queryByTestId(dataTestIds.root)).not.toBeInTheDocument();
  });

  it('show comments for a table in propagation', () => {
    const data = getData(propTableContainerLocation, loadedTable);
    const { queryByTestId } = renderCommentsButton(data);

    expect(queryByTestId(dataTestIds.commentsContainer)).not.toBeInTheDocument();

    queryByTestId(dataTestIds.root).click();

    expect(queryByTestId(dataTestIds.commentsContainer)).toBeInTheDocument();
    expect(MockCommentsWidget).toHaveBeenCalledTimes(1);
    expect(MockCommentsWidget).toHaveBeenCalledWith(
      {
        commentableId: getMaterialCommentableId(data.resourceState),
        commentableType: getMaterialCommentableType(data.resourceState),
        contextId: getMaterialContextId(data.resourceState),
        contextType: getMaterialContextType(data.resourceState),
        variant: 'outlined',
        renderContext: expect.any(Function),
      },
      {}
    );
  });

  it('does not show button for empty table in propagation', () => {
    const data = getData(propTableContainerLocation);
    const { queryByTestId } = renderCommentsButton(data);

    expect(queryByTestId(dataTestIds.root)).not.toBeInTheDocument();
  });

  it('show comments for a tower', () => {
    const data = getData(towerContainerLocation, loadedTower);
    const { queryByTestId } = renderCommentsButton(data);

    expect(queryByTestId(dataTestIds.commentsContainer)).not.toBeInTheDocument();

    queryByTestId(dataTestIds.root).click();

    expect(queryByTestId(dataTestIds.commentsContainer)).toBeInTheDocument();
    expect(MockCommentsWidget).toHaveBeenCalledTimes(1);
    expect(MockCommentsWidget).toHaveBeenCalledWith(
      {
        commentableId: getMaterialCommentableId(data.resourceState),
        commentableType: getMaterialCommentableType(data.resourceState),
        contextId: getMaterialContextId(data.resourceState),
        contextType: getMaterialContextType(data.resourceState),
        variant: 'outlined',
        renderContext: expect.any(Function),
      },
      {}
    );
  });

  it('does not show button for empty tower', () => {
    const data = getData(towerContainerLocation);
    const { queryByTestId } = renderCommentsButton(data);

    expect(queryByTestId(dataTestIds.root)).not.toBeInTheDocument();
  });
});
