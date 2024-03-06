import { Autocomplete } from './autocomplete';
import { AutocompleteCrop } from './autocomplete-crop';
import { AutocompleteFarmDefCrop } from './autocomplete-farm-def-crop';
import { AutocompleteFarmDefObject } from './autocomplete-farm-def-object';
import { AutocompleteFarmDefSku } from './autocomplete-farm-def-sku';
import { AutocompleteFarmDefType } from './autocomplete-farm-def-type';
import { AutocompleteFirmwareVersion } from './autocomplete-firmware-version';
import { AutocompleteMetric } from './autocomplete-metric';
import { AutocompleteMetricMeasurementType } from './autocomplete-metric-measurement-type';
import { AutocompleteMultiple } from './autocomplete-multiple';
import { AutocompleteMultipleDndOrdering } from './autocomplete-multiple-dnd-ordering';
import { AutocompleteObservationDefinition } from './autocomplete-observation-definition';
import { AutocompleteObservationGroup } from './autocomplete-observation-group';
import { AutocompleteRemote } from './autocomplete-remote';
import { AutocompleteSchedule } from './autocomplete-schedule';
import { AutocompleteTypeahead } from './autocomplete-typeahead';
import { AutocompleteUser } from './autocomplete-user';
import { Checkbox } from './checkbox';
import { CheckboxGrid } from './checkbox-grid';
import { DatePicker } from './date-picker';
import { DragAndDrop } from './drag-and-drop';
import { KeyboardDatePicker } from './keyboard-date-picker';
import { KeyboardDateTimePicker } from './keyboard-datetime-picker';
import { KeyboardTimePicker } from './keyboard-time-picker';
import { MetricsSelector } from './metrics-selector';
import { PtiLabelDecoder } from './pti-label-decoder';
import { RadioGrid } from './radio-grid';
import { RadioGroup } from './radio-group';
import { RadioGroupRemote } from './radio-group-remote';
import { RadioGroupResourceLabel } from './radio-group-resource-label';
import { ReactComponent } from './react-component';
import { Select } from './select';
import { SelectCrop } from './select-crop';
import { SelectFarmDefObject } from './select-farm-def-object';
import { SelectRemote } from './select-remote';
import { TextField } from './text-field';
import { TextFieldGrid } from './text-field-grid';
import { TextFieldRemoteHelperText } from './text-field-remote-helper-text';
import { TrayIdDecoder } from './tray-id-decoder';
import { Typography } from './typography';

const ComponentMapping = {
  Autocomplete,
  AutocompleteCrop,
  AutocompleteFarmDefCrop,
  AutocompleteFarmDefObject,
  AutocompleteFarmDefSku,
  AutocompleteFarmDefType,
  AutocompleteFirmwareVersion,
  AutocompleteMetric,
  AutocompleteMetricMeasurementType,
  AutocompleteMultiple,
  AutocompleteMultipleDndOrdering,
  AutocompleteObservationDefinition,
  AutocompleteObservationGroup,
  AutocompleteRemote,
  AutocompleteTypeahead,
  AutocompleteSchedule,
  AutocompleteUser,
  Checkbox,
  CheckboxGrid,
  DatePicker,
  DragAndDrop,
  KeyboardDatePicker,
  KeyboardDateTimePicker,
  KeyboardTimePicker,
  MetricsSelector,
  PtiLabelDecoder,
  RadioGrid,
  RadioGroup,
  RadioGroupRemote,
  RadioGroupResourceLabel,
  ReactComponent,
  Select,
  SelectCrop,
  SelectFarmDefObject,
  SelectRemote,
  TextField,
  TextFieldRemoteHelperText,
  TextFieldGrid,
  TrayIdDecoder,
  Typography,
};

export function getInputComponent(field: FormGen.Field) {
  return ComponentMapping[field.type];
}
