import React from 'react';

import { makeOptions, renderFormGenInput, renderFormGenInputAsync } from '../test-helpers';

import { ReactComponent } from '.';

const MockReactComponent: React.FC<FormGen.FieldProps<FormGen.FieldReactComponent>> = () => {
  return <span data-testid="mock-react-component">MockReactComponent</span>;
};

const options = makeOptions({ formGenField: { component: MockReactComponent } });

describe('ReactComponent', () => {
  it('renders a custom component', () => {
    const [{ getByTestId, container }] = renderFormGenInput(ReactComponent, options());

    expect(getByTestId('mock-react-component')).toBeInTheDocument();
    expect(container.querySelector('p')).not.toBeInTheDocument();
  });

  it('renders with an error within the FormGen wrapper', async () => {
    const [{ container }] = await renderFormGenInputAsync(ReactComponent, options({ validateOnMount: true }));

    expect(container.querySelector('p').classList).toContain('Mui-error');
  });

  it('allows a className attribute within the FormGen wrapper', async () => {
    const [{ container }] = await renderFormGenInputAsync(ReactComponent, options({ className: 'mock-class-name' }));

    expect(container.querySelector('div').classList).toContain('mock-class-name');
  });
});
