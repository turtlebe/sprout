import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsDialogFormGenTooltip as dataTestIds, DialogFormGenTooltip } from '.';

const formGenField: FormGen.FieldTextField = {
  type: 'TextField',
  name: 'name',
  label: 'Label',
};
const formikProps = {} as unknown as FormikProps<unknown>;
const onClose = jest.fn();
const title = 'Title';
const content = 'Content';

describe('CustomDialog', () => {
  it('renders an opened Dialog', () => {
    const { queryByTestId } = render(
      <DialogFormGenTooltip
        title={title}
        formGenField={formGenField}
        formikProps={formikProps}
        open={true}
        onClose={onClose}
      >
        {content}
      </DialogFormGenTooltip>
    );

    expect(queryByTestId(dataTestIds.root)).toBeVisible();
    expect(queryByTestId(dataTestIds.title)).toHaveTextContent(title);
    expect(queryByTestId(dataTestIds.content)).toHaveTextContent(content);
    queryByTestId(dataTestIds.close).click();
    expect(onClose).toHaveBeenCalled();
  });

  it('renders a closed Dialog', () => {
    const { queryByTestId } = render(
      <DialogFormGenTooltip
        title={title}
        formGenField={formGenField}
        formikProps={formikProps}
        open={false}
        onClose={onClose}
      >
        {content}
      </DialogFormGenTooltip>
    );

    expect(queryByTestId(dataTestIds.root)).not.toBeInTheDocument();
  });
});
