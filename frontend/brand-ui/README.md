# @plentyag/brand-ui

This package contains custom and re-usable in house components and @material-ui overrides.

## Definitions

### What is a custom, re-usable in house components?

> A component that has enough complex logic and needs to be re-used across many places in our apps.

#### Examples of custom components:

- farm-def
- form-gen

### What is a material-ui override?

> A component that customize the look and feel of `@material-ui` but doesn't add any complexity, nor change the way it was intended to be used.
>
> Example:, We want our `<Button>` to have a blue font color instead of the default black. That's a good use-case for having a `@material-ui` override component.

#### Examples of @material-ui overrides:

- material-ui/core
- material-ui/pickers

## Using and importing @material-ui/core and @material-ui/pickers components:

When you need something from `@material-ui/core` or `@material-ui/pickers`, use the following:

```javascript
import { Button } from `@plentyag/brand-ui/src/material-ui/core`
// or
import { DatePicker } from `@plentyag/brand-ui/src/material-ui/pickers`
```

> In [src/material-ui/core/index.ts](./src/material-ui/core/index.ts) everything from `@material-ui/core` is re-exported in addition our `@material-ui` overrides.
> This gives you access to anything from `@material-ui/core` and also our overrides.

### Exceptions:

- When developping an override component, you should import from `@material-ui/core` directly to avoid cyclic dependencies.
- When the component is not exported by default in `@material-ui/core`:

<details>
<sumamry>For example:</summary>

```javascript
// this is not possible
import { OverridableComponent } from '@material-ui/core';

// you have to specify the full path and import this way:
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
1;
```

That's a valid reason for using importing from `@material-ui/core` directly, although you could consider taking advantage of `@plentyag/brand-ui/src/material-ui/core` to do this for you.

</details>

## Sidenote

This concept it enforced through ESLint, you'll get a linting error if you try to import from `@material-ui/core` or `@material-ui/pickers`.
