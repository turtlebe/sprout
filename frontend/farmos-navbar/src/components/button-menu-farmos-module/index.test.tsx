import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { FarmOsModules } from '../../config/farmos-modules';

import { ButtonMenuFarmOsModule, dataTestIds } from '.';

const farmOsModules = FarmOsModules.filter(farmOsModule =>
  ['HYP_API_DOCS', 'HYP_DATA_DOCS'].includes(farmOsModule.resource)
);

describe('ButtonMenuFarmOsModule', () => {
  it('renders a Button with a Menu grouping FarmOsModules', () => {
    const button = render(
      <MemoryRouter>
        <ButtonMenuFarmOsModule farmOsModules={farmOsModules} groupName={'Docs'} />
      </MemoryRouter>
    );

    expect(button.queryByTestId(dataTestIds.menu)).not.toBeInTheDocument();
    expect(button.getByTestId(dataTestIds.root)).toHaveTextContent('Docs');

    button.getByTestId(dataTestIds.root).click();

    expect(button.queryByTestId(dataTestIds.menu)).toBeVisible();
    expect(button.queryAllByTestId(dataTestIds.menuItem)).toHaveLength(2);
    expect(button.queryByLabelText('API Docs')).toBeTruthy();
    expect(button.queryByLabelText('API Docs')?.className).not.toContain('activeClassName');
    expect(button.queryByLabelText('Data Docs')).toBeTruthy();
    expect(button.queryByLabelText('Data Docs')?.className).not.toContain('activeClassName');
  });

  it('renders with active links in the menu', () => {
    const button = render(
      <MemoryRouter initialEntries={['/api-docs']}>
        <ButtonMenuFarmOsModule farmOsModules={farmOsModules} groupName={'Docs'} />
      </MemoryRouter>
    );

    button.getByTestId(dataTestIds.root).click();
    expect(button.queryByLabelText('API Docs')).toBeTruthy();
    expect(button.queryByLabelText('API Docs')?.className).toContain('activeClassName');
    expect(button.queryByLabelText('Data Docs')).toBeTruthy();
    expect(button.queryByLabelText('Data Docs')?.className).not.toContain('activeClassName');
  });
});
