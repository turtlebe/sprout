import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIds, TooltipRenderer } from '.';

const MockComponent: React.FC = () => <div></div>;
const formikProps = {} as unknown as FormikProps<unknown>;

describe('TooltipRenderer', () => {
  it('does not render for a conditonal FormGen field', () => {
    const formGenField: FormGen.FieldIf = {
      if: () => true,
      fields: [
        {
          type: 'TextField',
          name: 'mockName',
          label: 'Mock Label',
          tooltip: MockComponent,
        },
      ],
    };

    const { queryByTestId } = render(<TooltipRenderer formGenField={formGenField} formikProps={formikProps} />);

    expect(queryByTestId(dataTestIds.root)).not.toBeInTheDocument();
  });

  it('renders a tooltip component on hover', () => {
    const assertFormGenField = jest.fn().mockImplementation((formGenField: FormGen.FieldTextField) => {
      expect(formGenField.type).toBe('TextField');
      expect(formGenField.name).toBe('mockName');
      expect(formGenField.label).toBe('Mock Label');
      expect(formGenField.tooltip).toBeInstanceOf(Function);
    });

    const MockTooltip: React.FC<FormGen.TooltipProps<FormGen.FieldTextField>> = props => {
      assertFormGenField(props.formGenField);

      return props.open ? <div data-testid="mock-tooltip">MockTooltip</div> : <></>;
    };
    const formGenField: FormGen.FieldTextField = {
      type: 'TextField',
      name: 'mockName',
      label: 'Mock Label',
      tooltip: MockTooltip,
    };

    const { getByTestId, queryByTestId } = render(
      <TooltipRenderer formGenField={formGenField} formikProps={formikProps} />
    );

    expect(getByTestId(dataTestIds.icon)).toBeVisible();
    expect(queryByTestId('mock-tooltip')).not.toBeInTheDocument();

    getByTestId(dataTestIds.icon).click();

    expect(queryByTestId('mock-tooltip')).toBeInTheDocument();
    expect(assertFormGenField).toHaveBeenCalledTimes(2);
  });
});
