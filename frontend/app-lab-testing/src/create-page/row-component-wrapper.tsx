import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';
import { FieldArrayRenderProps } from 'formik';
import React from 'react';

import { MoreVertMenu } from './more-vert';
import { RowComponent, RowData } from './row-component';
import { getId } from './utils/get-id';

interface Props {
  arrayHelpers: FieldArrayRenderProps;
  totalItems: number;
  rowData: RowData;
  isEdit: boolean;
}
const useStyles = makeStyles(theme => ({
  labTestWrapper: {
    margin: theme.spacing(1, 0),
    display: 'flex',
  },
}));

export const RowComponentWrapper = React.memo<Props>(({ arrayHelpers, totalItems, rowData, isEdit }) => {
  const classes = useStyles({});

  const onSelectOption = React.useCallback(
    optionSelected => {
      if (optionSelected === 'Delete') {
        arrayHelpers.remove(rowData.index);
      } else if (optionSelected === 'Duplicate') {
        const dupItem = { ...rowData.item };
        dupItem.id = getId();
        dupItem.providerSampleId = '';
        arrayHelpers.insert(rowData.index + 1, dupItem);
      }
    },
    [rowData.index, rowData.item]
  );

  const memoizedOptions = React.useMemo(() => {
    const menuOptions = ['Duplicate'];
    if (totalItems > 1) {
      menuOptions.push('Delete');
    }
    return menuOptions;
  }, [totalItems]);

  function handleRowComponentWrapperScrollScroll(event: React.UIEvent<HTMLElement>) {
    // stop scroll propagation so parent doesn't receive scroll events
    event.stopPropagation();
  }

  return (
    <>
      <div onScroll={handleRowComponentWrapperScrollScroll} className={classes.labTestWrapper}>
        <MoreVertMenu options={memoizedOptions} onSelectOption={onSelectOption} isEdit={isEdit} />
        <RowComponent rowData={rowData} isEdit={isEdit} />
      </div>
    </>
  );
});
