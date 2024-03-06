import Autocomplete, { AutocompleteProps as MuiAutocompleteProps } from '@material-ui/lab/Autocomplete';
import {
  isChildDeviceLocation,
  isContainerLocation,
  isDeviceLocation,
  isScheduleDefinition,
} from '@plentyag/core/src/farm-def/type-guards';
import {
  ChildDeviceLocation,
  ContainerLocation,
  DeviceLocation,
  Kind,
  ScheduleDefinition,
} from '@plentyag/core/src/farm-def/types';
import { isSchedule } from '@plentyag/core/src/types/environment/type-guards';
import { uuidv4 } from '@plentyag/core/src/utils/uuidv4';
import React from 'react';

import {
  AutocompleteOption,
  AutocompleteTextField,
  dataTestIdsAutocompleteTextField,
  dataTestIdsListboxComponent,
  dataTestIdsListboxHeader,
  ListboxComponentFactory,
  NoOptions,
} from './components';
import {
  AllowedObjects,
  useAutocompleteFarmDefObjectStore,
  useCountMaps,
  useLoadFarmDefObjectWithInitialPath,
  useLoadFarmDefObjectWithInputValue,
  useLoadFarmDefObjectWithSelectedOption,
  useLoadFarmDefSites,
  useLoadObservationGroups,
  useLoadSchedules,
  useResetSelectionWhenPathNotAllowed,
  useUpdateStoreWhenInitialPathChanges,
} from './hooks';
import { useStyles } from './styles';
import {
  filterOptionWithShortenedPath,
  getFarmCode,
  getFarmDefPath,
  getGroupName,
  getShortenedPathFromObject,
  hasChildDeviceLocations,
  hasDeviceLocations,
  hasObservations,
  hasScheduleDefinitions,
  isChildOrParentPath,
  isPathEquals,
  sortByWithContainerLocations,
  sortByWithType,
} from './utils';

export type { AllowedObjects } from './hooks';

const dataTestIds = {
  ...dataTestIdsAutocompleteTextField,
  ...dataTestIdsListboxComponent,
  ...dataTestIdsListboxHeader,
};

export { dataTestIds as dataTestIdsAutocompleteTextField };

export interface AutocompleteFarmDefObject {
  closeWhenSelectingKinds?: (
    | Kind
    | DeviceLocation['kind']
    | ChildDeviceLocation['kind']
    | ContainerLocation['kind']
    | ScheduleDefinition['kind']
  )[];
  disabled?: boolean;
  error?: string;
  id?: string;
  initialPath?: string;
  allowedPaths?: string[];
  label?: string;
  onChange?: (farmDefObject: AllowedObjects, farmCode?: string) => void;
  onBlur?: (event) => void;
  onClear?: () => void;
  showContainerLocations?: boolean;
  showDeviceLocations?: boolean;
  showScheduleDefinitions?: boolean;
  showScheduleDefinitionParents?: boolean;
  deviceTypes?: string[];
  showObservationStats?: boolean;
  compatibleScheduleDefinition?: ScheduleDefinition;
  isLoading?: boolean;
  resolveScheduleDefinition?: boolean;
}

export type AutocompleteProps = MuiAutocompleteProps<AllowedObjects, false, true, false>;

