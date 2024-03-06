import { IFloatingFilter, IFloatingFilterParams } from '@ag-grid-community/all-modules';
import React from 'react';

import { convertAgGridDateTimeToDate } from '../../../utils';

interface State {
  currentValue: string;
}

export class DateReadonlyFloatingFilter
  extends React.Component<IFloatingFilterParams, State>
  implements IFloatingFilter
{
  public constructor(props: IFloatingFilterParams) {
    super(props);

    this.state = {
      currentValue: '',
    };
  }

  public onParentModelChanged(parentModel: LT.DateFilterModel) {
    if (parentModel) {
      if (parentModel.type === 'greaterThanOrEqual') {
        this.setState({
          currentValue: convertAgGridDateTimeToDate(parentModel.dateFrom),
        });
      } else if (parentModel.type === 'inRange') {
        this.setState({
          currentValue: `${convertAgGridDateTimeToDate(parentModel.dateFrom)} - ${convertAgGridDateTimeToDate(
            parentModel.dateTo
          )}`,
        });
      }
    } else {
      this.setState({
        currentValue: '',
      });
    }
  }

  public render() {
    return (
      <div style={{ height: '100%' }} className={'ag-input-wrapper'}>
        <input disabled className={'ag-floating-filter-input'} value={this.state.currentValue} />
      </div>
    );
  }
}
