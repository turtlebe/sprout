type AutocompleteProps<T, Multiple, DisableClearable, FreeSolo> =
  import('@material-ui/lab/Autocomplete').AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>;
type CheckboxProps = import('@material-ui/core').CheckboxProps;
type CSSProperties = import('react').CSSProperties;
type DatePickerProps = import('@material-ui/pickers').DatePickerProps;
type FormControlLabelProps = import('@material-ui/core').FormControlLabelProps;
type FormikProps<T> = import('formik').FormikProps<T>;
type IDropzoneProps = import('react-dropzone-uploader').IDropzoneProps;
type IFileWithMeta = import('react-dropzone-uploader').IFileWithMeta;
type KeyboardDatePickerProps = import('@material-ui/pickers').KeyboardDatePickerProps;
type KeyboardTimePickerProps = import('@material-ui/pickers').KeyboardTimePickerProps;
type KeyboardDateTimePickerProps = import('@material-ui/pickers').KeyboardDateTimePickerProps;
type PermissionLevels = import('@plentyag/core/src/core-store/types').PermissionLevels;
type RadioProps = import('@material-ui/core').RadioProps;
type Resources = import('@plentyag/core/src/core-store/types').Resources;
type Schema<T> = import('yup').Schema<T>;
type SelectProps = import('@material-ui/core').SelectProps;
type TextFieldProps = import('@material-ui/core').TextFieldProps;
type TypographyProps = import('@material-ui/core').TypographyProps;
type AutocompleteFarmDefObject =
  import('@plentyag/brand-ui/src/components/autocomplete-farm-def-object').AutocompleteFarmDefObject;
type AutocompleteFarmDefObjectAutocompleteProps =
  import('@plentyag/brand-ui/src/components/autocomplete-farm-def-object').AutocompleteProps;
type AllowedObjects = import('@plentyag/brand-ui/src/components/autocomplete-farm-def-object').AllowedObjects;
type ScheduleDefinition = import('@plentyag/core/src/farm-def/types').ScheduleDefinition;

declare namespace FormGen {
  interface FieldState {
    isLoading?: boolean;
    isPersisted?: boolean;
    error?: string;
  }

  type Layout = 'default' | 'groupRow';

  interface OverridableClassName {
    form?: string;
    input?: string;
    groupContainer?: string;
    nestedGroupContainer?: string;
    groupRow?: string;
    groupItem?: string;
    groupInputs?: string;
    inputContainer?: string;
    inputContainerInGroup?: string;
    submit?: string;
    titleContainer?: string;
  }

  interface ValueLabel {
    value: any;
    label: string;
  }

  interface RadioOption extends ValueLabel {
    category?: string;
    helperText?: string; // markdown
  }

  type useFormGenConfigHook<HookProps = any, FormikValues = any> = (hookProps?: HookProps) => Config<FormikValues>;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Config<FormiKValues = any> {
    title?: string;
    subtitle?: string;
    fields?: FieldAny[];
    permissions?: PermissionGroup;
    getEndpoint?: string;
    createEndpoint?: string;
    updateEndpoint?: string;
    headers?: any;
    context?: any;
    isLoading?: boolean;
    serialize?: (value: any) => any;
    deserialize?: (value: any) => any;
  }

  type extractFormikValues<T> = T extends Config<infer X> ? X : never;

  interface PermissionGroup {
    create?: Permission;
    update?: Permission;
  }

  interface Permission {
    resource: Resources;
    level: PermissionLevels;
  }

  type Field =
    | FieldAutocomplete
    | FieldAutocompleteCrop
    | FieldAutocompleteFarmDefCrop
    | FieldAutocompleteFarmDefObject
    | FieldAutocompleteFarmDefSku
    | FieldAutocompleteFarmDefType
    | FieldAutocompleteFirmwareVersion
    | FieldAutocompleteMultiple
    | FieldAutocompleteObservationDefinition
    | FieldAutocompleteObservationGroup
    | FieldAutocompleteRemote<any>
    | FieldAutocompleteTypeahead
    | FieldAutocompleteUser
    | FieldAutocompleteMetricMeasurementType
    | FieldAutocompleteMetric
    | FieldAutocompleteSchedule
    | FieldCheckbox
    | FieldCheckboxGrid
    | FieldDatePicker
    | FieldDragAndDrop
    | FieldAutocompleteMultipleDndOrdering
    | FieldKeyboardDatePicker
    | FieldKeyboardTimePicker
    | FieldKeyboardDateTimePicker
    | FieldMetricsSelector
    | FieldPtiLabelDecoder
    | FieldTrayIdDecoder
    | FieldRadioGrid
    | FieldRadioGroup
    | FieldRadioGroupRemote<any>
    | FieldRadioGroupResourceLabel
    | FieldReactComponent
    | FieldSelect
    | FieldSelectCrop
    | FieldSelectFarmDefObject
    | FieldSelectRemote<any>
    | FieldTextField
    | FieldTextFieldRemoteHelperText<any>
    | FieldTextFieldGrid
    | FieldTypography;
  type FieldAny = Field | FieldIf | FieldComputed | FieldGroupArray | FieldGroupFunction;

