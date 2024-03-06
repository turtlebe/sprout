import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import { DraggableList } from '.';

const testDropAreaId = 'test-drop-area';
const listItemDataTestId = 'test-list-item';

interface ListItem {
  id: string;
}

describe('DraggableList', () => {
  function expectlistItemsToHaveContent(items: ListItem[], expectedContent: string[]) {
    expect(items.length).toEqual(expectedContent.length);
    items.forEach((item, index) => expect(item).toHaveTextContent(expectedContent[index]));
  }

  function renderList() {
    const mockDrop = jest.fn();

    const listItems = [{ id: '1' }, { id: '2' }, { id: '3' }];

    const listItemRenderer = listItem => {
      return <div data-testid={listItemDataTestId}>{listItem.id}</div>;
    };

    const result = render(
      <>
        <DraggableList<ListItem>
          listItems={listItems}
          targetIdentifier="test"
          listItemRenderer={listItemRenderer}
          onDrop={mockDrop}
        />
        <div data-testid={testDropAreaId}>try dropping here</div>
      </>
    );

    const items = result.queryAllByTestId(listItemDataTestId);

    expectlistItemsToHaveContent(items, ['1', '2', '3']);

    return { ...result, mockDrop, listItemRenderer, items };
  }

  it('renders the list of items', () => {
    renderList();
  });

  it('updates when new list is provided', () => {
    const { rerender, queryAllByTestId, listItemRenderer } = renderList();

    const newListItems = [{ id: '4' }];
    rerender(
      <DraggableList<ListItem> listItems={newListItems} targetIdentifier="test" listItemRenderer={listItemRenderer} />
    );

    expectlistItemsToHaveContent(queryAllByTestId(listItemDataTestId), ['4']);
  });

  it('moves item to new location', () => {
    const { mockDrop, items } = renderList();
    expect(mockDrop).not.toHaveBeenCalled();

    // drag-and-drop item '1' to last position.
    const dragEl = items[0];
    const dropEl = items[2];
    fireEvent.dragStart(dragEl);
    fireEvent.dragOver(dropEl);
    fireEvent.drop(dropEl);

    expect(mockDrop).toHaveBeenCalledTimes(1);
    expect(mockDrop).toHaveBeenCalledWith([{ id: '2' }, { id: '3' }, { id: '1' }]);
  });

  it('does not change list when dropping to location outside of allowed elements', () => {
    const { mockDrop, items, queryAllByTestId, queryByTestId } = renderList();
    expect(mockDrop).not.toHaveBeenCalled();

    // drag item '1' over item '2' then drag and drop to 'testDropAreaId' which is invalid location, so
    // should not call OnDrop and restore list to original order - since drop is not valid.
    const dragEl = items[0];
    const dragIntermediate = items[1];
    const dropEl = queryByTestId(testDropAreaId);

    fireEvent.dragStart(dragEl);
    fireEvent.dragOver(dragIntermediate);

    expectlistItemsToHaveContent(queryAllByTestId(listItemDataTestId), ['2', '1', '3']);

    fireEvent.dragOver(dropEl);
    fireEvent.drop(dropEl);

    expect(mockDrop).not.toHaveBeenCalled();

    // list should match original.
    expectlistItemsToHaveContent(queryAllByTestId(listItemDataTestId), ['1', '2', '3']);
  });
});
