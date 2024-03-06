import { IDoesFilterPassParams, RowNode } from '@ag-grid-community/all-modules';
import { render, RenderResult } from '@testing-library/react';
import React from 'react';

import { SelectionFilter, selectionFilterTestIds } from './selection-filter';

const selectableItems: LT.SelectableItem[] = [
  { name: 'Item1', value: 'item1' },
  { name: 'Item2', value: 'item2' },
  { name: 'Item3', value: 'item3' },
];

const selectedItem1 = { name: 'Item1', value: 'item1' };
const selectedItem2 = { name: 'Item2', value: 'item2' };

describe('SelectionFilter', () => {
  async function getSelectionFilter(selectableItems: LT.SelectableItem[], multiple: boolean) {
    var ref = React.createRef<SelectionFilter>();
    const valueGetter = (rowNode: RowNode) => {
      return rowNode.data;
    };
    const mockFilterChangedCallback = jest.fn();
    const mock: any = {}; // values not needed for testing here.
    const filter = render(
      <SelectionFilter
        ref={ref}
        selectableItems={selectableItems}
        multiple={multiple}
        api={mock}
        columnApi={mock}
        column={mock}
        colDef={mock}
        rowModel={mock}
        filterChangedCallback={mockFilterChangedCallback}
        filterModifiedCallback={mock}
        valueGetter={valueGetter}
        doesRowPassOtherFilter={mock}
        context={undefined}
      />
    );
    const checkBoxes = await filter.findAllByTestId(selectionFilterTestIds.checkbox);
    return { filter, ref, checkBoxes, mockFilterChangedCallback };
  }

  async function getSelectedCheckBoxes(filter: RenderResult) {
    const checkBoxes = await filter.findAllByTestId(selectionFilterTestIds.checkbox);
    return (checkBoxes as HTMLInputElement[]).filter(checkbox => checkbox.checked);
  }
  it('setModel sets selected items - multiple allowed', async () => {
    const { filter, ref } = await getSelectionFilter(selectableItems, true);
    const selectionFilter: LT.SelectionFilterModel = {
      filterType: 'selection',
      selectedItems: [selectedItem1, selectedItem2],
    };
    ref.current?.setModel(selectionFilter);
    const selected = await getSelectedCheckBoxes(filter);
    expect(selected).toHaveLength(2);
  });

  it('setModel sets selected items - only single allowed', async () => {
    const { filter, ref } = await getSelectionFilter(selectableItems, false);
    const selectionFilter: LT.SelectionFilterModel = {
      filterType: 'selection',
      selectedItems: [selectedItem1, selectedItem2],
    };
    ref.current?.setModel(selectionFilter);
    const selected = await getSelectedCheckBoxes(filter);
    expect(selected).toHaveLength(1);
  });

  it('doesFilterPass returns true for a node matching filter', async () => {
    const { ref } = await getSelectionFilter(selectableItems, false);
    const selectionFilter: LT.SelectionFilterModel = {
      filterType: 'selection',
      selectedItems: [selectedItem1],
    };
    ref.current?.setModel(selectionFilter);

    const node1 = {
      data: selectedItem1,
    };
    const params1: IDoesFilterPassParams = {
      node: node1 as RowNode,
      data: selectedItem1,
    };
    expect(ref.current?.doesFilterPass(params1)).toBe(true);
  });

  it('doesFilterPass returns false for node not matching filter', async () => {
    const { ref } = await getSelectionFilter(selectableItems, false);
    const selectionFilter: LT.SelectionFilterModel = {
      filterType: 'selection',
      selectedItems: [selectedItem1],
    };
    ref.current?.setModel(selectionFilter);

    const node2 = {
      data: selectedItem2,
    };
    const params2: IDoesFilterPassParams = {
      node: node2 as RowNode,
      data: selectedItem2,
    };
    expect(ref.current?.doesFilterPass(params2)).toBe(false);
  });

  it('unapplied items will return no model', async () => {
    const { filter, ref } = await getSelectionFilter(selectableItems, false);
    const checkBoxes = await filter.findAllByTestId(selectionFilterTestIds.checkbox);
    checkBoxes[0].click();
    expect(ref.current?.getModel()).toBeFalsy();
    expect(ref.current?.isFilterActive()).toBe(false);
  });

  it('applied items will return model with selected item', async () => {
    const { filter, ref, mockFilterChangedCallback } = await getSelectionFilter(selectableItems, false);
    const checkBoxes = await filter.findAllByTestId(selectionFilterTestIds.checkbox);
    checkBoxes[0].click();
    filter.getByTestId(selectionFilterTestIds.apply).click();
    expect(ref.current?.getModel()?.selectedItems).toHaveLength(1);
    expect(ref.current?.isFilterActive()).toBe(true);
    expect(mockFilterChangedCallback).toHaveBeenCalledTimes(1);
  });

  it('single selection mode only allows single item to be selected', async () => {
    const { filter, ref, checkBoxes } = await getSelectionFilter(selectableItems, false);
    checkBoxes[0].click();
    checkBoxes[1].click();
    filter.getByTestId(selectionFilterTestIds.apply).click();
    expect(ref.current?.getModel()?.selectedItems).toHaveLength(1);
  });

  it('multiple selection mode allows multple items to be selected', async () => {
    const { filter, ref, checkBoxes } = await getSelectionFilter(selectableItems, true);
    checkBoxes[0].click();
    checkBoxes[2].click();
    filter.getByTestId(selectionFilterTestIds.apply).click();
    expect(ref.current?.getModel()?.selectedItems).toHaveLength(2);
  });

  it('unselect removes item from selection list', async () => {
    const { filter, ref, checkBoxes } = await getSelectionFilter(selectableItems, true);
    checkBoxes[0].click();
    checkBoxes[2].click();
    checkBoxes[2].click();
    filter.getByTestId(selectionFilterTestIds.apply).click();
    expect(ref.current?.getModel()?.selectedItems).toHaveLength(1);
    expect(ref.current?.isFilterActive()).toBe(true);
  });

  it('unselect all makes FilterActive return false', async () => {
    const { filter, ref, checkBoxes } = await getSelectionFilter(selectableItems, true);
    checkBoxes[0].click();
    checkBoxes[2].click();
    checkBoxes[2].click();
    checkBoxes[0].click();
    filter.getByTestId(selectionFilterTestIds.apply).click();
    expect(ref.current?.isFilterActive()).toBe(false);
  });

  it('after hitting reset filter - is FilterActive returns false', async () => {
    const { filter, ref, checkBoxes } = await getSelectionFilter(selectableItems, true);
    checkBoxes[0].click();
    filter.getByTestId(selectionFilterTestIds.reset).click();
    expect(ref.current?.getModel()).toBeFalsy();
    expect(ref.current?.isFilterActive()).toBe(false);
  });
});