  interface TooltipProps<T = any> extends FieldProps<T> {
    onClose: () => void;
    open: boolean;
  }

  interface FieldDefinition {
    name: string;
    label?: string;
    validate?: Schema<unknown>;
    style?: CSSProperties;
    inputContainerStyle?: CSSProperties;
    default?: string | number | Object;
    permissions?: PermissionGroup;
    tooltip?: React.FC<TooltipProps>;
  }

  interface FieldGridDefinition {
    columns: string[];
    rows: ValueLabel[];
  }

  interface FieldProps<T extends FieldAny> {
    formGenField: T;
    formikProps: FormikProps<unknown>;
    className?: string;
    style?: CSSProperties;
    context?: any;
    disabled?: boolean;
  }

  type IfFunction = (values: any) => boolean;

  interface WhenObject {
    keys: string[];
    callback: (...keys) => boolean;
  }

  interface FieldIf {
    type?: 'if';
    if: IfFunction | WhenObject;
    fields: (Field | FieldGroupArray | FieldGroupFunction)[];
    permissions?: PermissionGroup;
  }

  interface FieldComputed {
    type?: 'computed';
    computed: (values: any) => (Field | FieldIf | FieldGroupArray | FieldGroupFunction)[];
  }

  interface FieldGroup {
    type: 'group';
    label?: string;
    name: string;
    enableCloning?: boolean; // if true then cloning should be available via the dropdown.
  }

  interface FieldGroupArray extends FieldGroup {
    fields: FieldAny[];
  }

  interface FieldGroupFunction extends FieldGroup {
    fields: (groupIndex: number) => FieldAny[];
    min?: number; // minimum number of fields, defaults to 1,
    max?: number; // maximum number of fields, defaults to 100.
  }

  interface FieldAutocomplete extends FieldDefinition {
    type: 'Autocomplete';
    options: (ValueLabel | string)[];
    autocompleteProps?: Omit<Partial<AutocompleteProps<ValueLabel, boolean, boolean, boolean>>, 'multiple'>;
  }

  interface FieldAutocompleteCrop extends FieldDefinition {
    type: 'AutocompleteCrop';
    allowList?: string[];
    extra?: (ValueLabel | string)[];
    autocompleteProps?: Partial<AutocompleteProps<ValueLabel, false, boolean, false>>;
  }

  interface FieldAutocompleteFarmDefCrop extends FieldDefinition {
    type: 'AutocompleteFarmDefCrop';
    // get crops for given farmPath (ex: sites/SSF2/farms/Tigris)
    // if farmPath is not provided then all crops are returned.
    isPackableAnywhere?: boolean;
    isPackableInFarm?: boolean;
    isPackable?: boolean;
    farmPath?: string;
    sku?: string;
    allowList?: string[] | ((crops: FarmDefCrop[]) => FarmDefCrop[]);
    extra?: (ValueLabel | string)[];
    valueSelector?: string;
    labelSelector?: string;
    autocompleteProps?: Partial<AutocompleteProps<ValueLabel, boolean, boolean, boolean>>;
  }

  interface FieldAutocompleteFarmDefObject extends FieldDefinition {
    type: 'AutocompleteFarmDefObject';
    showDeviceLocations?: AutocompleteFarmDefObject['showDeviceLocations'];
    showContainerLocations?: AutocompleteFarmDefObject['showContainerLocations'];
    showScheduleDefinitions?: AutocompleteFarmDefObject['showScheduleDefinitions'];
    showScheduleDefinitionParents?: AutocompleteFarmDefObject['showScheduleDefinitions'];
    showObservationStats?: AutocompleteFarmDefObject['showObservationStats'];
    closeWhenSelectingKinds?: AutocompleteFarmDefObject['closeWhenSelectingKinds'];
    onChange: (farmDefObject: AllowedObjects) => any;
    deviceTypes?: string[];
    autocompleteProps?: Partial<AutocompleteFarmDefObjectAutocompleteProps>;
    compatibleScheduleDefinition?: ScheduleDefinition;
    resolveScheduleDefinition?: boolean;
  }

