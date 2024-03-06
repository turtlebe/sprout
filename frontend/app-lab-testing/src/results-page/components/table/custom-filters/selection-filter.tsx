import { IDoesFilterPassParams, IFilter, IFilterParams, RowNode } from '@ag-grid-community/all-modules';
import { orderBy, uniqBy } from 'lodash';
import React from 'react';

export const selectionFilterTestIds = {
  checkbox: 'check-box',
  reset: 'reset-button',
  apply: 'apply-button',
};

interface State {
  selectedItems: LT.SelectableItem[]; // selected items but might not be applied yet.
  areItemsApplied: boolean; // true if selected items > 0 and apply button hit or setModel called.
}

interface ISelectionFilterParams extends IFilterParams {
  selectableItems: LT.SelectableItem[]; // items that will appear in checkbox list.
  multiple?: boolean; // if true will allow multi-selection.
}

/**
 * Custom ag-grid filter that allow user to select filter values from checkbox list.
 */
export class SelectionFilter extends React.Component<ISelectionFilterParams, State> implements IFilter {
  public constructor(props: ISelectionFilterParams) {
    super(props);
    this.state = {
      selectedItems: [],
      areItemsApplied: false,
    };

    this.valueGetter = this.props.valueGetter;

    // order the selected items and make sure they are unique.
    this.selectableItems = orderBy<LT.SelectableItem>(uniqBy<LT.SelectableItem>(props.selectableItems, 'name'), 'name');

    this.multiple = props.multiple || false;
  }

  private readonly valueGetter: (rowNode: RowNode) => any;
  private readonly selectableItems: LT.SelectableItem[];
  private readonly multiple: boolean;

  /** start: IFilter */
  public isFilterActive() {
    return this.state.areItemsApplied && !!this.state.selectedItems.length;
  }

  public doesFilterPass(params: IDoesFilterPassParams) {
    return (
      this.state.areItemsApplied &&
      !!this.state.selectedItems.length &&
      this.state.selectedItems.includes(this.valueGetter(params.node))
    );
  }

  public getModel(): LT.SelectionFilterModel | undefined {
    if (this.state.areItemsApplied && this.state.selectedItems.length) {
      return { filterType: 'selection', selectedItems: this.state.selectedItems };
    }
  }

  public setModel(model: LT.SelectionFilterModel) {
    let newState: State;
    if (model && model.filterType === 'selection' && Array.isArray(model.selectedItems)) {
      const firstFoundItem = model.selectedItems.find(item => item);
      const selectedItems = this.multiple ? model.selectedItems : firstFoundItem ? [firstFoundItem] : [];
      newState = { selectedItems, areItemsApplied: true };
    } else {
      newState = { selectedItems: [], areItemsApplied: false };
    }
    // ag-grid example only calls this.state but that is not kosher react as you shouldn't mutate state.
    // https://www.ag-grid.com/javascript-grid-filter-component/#example-filtering-using-react-components
    // but problem is when setModel is called (e.g., during 'reset grid all') then immediately getModel
    // is called but effect of setState (which is async) might not have occurred yet.
    this.state = newState;
    this.setState(newState);
  }

  public getModelAsString() {
    return this.state.selectedItems.length ? this.state.selectedItems.map(item => item.name).join(',') : '';
  }
  /** end: IFilter */

  public render() {
    const checkBoxes = this.selectableItems.map(item => {
      const isSelected = this.state.selectedItems.some(selectedItem => selectedItem.name === item.name);
      return (
        <div key={item.name}>
          <input
            data-testid={selectionFilterTestIds.checkbox}
            type="checkbox"
            id={item.name}
            name={item.name}
            value={item.value}
            checked={isSelected}
            onChange={this.onSelect}
          />
          <label htmlFor={item.name}>{item.name}</label>
        </div>
      );
    });
    return (
      <div className="ag-filter-body-wrapper">
        <div className="ag-filter-body-wrapper ag-simple-filter-body-wrapper">
          {this.multiple ? <div>Select one or more items:</div> : <div>Select one item:</div>}
          <div style={{ maxHeight: '310px', overflow: 'auto' }}>{checkBoxes}</div>
        </div>
        <div className="ag-filter-apply-panel">
          <button
            className="ag-standard-button ag-filter-apply-panel-button"
            data-testid={selectionFilterTestIds.reset}
            onClick={this.resetFilter}
          >
            Reset Filter
          </button>
          <button
            className="ag-standard-button ag-filter-apply-panel-button"
            data-testid={selectionFilterTestIds.apply}
            onClick={this.applyChange}
          >
            Apply Filter
          </button>
        </div>
      </div>
    );
  }

  private readonly resetFilter = () => {
    this.setState({ selectedItems: [], areItemsApplied: false }, () => this.props.filterChangedCallback());
  };

  private readonly onSelect = event => {
    const selectedName = event.target.name;
    let newItems = this.state.selectedItems;
    if (event.target.checked) {
      // add
      const newItem = this.selectableItems.find(item => item.name === selectedName);
      if (this.multiple) {
        if (newItem && !this.state.selectedItems.some(item => item.name === selectedName)) {
          newItems.push(newItem);
        }
      } else if (newItem) {
        newItems = [newItem];
      }
    } else {
      // remove
      newItems = this.state.selectedItems.filter(item => item.name !== selectedName);
    }
    this.setState({
      selectedItems: newItems,
      areItemsApplied: false,
    });
  };

  private readonly applyChange = () => {
    const areItemsApplied = this.state.selectedItems.length > 0;
    this.setState({ selectedItems: this.state.selectedItems, areItemsApplied }, () =>
      this.props.filterChangedCallback()
    );
  };
}
