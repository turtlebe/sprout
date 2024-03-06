# AutocompleteFarmDefObject

The `AutocompleteFarmDefObject` component allows to select FarmDef object or Device Location from [farm-def-service](https://github.com/PlentyAg/farm-def-service).

## Features

Here are a some of the current features:

- Allows the user to select a FarmDef Site and drill down into its descendants hierarchy.
- Upon selecting a FarmDef object, the FarmDef path of the object is shortened. Example: `sites/SSF2` becomes `SSF2/`.
- Allows navigation with the mouse, keyboard and also through typing in the Autocomplete's input.
- Deleting the trailing "/" navigates back in the hierarchy.
- Allows the user to keep typing after the trailing "/" to filter the current options.
- When available options have been filtered to one single option, adding a trailing "/" selects that object and refreshes
  the list of options with the next descendants of that object.
- When no descendants are available the dropdown shows "No options".
- When data is loading, a spinner appears in the input and a loading state in the dropdown.
- Allow for initializing the component to a specific FarmDef path.
- Support for pasting a FarmDef path or a shortened path (SSF2/BMP).
- Supports Device Locations. When enabled, the options also shows a count of how many device locations exist at a given level and below.
- Allow to restrict the user to select only certain objects.

## Pre-requisite

To understand better how this component works, we recommend being familiar with:

- [@material-ui's Autocomplete](https://material-ui.com/components/autocomplete/) component to do the heavy lifting of the UX.
- [swr](https://github.com/vercel/swr) Fetching and caching data
- [axios](https://github.com/axios/axios) Fetching data
- [useSwrAxios](https://github.com/PlentyAg/Sprout/tree/master/frontend/core/src/hooks/use-swr-axios) our own hook built on top of axios and swr
- [use-global-hook](https://github.com/andregardi/use-global-hook) State management

## Store

The store has a concept of shared partition and scoped partition for each `AutocompleteFarmDefObject` instance.

- The shared partition is used to store all FarmDef objects fetched.
- The scoped partition is used to store information about the current object selected, the input value, teh state of the dropdown (open/close) for a given instance of `AutocompleteFarmDefObject`.

When an `AutocompleteFarmDefObject` is created, it registers itself in the store with a new scoped partition. We use the ID of the autocomplete to scope the partition. IDs are uniquely generated if not passed as prop.

When an instance fetches data, the data will be stored in the shared partition.

## Data Lifecycle

All data is fetched with `useSwrAxios` hook.

When an instance of `AutocompleteFarmDefObjet` is created, we fetch all FarmDef sites from the backend. The backend will responds with all the sites without their descendants. Upon selecting a site, we fetch the site with all its descendant from the backend (We are forced to make two requests here).

When using the `AutocompleteFarmDefObjet` with `showDeviceLocations={true}` or `showScheduleDefinitions={true}`, fetching all descendants is especially important to to provide accurate information about Device Location and Schedule Definition count and help the user select a location seemlessly.

To fetch this data we use use `objects-v3-api/get-object-by-id` and `objects-v3-api/get-object-by-path` from `swagger` which corresponds to the V3 `ObjectsApi` in `farm-def-service`. For more information about those endpoints, refer to the FarmDef API docs.

### Resolving initialPath

When an instance is initiated with an `initialPath` prop, we resolve that path to load the state accurately. We extract the FarmDef site path out of the `initalPath` and load the site with all its descendant. All the descendant gets saved in the store. Finally we use the `initialPath` to select the correct FarmDef object from the store.

Note: when the path is incomplete, we do our best and try to find a valid ancestor.

For example, if the `initalPath` is `sites/SSF2/areas/BMP/Nor` (which doesn't exist) it selects `sites/SSF2/areas/BMP`.

### Resolving input value

The same logic is apply than in **Resolving initialPath** except that the inputValue gets converted to a FarmDef path as a first step. This use-case exists to support users pasting into the Autocomplete's input.

### Showing the right options

Once we have all FarmDef objects for a given site loaded into the store, we use `AutocompleteProps['filterOptions']` prop to show only the relevant options. We leverage the Autocomplete's input value which contained the shortened path to filters FarmDef object saved in the store. See [filter-option-with-shortened-path.ts](https://github.com/PlentyAg/Sprout/tree/master/frontend/brand-ui/src/components/autocomplete-farm-def-object/utils/filter-option-with-shortened-path.ts) and [filter-option-with-shortened-path.test.ts](https://github.com/PlentyAg/Sprout/tree/master/frontend/brand-ui/src/components/autocomplete-farm-def-object/utils/filter-option-with-shortened-path.test.ts) for more details.

## Folder Structure

- hooks: hooks around using the `AutocompletFarmDefObject` store as well as loading data.
- utils: utitiles functions to manipulate path, FarmDef objects and many other things throughout hooks, sub-components and the primary AutocompleteFarmDefObject React component.
- components: sub-React components used by primary AutocompleteFarmDefObject React component.