  interface FieldAutocompleteFirmwareVersion extends FieldDefinition {
    type: 'AutocompleteFirmwareVersion';
    deviceType?: string;
    autocompleteProps?: Partial<AutocompleteProps<ValueLabel, false, true, false>>;
  }

  interface FieldAutocompleteFarmDefSku extends FieldDefinition {
    type: 'AutocompleteFarmDefSku';
    // get skus for given farmPath (ex: sites/SSF2/farms/Tigris)
    // if farmPath is not provided then all skus are returned.
    farmPath?: string;
    allowList?: string[];
    allowedSkuTypeNames?: string[];
    skuTypeClass?: string;
    extra?: (ValueLabel | string)[];
    valueSelector?: string;
    autocompleteProps?: Partial<AutocompleteProps<ValueLabel, false, boolean, false>>;
  }

  interface FieldAutocompleteFarmDefType extends FieldDefinition {
    type: 'AutocompleteFarmDefType';
    kind: 'measurementType' | 'deviceType' | 'cropType' | 'skuType';
    autocompleteProps?: Partial<AutocompleteProps<ValueLabel, false, boolean, false>>;
    valueSelector?: string;
  }

  interface FieldAutocompleteTypeahead<Response = any> extends FieldDefinition {
    type: 'AutocompleteTypeahead';
    url: string;
    getMakeRequestParams: (inputValue: string) => any;
    transformResponse: (response: Response) => ValueLabel[];
    autocompleteProps?: Partial<AutocompleteProps<ValueLabel, boolean, boolean, false>>;
  }

  interface FieldAutocompleteRemote<Response> extends FieldDefinition {
    type: 'AutocompleteRemote';
    url: string;
    urlQueryParams?: any;
    transformResponse: (response: Response) => ValueLabel[];
    autocompleteProps?: Partial<AutocompleteProps<ValueLabel, boolean, boolean, boolean>>;
  }

  interface FieldAutocompleteObservationDefinition extends FieldDefinition {
    type: 'AutocompleteObservationDefinition';
    valueSelector?: string;
    window?: string;
    autocompleteProps?: Partial<AutocompleteProps<ValueLabel, boolean, boolean, false>>;
  }

  interface FieldAutocompleteMultiple extends FieldDefinition {
    type: 'AutocompleteMultiple';
    options: (ValueLabel | string)[];
    autocompleteProps?: Omit<Partial<AutocompleteProps<ValueLabel, boolean, boolean, boolean>>, 'multiple'>;
  }

  interface FieldAutocompleteObservationGroup extends FieldDefinition {
    type: 'AutocompleteObservationGroup';
    path?: string;
    measurementType?: string;
    level: 'path' | 'measurementType' | 'observationName';
    autocompleteProps?: Omit<Partial<AutocompleteProps<ValueLabel, boolean, boolean, false>>, 'multiple'>;
  }

  interface FieldAutocompleteUser extends FieldDefinition {
    type: 'AutocompleteUser';
    farmPath?: string; // farm path that selected user must be from (e.g., sites/SSF2/farm/Tigris).
    roles?: string[]; // array of roles the user must have.
    autocompleteProps?: Partial<AutocompleteProps<ValueLabel, false, false, false>>;
  }

  interface FieldAutocompleteMetricMeasurementType extends FieldDefinition {
    type: 'AutocompleteMetricMeasurementType';
    path: string;
    autocompleteProps?: Partial<AutocompleteProps<ValueLabel, false, boolean, false>>;
  }

  interface FieldAutocompleteMetric extends FieldDefinition {
    type: 'AutocompleteMetric';
    valueSelector?: string;
    path: string;
    measurementType: string;
    autocompleteProps?: Partial<AutocompleteProps<ValueLabel, false, boolean, false>>;
  }

  interface FieldAutocompleteSchedule extends FieldDefinition {
    type: 'AutocompleteSchedule';
    valueSelector?: string;
    path: string;
    autocompleteProps?: Partial<AutocompleteProps<ValueLabel, boolean, boolean, false>>;
  }

  interface FieldCheckbox extends FieldDefinition {
    type: 'Checkbox';
    checkboxProps?: Partial<CheckboxProps>;
    formControlLabelProps?: Partial<FormControlLabelProps>;
  }

  interface FieldCheckboxGrid extends FieldDefinition, FieldGridDefinition {
    type: 'CheckboxGrid';
    enableCheckAll?: boolean;
  }

  interface FieldDatePicker extends FieldDefinition {
    type: 'DatePicker';
    datePickerProps?: Partial<DatePickerProps>;
  }

  interface FieldAutocompleteMultipleDndOrdering extends FieldDefinition {
    type: 'AutocompleteMultipleDndOrdering';
    options: ValueLabel[];
    selected: string[];
    addNewOptionText?: string;
  }

