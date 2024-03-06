# farmos-navbar

Material UI navbar component used in Hypocotyl and Sprout.

## Installation

```
yarn add @plentyag/farmos-navbar
```

## Dependencies

When installing `farmos-navbar`, the host application needs to have `react` and `react-router-dom`.

## Usage

See [AppBar](src/components/app-bar/index.tsx#L34) for properties that you can pass to `<AppBar>`

```
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppBar } from '@plentyag/farmos-navbar';


const YourComponent = () => (
  <BrowserRouter>
    <AppBar farmOsModules={farmOsModules} reactAppHostName="sprout" />
  </BrowserRouter>
);
```

`farmos-navbar` comes with a buil-in full-screen layout, here's an example on how to use it:

```
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppContainer, AppHeader, AppBody } from '@plentyag/farmos-navbar';

const YourComponent = () => (
  <BrowserRouter>
    <AppContainer>
      <AppHeader farmOsModules={farmOsModules} reactAppHostName="sprout" />
      <AppBody>
        {* content of your application *}
      </AppBody>
    </AppContainer>
  </BrowserRouter>
);
```

## Deployment

```
yarn deploy
```
