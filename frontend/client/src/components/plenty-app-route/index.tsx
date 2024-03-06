import { lazyWithRetry } from '@plentyag/core/src/utils/lazy-with-retry';
import React from 'react';
import { Route, RouteProps } from 'react-router';
import { camelCase, capitalize } from 'voca';

export interface PlentyAppRoute extends RouteProps {
  name: string;
}

// static map holding all app components, indexed by moduleName (ex: ApiDocs, Environment, Production)
const components = new Map<string, React.ComponentType<any>>();

/**
 * This component dynamically loads a sprout application with given "name" and matching route "path".
 * All sprout apps should exist in directory with prefix: "app-". The app will be loaded from
 * the directory matching the given "name" (ex: for "app-lab-testing", name should be "lab-testing").
 * The dynamically loaded app component name must be capitalized camel-case (ex: LabTesting).
 * Note: the loaded components are cached in a map - otherwise React.lazy causes a new component to
 * be created and re-mounted with each call.
 */
export const PlentyAppRoute: React.FC<PlentyAppRoute> = ({ name, ...routeProps }) => {
  let component = components.get(name);
  if (!component) {
    const componentName = capitalize(camelCase(name));
    component = lazyWithRetry(async () =>
      import(`@plentyag/app-${name}/src`).then(module => ({
        default: module[componentName],
      }))
    );
    components.set(name, component);
  }
  return <Route {...routeProps} component={component} />;
};