  interface FieldDragAndDrop extends FieldDefinition {
    type: 'DragAndDrop';
    accept?: string;
    maxFiles?: number;
    onRender?: (formGenField: FieldDragAndDrop, values: FormikProps<unknown>) => Promise;
    afterSubmit?: (files: IFileWithMeta[], response: any) => Promise;
    dropzoneUploaderProps?: Partial<IDropzoneProps>;
  }

  interface FieldKeyboardDatePicker extends FieldDefinition {
    type: 'KeyboardDatePicker';
    valueFormat?: string;
    keyboardDatePickerProps?: Partial<KeyboardDatePickerProps>;
  }

  interface FieldKeyboardTimePicker extends FieldDefinition {
    type: 'KeyboardTimePicker';
    valueFormat?: string;
    keyboardTimePickerProps?: Partial<KeyboardTimePickerProps>;
  }

  interface FieldKeyboardDateTimePicker extends FieldDefinition {
    type: 'KeyboardDateTimePicker';
    valueFormat?: string;
    keyboardDateTimePickerProps?: Partial<KeyboardDateTimePickerProps>;
  }

  interface FieldMetricsSelector extends FieldDefinition {
    type: 'MetricsSelector';
  }

  interface FieldPtiLabelDecoder extends FieldDefinition {
    type: 'PtiLabelDecoder';
    mapProductTo: string;
    mapUnitTypeTo: string;
  }

  interface FieldTrayIdDecoder extends FieldDefinition {
    type: 'TrayIdDecoder';
    mapProductTo: string;
    errorMessage?: string;
  }

  interface FieldRadioGrid extends FieldDefinition, FieldGridDefinition {
    type: 'RadioGrid';
  }

  interface FieldRadioGroup extends FieldDefinition {
    type: 'RadioGroup';
    options: RadioOption[];
    sortOptionsByLabel?: boolean; // default to true. if true will sort by option labels, otherwise will maintain given order.
    radioProps?: Partial<RadioProps>;
  }

  interface FieldRadioGroupRemote<Response> extends FieldDefinition {
    type: 'RadioGroupRemote';
    url: string;
    transformResponse: (response: Response) => RadioOption[];
    radioProps?: Partial<RadioProps>;
  }

  interface FieldRadioGroupResourceLabel extends FieldDefinition {
    type: 'RadioGroupResourceLabel';
    containerType?: ContainerTypes;
    materialType?: MaterialTypes;
    existingLabels?: string[];
    radioProps?: Partial<RadioProps>;
  }

  interface FieldReactComponent extends FieldDefinition {
    type: 'ReactComponent';
    component: React.FC<FieldProps>;
  }

  interface FieldSelect extends FieldDefinition {
    type: 'Select';
    options: (ValueLabel | string)[];
    selectProps?: Partial<SelectProps>;
  }

  interface FieldSelectCrop extends FieldDefinition {
    type: 'SelectCrop';
    allowList?: string[];
    extra?: (ValueLabel | string)[];
    selectProps?: Partial<SelectProps>;
  }

  interface FieldSelectFarmDefObject extends FieldDefinition {
    type: 'SelectFarmDefObject';
    site?: string;
    kind?: string;
    class?: string;
    allowedPaths?: string[];
    selectProps?: Partial<SelectProps>;
  }

  interface FieldSelectRemote<Response> extends FieldDefinition {
    type: 'SelectRemote';
    url: string;
    transformResponse: (response: Response) => ValueLabel[];
    selectProps?: Partial<SelectProps>;
  }

  interface FieldTextField extends FieldDefinition {
    type: 'TextField';
    // when text field is contained within a "FieldRepeatFunction" then this
    // allows creating a new empty field when the user presses return or pastes
    // text ending with a newline.
    addGroupOnNewLineOrReturn?: boolean;
    textFieldProps?: Partial<TextFieldProps>;
  }

  interface FieldTextFieldRemoteHelperText<Response> extends FieldDefinition {
    type: 'TextFieldRemoteHelperText';
    url: (value: string) => string;
    renderHelperText: (response: Response) => React.ReactNode | string;
    addGroupOnNewLineOrReturn?: boolean;
    textFieldProps?: Partial<TextFieldProps>;
  }

  interface FieldTextFieldGrid extends FieldDefinition, FieldGridDefinition {
    type: 'TextFieldGrid';
    textFieldProps?: Partial<TextFieldProps>;
    blurEffect?: string;
    tabbing?: 'vertical' | 'horizontal';
  }

  interface FieldTypography extends FieldDefinition {
    type: 'Typography';
    typographyProps?: Partial<TypographyProps>;
  }
}