export const AutocompleteFarmDefObject: React.FC<AutocompleteFarmDefObject> = ({
  label,
  closeWhenSelectingKinds = ['machineZone'],
  disabled,
  error,
  id: _id,
  initialPath = '',
  allowedPaths,
  onBlur = () => {},
  onChange = () => {},
  onClear = () => {},
  showContainerLocations = false,
  showDeviceLocations = false,
  showScheduleDefinitions = false,
  showScheduleDefinitionParents = false,
  showObservationStats = false,
  deviceTypes,
  compatibleScheduleDefinition,
  resolveScheduleDefinition,
}) => {
  const classes = useStyles({});
  const [id] = React.useState<string>(_id ?? `autocomplete-farm-def-object:${uuidv4()}`);
  const [hasChanged, setHasChanged] = React.useState<boolean>(false);
  const [state, actions] = useAutocompleteFarmDefObjectStore(id);
  const requests = {
    loadFarmDefSites: useLoadFarmDefSites(id),
    loadFarmDefObjectWithSelectedOption: useLoadFarmDefObjectWithSelectedOption(id),
    loadFarmDefObjectWithInitialPath: useLoadFarmDefObjectWithInitialPath(id, initialPath),
    loadFarmDefObjectWithInputValue: useLoadFarmDefObjectWithInputValue(id),
    loadObservationGroups: useLoadObservationGroups(id, showObservationStats),
    loadSchedules: useLoadSchedules(id, resolveScheduleDefinition),
  };
  useCountMaps(id, deviceTypes, compatibleScheduleDefinition);
  useUpdateStoreWhenInitialPathChanges(id, initialPath);
  useResetSelectionWhenPathNotAllowed(id, initialPath, allowedPaths);

  React.useEffect(() => {
    actions.setOptions({
      showContainerLocations,
      showDeviceLocations,
      showScheduleDefinitions,
      showScheduleDefinitionParents,
      showObservationStats,
      deviceTypes,
      compatibleScheduleDefinition,
      resolveScheduleDefinition,
    });
  }, [
    showContainerLocations,
    showDeviceLocations,
    showScheduleDefinitions,
    showScheduleDefinitionParents,
    showObservationStats,
    deviceTypes,
    compatibleScheduleDefinition,
    resolveScheduleDefinition,
  ]);

  const isLoading =
    requests.loadFarmDefSites.isValidating ||
    requests.loadFarmDefObjectWithSelectedOption.isValidating ||
    requests.loadFarmDefObjectWithInitialPath.isValidating ||
    requests.loadFarmDefObjectWithInputValue.isValidating ||
    requests.loadObservationGroups.isLoading ||
    requests.loadSchedules.isValidating;

  // Handlers
  const handleChange: AutocompleteProps['onChange'] = (event, entity, reason) => {
    setHasChanged(true);
    if (reason === 'clear') {
      actions.setSelectedFarmDefObject(null);
      actions.setInputvalue('');
      actions.setIsOpen(false);
      onClear();
      return;
    }
    actions.setSelectedFarmDefObject(entity);
    actions.setInputvalue(getShortenedPathFromObject(entity));

    if (isSchedule(entity) || closeWhenSelectingKinds.includes(entity.kind)) {
      actions.setIsOpen(false);
    }
  };
  const handleClose: AutocompleteProps['onClose'] = () => actions.setIsOpen(false);
  const handleOpen: AutocompleteProps['onOpen'] = () => actions.setIsOpen(true);
  const handleInputChange: AutocompleteProps['onInputChange'] = (event, value, reason) => {
    setHasChanged(true);
    if (reason === 'input') {
      if (getShortenedPathFromObject(state.selectedFarmDefObject) === value + '/') {
        actions.goBackToParent();
        return;
      }
      if (value.endsWith('/')) {
        const newSelectedFarmDefObject = state.farmDefObjects.find(
          isPathEquals(getFarmDefPath(value), { caseSensitive: false })
        );
        if (newSelectedFarmDefObject) {
          actions.setSelectedFarmDefObject(newSelectedFarmDefObject);
        }
      }
      actions.setInputvalue(value);
    }
    if (reason === 'reset') {
      if (state.selectedFarmDefObject) {
        actions.setInputvalue(getShortenedPathFromObject(state.selectedFarmDefObject));
      } else {
        onClear();
        actions.setInputvalue('');
      }
    }
  };

  // Does all the magic of showing the right options
  const filterOptions: AutocompleteProps['filterOptions'] = options => {
    const filteredOptions = options.filter(option => {
      if (option === state.selectedFarmDefObject) {
        return false;
      }

      if (isSchedule(option)) {
        return isScheduleDefinition(state.selectedFarmDefObject) && state.selectedFarmDefObject.path === option.path;
      }

      if (allowedPaths && !isChildOrParentPath(allowedPaths, option.path)) {
        return false;
      }

      if (!showDeviceLocations && (isDeviceLocation(option) || isChildDeviceLocation(option))) {
        return false;
      }

      if (!showContainerLocations && isContainerLocation(option)) {
        return false;
      }

      if (!showScheduleDefinitions && isScheduleDefinition(option)) {
        return false;
      }

      if (
        !isSchedule(state.selectedFarmDefObject) &&
        closeWhenSelectingKinds.includes(state.selectedFarmDefObject?.kind)
      ) {
        return false;
      }

      if (!filterOptionWithShortenedPath(state.inputValue, option)) {
        return false;
      }

      if (showDeviceLocations) {
        return hasDeviceLocations(option, state, deviceTypes) || hasChildDeviceLocations(option, state, deviceTypes);
      }

      if (showScheduleDefinitions || showScheduleDefinitionParents) {
        return hasScheduleDefinitions(option, state);
      }

      if (showObservationStats) {
        return hasObservations(option, state);
      }

      return true;
    });

    if (showDeviceLocations) {
      return filteredOptions.sort(sortByWithType(isDeviceLocation));
    }

    if (showContainerLocations) {
      return filteredOptions.sort(sortByWithContainerLocations);
    }

    if (showScheduleDefinitions || showScheduleDefinitionParents) {
      return filteredOptions.sort(sortByWithType(isScheduleDefinition));
    }

    return filteredOptions.sort((a, b) => a.path.localeCompare(b.path));
  };

  React.useEffect(() => {
    // If handleChange hasn't been called and value is still null. Do not call onChange.
    if (!hasChanged && state.selectedFarmDefObject === null) {
      return;
    }

    const farmCode = getFarmCode(state.selectedFarmDefObject, state.farmDefObjects);

    onChange(state.selectedFarmDefObject, farmCode);
  }, [hasChanged, state.selectedFarmDefObject]);

  React.useEffect(() => {
    return () => {
      actions.unregisterState();
    };
  }, []);

  return (
    <Autocomplete<AllowedObjects, false, true, false>
      autoHighlight={true}
      disableCloseOnSelect={true}
      classes={{ noOptions: classes.noOptions }}
      disabled={disabled}
      filterOptions={filterOptions}
      getOptionLabel={farmDefObject =>
        isSchedule(farmDefObject)
          ? `Schedule: ${getShortenedPathFromObject(farmDefObject)}`
          : getShortenedPathFromObject(farmDefObject)
      }
      groupBy={getGroupName}
      id={id}
      data-testid={id}
      ListboxComponent={ListboxComponentFactory(id)}
      loading={Boolean(isLoading)}
      noOptionsText={<NoOptions id={id} />}
      onChange={handleChange}
      onClose={handleClose}
      onInputChange={handleInputChange}
      onOpen={handleOpen}
      onBlur={onBlur}
      open={state.isOpen}
      options={state.farmDefObjects}
      renderInput={params => (
        <AutocompleteTextField id={id} error={error} label={label} isLoading={isLoading} {...params} />
      )}
      renderOption={option => (
        <AutocompleteOption
          id={id}
          showDeviceLocations={showDeviceLocations}
          showScheduleDefinitions={showScheduleDefinitions}
          showScheduleDefinitionParents={showScheduleDefinitionParents}
          treeObservationGroups={showObservationStats && state.treeObservationGroups}
          option={option}
        />
      )}
      value={state.selectedFarmDefObject}
    />
  );
};
