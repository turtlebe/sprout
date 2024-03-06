import { changeTextField, chooseFromAutocompleteByIndex, openAutocomplete } from '@plentyag/brand-ui/src/test-helpers';
import { useSwrAxios } from '@plentyag/core/src/hooks/use-swr-axios';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import { AutocompleteFarmDefObject, dataTestIdsAutocompleteTextField as dataTestIds } from '.';

import { dataTestIdsListboxComponent } from './components/listbox-component-factory';
import { dataTestIdsListboxHeader } from './components/listbox-header';
import { mockUseSwrAxiosImpl, root } from './test-helpers';

jest.mock('@plentyag/core/src/hooks/use-swr-axios');

const mockUseSwrAxios = useSwrAxios as jest.Mock;

describe('AutocompleteFarmDefObject', () => {
  beforeEach(() => {
    mockUseSwrAxios.mockRestore();
  });

  it('renders with default props', () => {
    mockUseSwrAxios.mockReturnValue({});
    const { queryByTestId } = render(<AutocompleteFarmDefObject />);

    const label = queryByTestId(dataTestIds.textField).querySelector('label');
    const input = queryByTestId(dataTestIds.textField).querySelector('input');
    const helperText = queryByTestId(dataTestIds.textField).querySelector('p.MuiFormHelperText-root');

    expect(label).not.toBeInTheDocument();
    expect(input).toHaveAttribute('id');
    expect(input.getAttribute('id')).toContain('autocomplete-farm-def-object:');
    expect(helperText).not.toBeInTheDocument();
  });

  it('renders with custom props', () => {
    mockUseSwrAxios.mockReturnValue({});
    const { queryByTestId } = render(
      <AutocompleteFarmDefObject label="Farm Def Path" id="my-id" error="error-message" />
    );

    const label = queryByTestId(dataTestIds.textField).querySelector('label');
    const input = queryByTestId(dataTestIds.textField).querySelector('input');
    const helperText = queryByTestId(dataTestIds.textField).querySelector('p.MuiFormHelperText-root');

    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent('Farm Def Path');
    expect(label).toHaveClass('Mui-error');
    expect(input).toHaveAttribute('id', 'my-id');
    expect(helperText).toHaveClass('Mui-error');
    expect(helperText).toHaveTextContent('error-message');
  });

  it('disables the Autocomplete', () => {
    mockUseSwrAxios.mockReturnValue({});
    const { queryByTestId } = render(<AutocompleteFarmDefObject disabled />);

    const input = queryByTestId(dataTestIds.textField).querySelector('input');

    expect(input).toBeDisabled();
  });

  it('allows to navigate the FarmDef hierarchy of a Site', async () => {
    mockUseSwrAxios.mockImplementation(mockUseSwrAxiosImpl);
    const handleChange = jest.fn();
    const { queryByTestId } = render(<AutocompleteFarmDefObject onChange={handleChange} />);

    const input = queryByTestId(dataTestIds.textField).querySelector('input');

    expect(queryByTestId(dataTestIds.listbox)).not.toBeInTheDocument();
    expect(handleChange).not.toHaveBeenCalled();

    await actAndAwait(() => openAutocomplete(input));

    expect(queryByTestId(dataTestIds.listbox)).toBeInTheDocument();

    // -> select sites/SSF2
    await actAndAwait(() => chooseFromAutocompleteByIndex(1));

    expect(queryByTestId(dataTestIds.listbox)).toBeInTheDocument();
    expect(input).toHaveValue('SSF2/');
    expect(queryByTestId(dataTestIds.listboxHeader)).toHaveTextContent('Areas');
    expect(handleChange).toHaveBeenCalledWith(root.sites['SSF2'], undefined);

    // -> select sites/SSF2/areas/Seeding
    await actAndAwait(() => chooseFromAutocompleteByIndex(0));

    expect(queryByTestId(dataTestIds.listbox)).toBeInTheDocument();
    expect(input).toHaveValue('SSF2/Seeding/');
    expect(queryByTestId(dataTestIds.listboxHeader)).toHaveTextContent('Lines');
    expect(handleChange).toHaveBeenCalledWith(
      root.sites['SSF2'].areas['Seeding'],
      root.sites['SSF2'].areas['Seeding'].properties['farmCode']
    );

    // -> click back button
    await actAndAwait(() => queryByTestId(dataTestIds.backButton).click());

    expect(queryByTestId(dataTestIds.listbox)).toBeInTheDocument();
    expect(input).toHaveValue('SSF2/');
    expect(queryByTestId(dataTestIds.listboxHeader)).toHaveTextContent('Areas');
    expect(handleChange).toHaveBeenCalledWith(root.sites['SSF2'], undefined);

    // -> select sites/SSF2/areas/Seeding again
    await actAndAwait(() => chooseFromAutocompleteByIndex(0));

    expect(queryByTestId(dataTestIds.listbox)).toBeInTheDocument();
    expect(input).toHaveValue('SSF2/Seeding/');
    expect(queryByTestId(dataTestIds.listboxHeader)).toHaveTextContent('Lines');
    expect(handleChange).toHaveBeenCalledWith(
      root.sites['SSF2'].areas['Seeding'],
      root.sites['SSF2'].areas['Seeding'].properties['farmCode']
    );

    // -> delete last "/" in inputValue
    await actAndAwait(() => changeTextField(input, 'SSF2/Seeding'));

    expect(queryByTestId(dataTestIds.listbox)).toBeInTheDocument();
    expect(input).toHaveValue('SSF2/');
    expect(queryByTestId(dataTestIds.listboxHeader)).toHaveTextContent('Areas');
    expect(handleChange).toHaveBeenCalledWith(root.sites['SSF2'], undefined);

    // -> type manually SSF2/Seeding/
    await actAndAwait(() => changeTextField(input, 'SSF2/Seeding/'));

    expect(queryByTestId(dataTestIds.listbox)).toBeInTheDocument();
    expect(input).toHaveValue('SSF2/Seeding/');
    expect(queryByTestId(dataTestIds.listboxHeader)).toHaveTextContent('Lines');
    expect(handleChange).toHaveBeenCalledWith(
      root.sites['SSF2'].areas['Seeding'],
      root.sites['SSF2'].areas['Seeding'].properties['farmCode']
    );
  });

  it('shows no options when the selected FarmDefObject matches closeWhenSelectingKinds', async () => {
    mockUseSwrAxios.mockImplementation(mockUseSwrAxiosImpl);
    const handleChange = jest.fn();
    const { queryByTestId, getByRole } = render(
      <AutocompleteFarmDefObject closeWhenSelectingKinds={['area']} onChange={handleChange} />
    );

    const input = queryByTestId(dataTestIds.textField).querySelector('input');

    expect(queryByTestId(dataTestIds.listbox)).not.toBeInTheDocument();

    await actAndAwait(() => openAutocomplete(input));

    expect(queryByTestId(dataTestIds.listbox)).toBeInTheDocument();

    // -> select sites/SSF2
    await actAndAwait(() => chooseFromAutocompleteByIndex(1));

    expect(queryByTestId(dataTestIds.listbox)).toBeInTheDocument();
    expect(input).toHaveValue('SSF2/');
    expect(handleChange).toHaveBeenCalledWith(root.sites['SSF2'], undefined);

    // -> select sites/SSF2/areas/Seeding
    await actAndAwait(() => chooseFromAutocompleteByIndex(0));

    expect(queryByTestId(dataTestIds.listbox)).not.toBeInTheDocument();
    expect(input).toHaveValue('SSF2/Seeding/');
    expect(handleChange).toHaveBeenCalledWith(
      root.sites['SSF2'].areas['Seeding'],
      root.sites['SSF2'].areas['Seeding'].properties['farmCode']
    );

    // -> re-open dropdown
    await actAndAwait(() => openAutocomplete(input));

    expect(queryByTestId(dataTestIds.backButton)).toBeInTheDocument();
    expect(getByRole('presentation')).toBeInTheDocument();
    expect(getByRole('presentation')).toHaveTextContent('No options');
  });

  it('initializes the input with the site path', () => {
    mockUseSwrAxios.mockImplementation(mockUseSwrAxiosImpl);
    const handleChange = jest.fn();

    const { queryByTestId } = render(<AutocompleteFarmDefObject initialPath="sites/SSF2" onChange={handleChange} />);
    expect(queryByTestId(dataTestIds.textField).querySelector('input')).toHaveValue('SSF2/');
    expect(handleChange).toHaveBeenCalled();
  });

  it('initializes the input with the area path ', () => {
    mockUseSwrAxios.mockImplementation(mockUseSwrAxiosImpl);
    const { queryByTestId } = render(<AutocompleteFarmDefObject initialPath="sites/SSF2/areas/Seeding" />);
    expect(queryByTestId(dataTestIds.textField).querySelector('input')).toHaveValue('SSF2/Seeding/');
  });

  it('initializes the input with the ScheduleDefinition ', () => {
    mockUseSwrAxios.mockImplementation(mockUseSwrAxiosImpl);
    const handleChange = jest.fn();

    const { queryByTestId } = render(
      <AutocompleteFarmDefObject
        initialPath="sites/SSF2/areas/Seeding/scheduleDefinitions/ThermalHumidity"
        onChange={handleChange}
      />
    );
    expect(handleChange).toHaveBeenLastCalledWith(
      root.sites['SSF2'].areas['Seeding'].scheduleDefinitions['ThermalHumidity'],
      undefined
    );
    expect(queryByTestId(dataTestIds.textField).querySelector('input')).toHaveValue('SSF2/Seeding/ThermalHumidity/');
  });

  it('initializes the input with the closest parent valid path given an invalid path', () => {
    mockUseSwrAxios.mockImplementation(mockUseSwrAxiosImpl);
    const { queryByTestId } = render(<AutocompleteFarmDefObject initialPath="sites/SSF2/areas/Seedi" />);
    expect(queryByTestId(dataTestIds.textField).querySelector('input')).toHaveValue('SSF2/');
  });

  it('selects a FarmDef Site when pasting a path FarmDef Site path', async () => {
    mockUseSwrAxios.mockImplementation(mockUseSwrAxiosImpl);
    const handleChange = jest.fn();
    const { queryByTestId } = render(<AutocompleteFarmDefObject onChange={handleChange} />);

    const input = queryByTestId(dataTestIds.textField).querySelector('input');

    await actAndAwait(() => changeTextField(input, 'sites/SSF2'));

    expect(input).toHaveValue('SSF2/');
    expect(queryByTestId(dataTestIds.listboxHeader)).toHaveTextContent('Areas & Farms');
    expect(handleChange).toHaveBeenCalledWith(root.sites['SSF2'], undefined);
  });

  it('selects a FarmDef Site when pasting a shortened FarmDef Site path', async () => {
    mockUseSwrAxios.mockImplementation(mockUseSwrAxiosImpl);
    const handleChange = jest.fn();
    const { queryByTestId } = render(<AutocompleteFarmDefObject onChange={handleChange} />);

    const input = queryByTestId(dataTestIds.textField).querySelector('input');

    await actAndAwait(() => changeTextField(input, 'SSF2/'));

    expect(input).toHaveValue('SSF2/');
    expect(queryByTestId(dataTestIds.listboxHeader)).toHaveTextContent('Areas & Farms');
    expect(handleChange).toHaveBeenCalledWith(root.sites['SSF2'], undefined);
  });

  it('selects a FarmDef Area when pasting a FarmDef Area path', async () => {
    mockUseSwrAxios.mockImplementation(mockUseSwrAxiosImpl);
    const handleChange = jest.fn();
    const { queryByTestId } = render(<AutocompleteFarmDefObject onChange={handleChange} />);

    const input = queryByTestId(dataTestIds.textField).querySelector('input');

    await actAndAwait(() => changeTextField(input, 'sites/SSF2/areas/Seeding'));

    expect(input).toHaveValue('SSF2/Seeding/');
    expect(queryByTestId(dataTestIds.listboxHeader)).toHaveTextContent('Lines');
    expect(handleChange).toHaveBeenCalledWith(
      root.sites['SSF2'].areas['Seeding'],
      root.sites['SSF2'].areas['Seeding'].properties['farmCode']
    );
  });

  it('selects a FarmDef Area when pasting a shortened FarmDef Area path', async () => {
    mockUseSwrAxios.mockImplementation(mockUseSwrAxiosImpl);
    const handleChange = jest.fn();
    const { queryByTestId } = render(<AutocompleteFarmDefObject onChange={handleChange} />);

    const input = queryByTestId(dataTestIds.textField).querySelector('input');

    await actAndAwait(() => changeTextField(input, 'SSF2/Seeding/'));

    expect(input).toHaveValue('SSF2/Seeding/');
    expect(queryByTestId(dataTestIds.listboxHeader)).toHaveTextContent('Lines');
    expect(handleChange).toHaveBeenCalledWith(
      root.sites['SSF2'].areas['Seeding'],
      root.sites['SSF2'].areas['Seeding'].properties['farmCode']
    );
  });

  it('selects the site when the pasted area is invalid', async () => {
    mockUseSwrAxios.mockImplementation(mockUseSwrAxiosImpl);
    const handleChange = jest.fn();
    const { queryByTestId } = render(<AutocompleteFarmDefObject onChange={handleChange} />);

    const input = queryByTestId(dataTestIds.textField).querySelector('input');

    await actAndAwait(() => changeTextField(input, 'SSF2/Seedin'));

    expect(input).toHaveValue('SSF2/');
    expect(queryByTestId(dataTestIds.listboxHeader)).toHaveTextContent('Areas & Farms');
    expect(handleChange).toHaveBeenCalledWith(root.sites['SSF2'], undefined);
  });

  it('selects the site when the pasted area and line are invalid', async () => {
    mockUseSwrAxios.mockImplementation(mockUseSwrAxiosImpl);
    const handleChange = jest.fn();
    const { queryByTestId } = render(<AutocompleteFarmDefObject onChange={handleChange} />);

    const input = queryByTestId(dataTestIds.textField).querySelector('input');

    await actAndAwait(() => changeTextField(input, 'SSF2/Seedin/Tra'));

    expect(input).toHaveValue('SSF2/');
    expect(queryByTestId(dataTestIds.listboxHeader)).toHaveTextContent('Areas & Farms');
    expect(handleChange).toHaveBeenCalledWith(root.sites['SSF2'], undefined);
  });

  it('selects the area when the pasted line is invalid', async () => {
    mockUseSwrAxios.mockImplementation(mockUseSwrAxiosImpl);
    const handleChange = jest.fn();
    const { queryByTestId } = render(<AutocompleteFarmDefObject onChange={handleChange} />);

    const input = queryByTestId(dataTestIds.textField).querySelector('input');

    await actAndAwait(() => changeTextField(input, 'SSF2/Seeding/Tra'));

    expect(input).toHaveValue('SSF2/Seeding/');
    expect(queryByTestId(dataTestIds.listboxHeader)).toHaveTextContent('Lines');
    expect(handleChange).toHaveBeenCalledWith(
      root.sites['SSF2'].areas['Seeding'],
      root.sites['SSF2'].areas['Seeding'].properties['farmCode']
    );
  });

  it('allows searching for device locations', async () => {
    mockUseSwrAxios.mockImplementation(mockUseSwrAxiosImpl);
    const handleChange = jest.fn();
    const { queryByTestId, getByRole } = render(
      <AutocompleteFarmDefObject showDeviceLocations onChange={handleChange} />
    );

    const input = queryByTestId(dataTestIds.textField).querySelector('input');

    await actAndAwait(() => changeTextField(input, 'SSF2/'));

    expect(input).toHaveValue('SSF2/');
    expect(handleChange).toHaveBeenCalledWith(root.sites['SSF2'], undefined);

    await actAndAwait(() => openAutocomplete(input));

    expect(queryByTestId(dataTestIds.listbox)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.listbox).textContent).toContain('Device Location');
    expect(queryByTestId(dataTestIds.listbox).textContent).toContain('Seeding (2)');
    expect(queryByTestId(dataTestIds.listbox).textContent).toContain('Camera');

    await actAndAwait(() => chooseFromAutocompleteByIndex(0));

    expect(input).toHaveValue('SSF2/Camera/');

    expect(queryByTestId(dataTestIds.listbox)).not.toBeInTheDocument();

    await actAndAwait(() => openAutocomplete(input));

    expect(queryByTestId(dataTestIds.backButton)).toBeInTheDocument();
    expect(getByRole('presentation')).toBeInTheDocument();
    expect(getByRole('presentation')).toHaveTextContent('No options');
  });

  it('allows searching for child device locations', async () => {
    mockUseSwrAxios.mockImplementation(mockUseSwrAxiosImpl);
    const handleChange = jest.fn();
    const { queryByTestId, getByRole } = render(
      <AutocompleteFarmDefObject showDeviceLocations onChange={handleChange} />
    );

    const input = queryByTestId(dataTestIds.textField).querySelector('input');

    await actAndAwait(() => changeTextField(input, 'SSF2/'));

    expect(input).toHaveValue('SSF2/');
    expect(handleChange).toHaveBeenCalledWith(root.sites['SSF2'], undefined);

    await actAndAwait(() => openAutocomplete(input));

    expect(queryByTestId(dataTestIds.listbox)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.listbox).textContent).toContain('Device Location');
    expect(queryByTestId(dataTestIds.listbox).textContent).toContain('Seeding (2)');
    expect(queryByTestId(dataTestIds.listbox).textContent).toContain('Camera');
    expect(queryByTestId(dataTestIds.listbox).textContent).toContain('VerticalGrow (2)');

    await actAndAwait(() => chooseFromAutocompleteByIndex(2));

    expect(input).toHaveValue('SSF2/VerticalGrow/');

    await actAndAwait(() => chooseFromAutocompleteByIndex(0));

    expect(input).toHaveValue('SSF2/VerticalGrow/GrowRoom/');

    await actAndAwait(() => chooseFromAutocompleteByIndex(0));

    expect(input).toHaveValue('SSF2/VerticalGrow/GrowRoom/GrowLane1/');

    await actAndAwait(() => chooseFromAutocompleteByIndex(0));

    expect(input).toHaveValue('SSF2/VerticalGrow/GrowRoom/GrowLane1/SprinkleGroup/SprinkleSp1p1/');

    expect(queryByTestId(dataTestIds.listbox)).not.toBeInTheDocument();

    await actAndAwait(() => openAutocomplete(input));

    expect(queryByTestId(dataTestIds.backButton)).toBeInTheDocument();
    expect(getByRole('presentation')).toBeInTheDocument();
    expect(getByRole('presentation')).toHaveTextContent('No options');
  });

  it('allows searching for container locations', async () => {
    mockUseSwrAxios.mockImplementation(mockUseSwrAxiosImpl);
    const handleChange = jest.fn();
    const { queryByTestId, getByRole } = render(
      <AutocompleteFarmDefObject showContainerLocations onChange={handleChange} />
    );

    const input = queryByTestId(dataTestIds.textField).querySelector('input');

    await actAndAwait(() => changeTextField(input, 'SSF2/VerticalGrow/GrowRoom/GrowLane1/'));

    expect(input).toHaveValue('SSF2/VerticalGrow/GrowRoom/GrowLane1/');
    expect(handleChange).toHaveBeenCalledWith(
      root.sites['SSF2'].areas['VerticalGrow'].lines['GrowRoom'].machines['GrowLane1'],
      root.sites['SSF2'].areas['VerticalGrow'].lines['GrowRoom'].properties['farmCode']
    );

    await actAndAwait(() => openAutocomplete(input));

    expect(queryByTestId(dataTestIds.listbox)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.listbox).textContent).toContain('ContainerLocation');
    expect(queryByTestId(dataTestIds.listbox).textContent).toContain('T1');
    expect(queryByTestId(dataTestIds.listbox).textContent).toContain('T2');

    await actAndAwait(() => chooseFromAutocompleteByIndex(0));

    expect(input).toHaveValue('SSF2/VerticalGrow/GrowRoom/GrowLane1/T1/');

    expect(queryByTestId(dataTestIds.listbox)).not.toBeInTheDocument();

    await actAndAwait(() => openAutocomplete(input));

    expect(queryByTestId(dataTestIds.backButton)).toBeInTheDocument();
    expect(getByRole('presentation')).toBeInTheDocument();
    expect(getByRole('presentation')).toHaveTextContent('No options');
  });

  it('allows searching for schedule definitions', async () => {
    mockUseSwrAxios.mockImplementation(mockUseSwrAxiosImpl);
    const handleChange = jest.fn();
    const { queryByTestId, getByRole } = render(
      <AutocompleteFarmDefObject showScheduleDefinitions onChange={handleChange} />
    );

    const input = queryByTestId(dataTestIds.textField).querySelector('input');

    await actAndAwait(() => changeTextField(input, 'SSF2/'));

    expect(input).toHaveValue('SSF2/');
    expect(handleChange).toHaveBeenCalledWith(root.sites['SSF2'], undefined);

    await actAndAwait(() => openAutocomplete(input));

    expect(queryByTestId(dataTestIds.listbox)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.listbox).textContent).toContain('Seeding (2)');

    await actAndAwait(() => chooseFromAutocompleteByIndex(0));

    expect(input).toHaveValue('SSF2/Seeding/');

    expect(queryByTestId(dataTestIds.listbox)).toBeInTheDocument();

    expect(queryByTestId(dataTestIds.listbox).textContent).toContain('ThermalHumidity');
    expect(queryByTestId(dataTestIds.listbox).textContent).toContain('ThermalTemperature');

    await actAndAwait(() => chooseFromAutocompleteByIndex(0));

    expect(input).toHaveValue('SSF2/Seeding/ThermalHumidity/');

    expect(queryByTestId(dataTestIds.listbox)).not.toBeInTheDocument();

    await actAndAwait(() => openAutocomplete(input));

    expect(queryByTestId(dataTestIds.backButton)).toBeInTheDocument();
    expect(getByRole('presentation')).toBeInTheDocument();
    expect(getByRole('presentation')).toHaveTextContent('No options');
  });

  it('allows searching for schedule definitions parents', async () => {
    mockUseSwrAxios.mockImplementation(mockUseSwrAxiosImpl);
    const handleChange = jest.fn();
    const { queryByTestId, getByRole } = render(
      <AutocompleteFarmDefObject showScheduleDefinitionParents onChange={handleChange} />
    );

    const input = queryByTestId(dataTestIds.textField).querySelector('input');

    await actAndAwait(() => changeTextField(input, 'SSF2/'));

    expect(input).toHaveValue('SSF2/');
    expect(handleChange).toHaveBeenCalledWith(root.sites['SSF2'], undefined);

    await actAndAwait(() => openAutocomplete(input));

    expect(queryByTestId(dataTestIds.listbox)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.listbox).textContent).toContain('Seeding');
    expect(queryByTestId(dataTestIds.listbox).textContent).not.toContain('(2)');

    await actAndAwait(() => chooseFromAutocompleteByIndex(0));

    // This was the last parent having a Schedule Definition so there a no more options.
    expect(input).toHaveValue('SSF2/Seeding/');
    expect(queryByTestId(dataTestIds.listbox)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.backButton)).toBeInTheDocument();
    expect(getByRole('presentation')).toBeInTheDocument();
    expect(getByRole('presentation')).toHaveTextContent('No options');
  });

  it('resets the input to the last selection on blur', async () => {
    mockUseSwrAxios.mockImplementation(mockUseSwrAxiosImpl);
    const handleChange = jest.fn();
    const { queryByTestId } = render(<AutocompleteFarmDefObject showDeviceLocations={true} onChange={handleChange} />);

    const input = queryByTestId(dataTestIds.textField).querySelector('input');

    await actAndAwait(() => changeTextField(input, 'SSF'));
    await actAndAwait(() => fireEvent.blur(input));

    expect(input).toHaveValue('');
    expect(handleChange).toHaveBeenCalledTimes(1);

    await actAndAwait(() => changeTextField(input, 'SSF2'));
    await actAndAwait(() => fireEvent.blur(input));

    expect(input).toHaveValue('SSF2/');
    expect(handleChange).toHaveBeenCalledTimes(2);
    expect(handleChange).toHaveBeenCalledWith(root.sites['SSF2'], undefined);

    await actAndAwait(() => changeTextField(input, 'SSF2/Seed'));
    await actAndAwait(() => fireEvent.blur(input));

    expect(input).toHaveValue('SSF2/');
    expect(handleChange).toHaveBeenCalledTimes(2);
  });

  it('resets the input when re-rendering with an undefined initial path', async () => {
    mockUseSwrAxios.mockImplementation(mockUseSwrAxiosImpl);
    const { queryByTestId, rerender } = render(<AutocompleteFarmDefObject showDeviceLocations={true} />);

    const input = queryByTestId(dataTestIds.textField).querySelector('input');

    await actAndAwait(() => changeTextField(input, 'SSF2/'));
    await actAndAwait(() => fireEvent.blur(input));

    expect(input).toHaveValue('SSF2/');

    rerender(<AutocompleteFarmDefObject showDeviceLocations={true} initialPath={'sites/SSF2'} />);

    expect(input).toHaveValue('SSF2/');

    rerender(<AutocompleteFarmDefObject showDeviceLocations={true} initialPath={undefined} />);

    expect(input).toHaveValue('');
  });

  it('clearing the input invokes onChange callback with null', async () => {
    const handleChange = jest.fn();
    mockUseSwrAxios.mockImplementation(mockUseSwrAxiosImpl);
    const { queryByTestId } = render(<AutocompleteFarmDefObject onChange={handleChange} />);

    const input = queryByTestId(dataTestIds.textField).querySelector('input');

    await actAndAwait(() => changeTextField(input, 'SSF2/'));

    expect(handleChange).toHaveBeenCalledWith(root.sites['SSF2'], undefined);

    await actAndAwait(() => changeTextField(input, ''));

    expect(handleChange).toHaveBeenCalledWith(null, undefined);
  });

  it('provides statistics about observations', async () => {
    mockUseSwrAxios.mockImplementation(mockUseSwrAxiosImpl);
    const handleChange = jest.fn();
    const { queryByTestId } = render(<AutocompleteFarmDefObject showObservationStats onChange={handleChange} />);

    const input = queryByTestId(dataTestIds.textField).querySelector('input');

    await actAndAwait(() => openAutocomplete(input));

    expect(queryByTestId(dataTestIds.listbox)).toBeInTheDocument();
    // only SSF2 has observations see `mock-use-swr-axios-impl` .
    expect(queryByTestId(dataTestIds.listbox).textContent).toContain('SSF2');
    expect(queryByTestId(dataTestIds.listbox).textContent).not.toContain('LAX1');
  });

  describe('blur cases', () => {
    it('calls onBlur when closing dropdown with checkmark icon and clicking away', async () => {
      const handleBlur = jest.fn();
      mockUseSwrAxios.mockImplementation(mockUseSwrAxiosImpl);
      const { queryByTestId } = render(<AutocompleteFarmDefObject onBlur={handleBlur} />);

      const input = queryByTestId(dataTestIds.textField).querySelector('input');

      await actAndAwait(() => changeTextField(input, 'SSF2/'));

      expect(handleBlur).not.toHaveBeenCalled();

      // click the checkmark: closeButton in the drop down.
      const headerCloseButton = queryByTestId(dataTestIdsListboxHeader.closeButton);
      headerCloseButton.click();

      const listBoxComponent = queryByTestId(dataTestIdsListboxComponent.listbox);
      expect(listBoxComponent).toBe(null);
      expect(handleBlur).not.toHaveBeenCalled();

      await actAndAwait(() => fireEvent.blur(input));

      expect(handleBlur).toHaveBeenCalled();
    });

    it('calls onBlur and onClear when clearing the autocomplete and clicking away', async () => {
      const handleBlur = jest.fn();
      const handleClear = jest.fn();
      mockUseSwrAxios.mockImplementation(mockUseSwrAxiosImpl);
      const { queryByLabelText, queryByTestId } = render(
        <AutocompleteFarmDefObject onBlur={handleBlur} onClear={handleClear} />
      );

      const input = queryByTestId(dataTestIds.textField).querySelector('input');

      await actAndAwait(() => changeTextField(input, 'SSF2/'));

      expect(input).toHaveValue('SSF2/');
      expect(handleBlur).not.toHaveBeenCalled();
      expect(handleClear).not.toHaveBeenCalled();

      const clearButton = queryByLabelText('Clear');
      clearButton.click();
      expect(handleClear).toHaveBeenCalled();

      expect(input).toHaveValue('');
      expect(handleBlur).not.toHaveBeenCalled();

      await actAndAwait(() => fireEvent.blur(input));

      expect(handleBlur).toHaveBeenCalled();
    });

    it('calls onClear when deleting all characters in the input', async () => {
      const handleBlur = jest.fn();
      const handleClear = jest.fn();
      mockUseSwrAxios.mockImplementation(mockUseSwrAxiosImpl);
      const { queryByTestId } = render(<AutocompleteFarmDefObject onBlur={handleBlur} onClear={handleClear} />);

      const input = queryByTestId(dataTestIds.textField).querySelector('input');

      await actAndAwait(() => changeTextField(input, 'SSF2/'));

      expect(input).toHaveValue('SSF2/');
      expect(handleBlur).not.toHaveBeenCalled();
      expect(handleClear).not.toHaveBeenCalled();

      await actAndAwait(() => changeTextField(input, ''));

      expect(handleClear).toHaveBeenCalled();
      expect(input).toHaveValue('');
    });
  });

  describe('allowedPaths cases', () => {
    async function renderAutocompleteFarmDefObjectWithAllowedPaths(allowedPaths: string[]) {
      mockUseSwrAxios.mockImplementation(mockUseSwrAxiosImpl);
      const handleChange = jest.fn();
      const result = render(<AutocompleteFarmDefObject onChange={handleChange} allowedPaths={allowedPaths} />);

      const input = result.queryByTestId(dataTestIds.textField).querySelector('input');

      expect(result.queryByTestId(dataTestIds.listbox)).not.toBeInTheDocument();

      // open sites
      await actAndAwait(() => openAutocomplete(input));

      return result;
    }

    it('shows only site SSF2 in options when LAR1 is not in allowedPaths', async () => {
      const allowedPaths = ['sites/SSF2'];
      const { queryByTestId, getAllByRole } = await renderAutocompleteFarmDefObjectWithAllowedPaths(allowedPaths);

      expect(queryByTestId(dataTestIds.listbox)).toBeInTheDocument();
      const options = getAllByRole('option');
      expect(options).toHaveLength(1);
      expect(options[0]).toHaveTextContent('SSF2');
    });

    it('shows both SSF2 and LAR1 when both are in allowedPaths', async () => {
      const allowedPaths = ['sites/SSF2/areas/Seeding', 'sites/LAR1'];
      const { queryByTestId, getAllByRole } = await renderAutocompleteFarmDefObjectWithAllowedPaths(allowedPaths);

      expect(queryByTestId(dataTestIds.listbox)).toBeInTheDocument();
      const options = getAllByRole('option');
      expect(options).toHaveLength(2);
      expect(options[0]).toHaveTextContent('LAR1');
      expect(options[1]).toHaveTextContent('SSF2');
    });

    it('shows only SSF2 area: Seeding', async () => {
      const allowedPaths = ['sites/SSF2/areas/Seeding'];
      const { queryByTestId, getAllByRole } = await renderAutocompleteFarmDefObjectWithAllowedPaths(allowedPaths);

      expect(queryByTestId(dataTestIds.listbox)).toBeInTheDocument();
      const siteOptions = getAllByRole('option');
      expect(siteOptions).toHaveLength(1);
      expect(siteOptions[0]).toHaveTextContent('SSF2');

      // select SSF2 site and open areas
      await actAndAwait(() => siteOptions[0].click());

      expect(queryByTestId(dataTestIds.listbox)).toBeInTheDocument();
      const areaOptions = getAllByRole('option');
      expect(areaOptions).toHaveLength(1);
      expect(areaOptions[0]).toHaveTextContent('Seeding');
    });
  });
});
