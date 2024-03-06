import { IFloatingFilter, IFloatingFilterParams } from '@ag-grid-community/all-modules';
import React from 'react';

interface State {
  currentValue: string;
}

export class TextReadonlyFloatingFilter
  extends React.Component<IFloatingFilterParams, State>
  implements IFloatingFilter
{
  public constructor(props: IFloatingFilterParams) {
    super(props);

    this.state = {
      currentValue: '',
    };
  }

  public onParentModelChanged(parentModel: LT.TextFilterModel) {
    this.setState({
      currentValue: parentModel ? parentModel.filter : '',
    });
  }

  public render() {
    return (
      <div style={{ height: '100%' }} className={'ag-input-wrapper'}>
        <input disabled className={'ag-floating-filter-input'} value={this.state.currentValue} />
      </div>
    );
  }
}
