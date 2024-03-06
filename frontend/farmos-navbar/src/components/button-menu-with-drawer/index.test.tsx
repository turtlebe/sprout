import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { FarmOsModules } from '../../config/farmos-modules';

import { ButtonMenuWithDrawer, dataTestIds } from '.';

describe('ButtonMenuWithDrawer', () => {
  it('renders farmOsModules', () => {
    const { getByTestId, queryAllByTestId } = render(
      <MemoryRouter>
        <ButtonMenuWithDrawer farmOsModules={FarmOsModules} />
      </MemoryRouter>
    );

    // drawer is empty
    expect(queryAllByTestId(dataTestIds.listItem)).toHaveLength(0);

    // open drawer
    getByTestId(dataTestIds.root).click();

    // drawer is present and full
    expect(queryAllByTestId(dataTestIds.listItem)).toHaveLength(FarmOsModules.length);
    expect(FarmOsModules).not.toHaveLength(0);
  });

  it('renders farmOsModules with an active link', () => {
    const { getByTestId, queryByLabelText } = render(
      <MemoryRouter initialEntries={['/quality']}>
        <ButtonMenuWithDrawer farmOsModules={FarmOsModules} />
      </MemoryRouter>
    );

    // open drawer
    getByTestId(dataTestIds.root).click();

    expect(queryByLabelText('Quality')).toBeTruthy();
    expect(queryByLabelText('Quality')?.className).toContain('activeClassName');
  });
});
