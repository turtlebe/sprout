import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { MemoryRouter, Router } from 'react-router-dom';

import { AppBarContext } from '../app-bar/context';

import { dataTestIds, LinkFarmOsModule } from '.';

const defaultFarmOsModule: FarmOsModule = {
  label: 'Admin',
  resource: 'HYP_ADMIN',
  url: '/admin',
  backend: 'hypocotyl',
  react: false,
};

describe('LinkFarmOsModule', () => {
  describe('when using <NavLink>', () => {
    let reactAppHostName: string;

    beforeEach(() => {
      defaultFarmOsModule.react = true;
      defaultFarmOsModule.backend = 'sprout';
      reactAppHostName = 'sprout';
    });

    it('routes with react-router-dom', () => {
      const history = createMemoryHistory();

      const { getByTestId } = render(
        <Router history={history}>
          <AppBarContext.Provider value={{ reactAppHostName }}>
            <LinkFarmOsModule farmOsModule={{ ...defaultFarmOsModule }} />
          </AppBarContext.Provider>
        </Router>
      );

      expect(history).toHaveLength(1);
      getByTestId(dataTestIds.root).click();
      expect(history).toHaveLength(2);
    });

    it('provides a callback upon redirection', () => {
      const onClick = jest.fn();

      const { getByTestId } = render(
        <MemoryRouter>
          <AppBarContext.Provider value={{ reactAppHostName }}>
            <LinkFarmOsModule farmOsModule={{ ...defaultFarmOsModule }} onClick={onClick} />
          </AppBarContext.Provider>
        </MemoryRouter>
      );

      getByTestId(dataTestIds.root).click();
      expect(onClick).toHaveBeenCalled();
    });

    it('renders an INACTIVE link by default', () => {
      const { getByTestId } = render(
        <MemoryRouter>
          <AppBarContext.Provider value={{ reactAppHostName }}>
            <LinkFarmOsModule farmOsModule={{ ...defaultFarmOsModule, url: '/perception' }} />
          </AppBarContext.Provider>
        </MemoryRouter>
      );

      expect(getByTestId(dataTestIds.root).className).not.toContain('activeClassName');
    });

    it('renders an INACTIVE link when hostCurrentLocation is different than the module', () => {
      const { getByTestId } = render(
        <MemoryRouter>
          <AppBarContext.Provider value={{ reactAppHostName, hostCurrentLocation: '/lab-testing' }}>
            <LinkFarmOsModule farmOsModule={{ ...defaultFarmOsModule, url: '/perception' }} />
          </AppBarContext.Provider>
        </MemoryRouter>
      );

      expect(getByTestId(dataTestIds.root).className).not.toContain('activeClassName');
    });

    it('renders an ACTIVE link when hostCurrentLocation matches the farmOsModule URL', () => {
      const { getByTestId } = render(
        <MemoryRouter>
          <AppBarContext.Provider value={{ reactAppHostName, hostCurrentLocation: '/perception' }}>
            <LinkFarmOsModule farmOsModule={{ ...defaultFarmOsModule, url: '/perception' }} />
          </AppBarContext.Provider>
        </MemoryRouter>
      );

      expect(getByTestId(dataTestIds.root).className).toContain('activeClassName');
    });

    it('renders an ACTIVE link when the router matches the farmOsModule URL', () => {
      const { getByTestId } = render(
        <MemoryRouter initialEntries={['/perception']}>
          <AppBarContext.Provider value={{ reactAppHostName }}>
            <LinkFarmOsModule farmOsModule={{ ...defaultFarmOsModule, url: '/perception' }} />
          </AppBarContext.Provider>
        </MemoryRouter>
      );

      expect(getByTestId(dataTestIds.root).className).toContain('activeClassName');
    });

    it('renders an ACTIVE link when the router is right with nested routes', () => {
      const { getByTestId } = render(
        <MemoryRouter initialEntries={['/perception/create']}>
          <AppBarContext.Provider value={{ reactAppHostName }}>
            <LinkFarmOsModule farmOsModule={{ ...defaultFarmOsModule, url: '/perception' }} />
          </AppBarContext.Provider>
        </MemoryRouter>
      );

      expect(getByTestId(dataTestIds.root).className).toContain('activeClassName');
    });

    it('does not become ACTIVE if the path does not match', () => {
      const { getByTestId } = render(
        <MemoryRouter initialEntries={['/per']}>
          <AppBarContext.Provider value={{ reactAppHostName }}>
            <LinkFarmOsModule farmOsModule={{ ...defaultFarmOsModule, url: '/perception' }} />
          </AppBarContext.Provider>
        </MemoryRouter>
      );

      expect(getByTestId(dataTestIds.root).className).not.toContain('activeClassName');
    });

    it('does not become ACTIVE if sub-path matches url', () => {
      const { getByTestId } = render(
        <MemoryRouter initialEntries={['/production/resources/info']}>
          <AppBarContext.Provider value={{ reactAppHostName }}>
            <LinkFarmOsModule farmOsModule={{ ...defaultFarmOsModule, url: '/resources' }} />
          </AppBarContext.Provider>
        </MemoryRouter>
      );

      expect(getByTestId(dataTestIds.root).className).not.toContain('activeClassName');
    });
  });

  describe('when using <A>', () => {
    let reactAppHostName: string;

    beforeEach(() => {
      defaultFarmOsModule.react = false;
      defaultFarmOsModule.backend = 'hypocotyl';
      reactAppHostName = 'sprout';
    });

    it('renders an INACTIVE link by default', () => {
      const { getByTestId } = render(
        <MemoryRouter>
          <AppBarContext.Provider value={{ reactAppHostName }}>
            <LinkFarmOsModule farmOsModule={{ ...defaultFarmOsModule, url: '/perception' }} />
          </AppBarContext.Provider>
        </MemoryRouter>
      );

      expect(getByTestId(dataTestIds.root).className).not.toContain('activeClassName');
    });

    it('renders an INACTIVE link when hostCurrentLocation is different than the module', () => {
      const { getByTestId } = render(
        <MemoryRouter>
          <AppBarContext.Provider value={{ reactAppHostName, hostCurrentLocation: '/lab-testing' }}>
            <LinkFarmOsModule farmOsModule={{ ...defaultFarmOsModule, url: '/perception' }} />
          </AppBarContext.Provider>
        </MemoryRouter>
      );

      expect(getByTestId(dataTestIds.root).className).not.toContain('activeClassName');
    });

    it('renders an ACTIVE link when hostCurrentLocation matches the farmOsModule URL', () => {
      const { getByTestId } = render(
        <MemoryRouter>
          <AppBarContext.Provider value={{ reactAppHostName, hostCurrentLocation: '/perception' }}>
            <LinkFarmOsModule farmOsModule={{ ...defaultFarmOsModule, url: '/perception' }} />
          </AppBarContext.Provider>
        </MemoryRouter>
      );

      expect(getByTestId(dataTestIds.root).className).toContain('activeClassName');
    });

    it('renders an ACTIVE link when the router matches the farmOsModule URL', () => {
      const { getByTestId } = render(
        <MemoryRouter initialEntries={['/perception']}>
          <AppBarContext.Provider value={{ reactAppHostName }}>
            <LinkFarmOsModule farmOsModule={{ ...defaultFarmOsModule, url: '/perception' }} />
          </AppBarContext.Provider>
        </MemoryRouter>
      );

      expect(getByTestId(dataTestIds.root).className).toContain('activeClassName');
    });
  });
});
