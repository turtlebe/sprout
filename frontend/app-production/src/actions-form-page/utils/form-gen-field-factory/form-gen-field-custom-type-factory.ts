import '@plentyag/core/src/yup/extension';
import { FarmStateContainer } from '@plentyag/app-production/src/common/types/farm-state';
import { getKindFromPath } from '@plentyag/core/src/farm-def/utils';
import { DateTimeFormat, getShortenedPath } from '@plentyag/core/src/utils';
import { DateTime } from 'luxon';
import * as yup from 'yup';

import { getYupNumberValidator, getYupStringValidator } from '../yup-validators';

/**
 * Generates form gen fields for custom types. Custom types (denoted from backend by type: 'TYPE_MESSAGE' with
 * typeName giving the proto name) are used to represent complex farm types - allowing the front-end to create
 * form gen elements that makes it easy for user to enter data. For example, for 'Cultivar' we use a form gen
 * component that allows the user to select crops from a list rather than having to type in the string, making
 * UI less error prone.
 *
 * @param currentFarmPath The farm path for the current user (comes from GlobalSiteFarmSelector - stored
 * in the user object field "currentFarmDefPath").  Ex: sites/SSF2/farms/Tigris.
 */
export function formGenFieldCustomTypeFactory({
  field,
  operation,
  currentFarmPath,
}: {
  field: ProdActions.NestedField;
  operation: ProdActions.Operation;
  currentFarmPath: string;
}) {
  if (!Array.isArray(field.fields) || field.fields.length !== 1) {
    console.error(`field ${field.name} has empty or missing field`);
    return null;
  }

  const customArg = field.fields[0] as ProdActions.FundamentalField;
  const name = customArg.name || 'value';
  const label = field.displayName;

  if ((customArg as ProdActions.Field).type === 'TYPE_MESSAGE') {
    // only support fundamental types here.
    console.error(`Unsupported type ${customArg.type} for field: ${field.typeName}`);
    return null;
  }

  // when field has pre-filled value, disabled the field so user can not change.
  const prefilledArgName = field.name;
  const nameExist = Object.keys(operation.prefilledArgs).includes(prefilledArgName);
  const isDisabled = nameExist && operation.prefilledArgs[prefilledArgName].isDisabled;
  const defaultValue = nameExist ? operation.prefilledArgs[prefilledArgName].value : undefined;
  const now = DateTime.now();

  const currentSiteName = getKindFromPath(currentFarmPath, 'sites');
  const currentFarmName = getKindFromPath(currentFarmPath, 'farms');
  const farmSiteName = `site/farm: ${currentSiteName}/${currentFarmName}`;

  // if TYPE_MESSAGE has explicitly set "isOptional" then use it value otherwise use the value of the nested field.
  const isOptional =
    typeof field.options?.farmosRpc?.isOptional === 'boolean'
      ? field.options.farmosRpc.isOptional
      : customArg?.options?.farmosRpc?.isOptional;
  const validate = isOptional ? yup.string().optional() : yup.string().required();

  switch (field.typeName) {
    case 'plenty.farmos.api.rpc.Label':
      const labelField: FormGen.FieldRadioGroupResourceLabel = {
        type: 'RadioGroupResourceLabel',
        name,
        label,
        default: defaultValue,
        containerType: operation.context?.containerType,
        materialType: operation.context?.materialType,
        existingLabels: operation.context?.existingLabels,
        validate,
        radioProps: { disabled: isDisabled },
      };
      return labelField;

    case 'plenty.farmos.api.rpc.laramie.LarFarmDefMachinePath':
    case 'plenty.farmos.api.rpc.FarmDefPath':
      const locationField: FormGen.FieldAutocompleteFarmDefObject = {
        type: 'AutocompleteFarmDefObject',
        name,
        label,
        default: defaultValue,
        showContainerLocations: true,
        onChange: object => object?.path || '',
        validate,
      };
      return locationField;

    case 'plenty.farmos.api.rpc.Cultivar':
      const cropAutoComplete: FormGen.FieldAutocompleteFarmDefCrop = {
        type: 'AutocompleteFarmDefCrop',
        name,
        label: `${label} (options for ${farmSiteName})`,
        default: defaultValue,
        farmPath: currentFarmPath,
        validate,
        autocompleteProps: { disabled: isDisabled },
      };
      return cropAutoComplete;

    case 'plenty.farmos.api.rpc.Sku':
      const skuAutoComplete: FormGen.FieldAutocompleteFarmDefSku = {
        type: 'AutocompleteFarmDefSku',
        name,
        label: `${label} (options for ${farmSiteName})`,
        default: defaultValue,
        farmPath: currentFarmPath,
        validate,
        autocompleteProps: { disabled: isDisabled },
      };
      return skuAutoComplete;

    case 'plenty.farmos.api.rpc.SkuOfBulkClass':
      const skuOfBulkClassAutoComplete: FormGen.FieldAutocompleteFarmDefSku = {
        type: 'AutocompleteFarmDefSku',
        name,
        label: `${label} (options for ${farmSiteName})`,
        default: defaultValue,
        farmPath: currentFarmPath,
        skuTypeClass: 'Bulk',
        validate,
        autocompleteProps: { disabled: isDisabled },
      };
      return skuOfBulkClassAutoComplete;

    case 'plenty.farmos.api.rpc.SkuOfCaseClass':
      const skuOfCaseClassAutoComplete: FormGen.FieldAutocompleteFarmDefSku = {
        type: 'AutocompleteFarmDefSku',
        name,
        label: `${label} (options for ${farmSiteName})`,
        default: defaultValue,
        farmPath: currentFarmPath,
        skuTypeClass: 'Case',
        validate,
        autocompleteProps: { disabled: isDisabled },
      };
      return skuOfCaseClassAutoComplete;

    case 'plenty.farmos.api.rpc.SkuOfClamshellClass':
      const skuOfClamshellClassAutoComplete: FormGen.FieldAutocompleteFarmDefSku = {
        type: 'AutocompleteFarmDefSku',
        name,
        label: `${label} (options for ${farmSiteName})`,
        default: defaultValue,
        farmPath: currentFarmPath,
        skuTypeClass: 'Clamshell',
        validate,
        autocompleteProps: { disabled: isDisabled },
      };
      return skuOfClamshellClassAutoComplete;

    case 'plenty.farmos.api.rpc.Date':
      const datePicker: FormGen.FieldKeyboardDatePicker = {
        type: 'KeyboardDatePicker',
        name,
        label,
        default: defaultValue ? defaultValue : isOptional ? undefined : now.toFormat(DateTimeFormat.SQL_DATE_ONLY),
        validate: isOptional ? yup.string().noDateTimeError().nullable() : yup.string().required().noDateTimeError(),
        valueFormat: DateTimeFormat.SQL_DATE_ONLY,
        keyboardDatePickerProps: { disabled: isDisabled },
      };
      return datePicker;

    case 'plenty.farmos.api.rpc.GrowLineId':
    case 'plenty.farmos.api.rpc.NumberOfCasesInPalletPartition':
      const textFieldNumber: FormGen.FieldTextField = {
        type: 'TextField',
        name,
        label,
        default: defaultValue,
        validate: getYupNumberValidator(customArg.options, customArg.type, isOptional),
        textFieldProps: { type: 'number', disabled: isDisabled },
      };
      return textFieldNumber;

    case 'plenty.farmos.api.rpc.SerialForContainer':
    case 'plenty.farmos.api.rpc.SerialForTable':
    case 'plenty.farmos.api.rpc.SerialForTote':
    case 'plenty.farmos.api.rpc.SerialForTower':
    case 'plenty.farmos.api.rpc.SerialForTray':
    case 'plenty.farmos.api.rpc.ResourceId':
    case 'plenty.farmos.api.rpc.PackageComponentLotName':
      const textFieldStr: FormGen.FieldTextField = {
        type: 'TextField',
        name,
        label,
        default: defaultValue,
        validate: getYupStringValidator(customArg.options, isOptional, isDisabled),
        textFieldProps: { disabled: isDisabled, multiline: true, maxRows: 5 },
      };
      return textFieldStr;

    case 'plenty.farmos.api.rpc.SerialForTableWithPath': {
      const textFieldRemoteStr: FormGen.FieldTextFieldRemoteHelperText<FarmStateContainer> = {
        type: 'TextFieldRemoteHelperText',
        url: serial => `/api/plentyservice/executive-service/get-container-by-serial/${serial}`,
        name,
        label,
        default: defaultValue,
        renderHelperText: response =>
          `Path: ${getShortenedPath(response.resourceState?.location?.containerLocation?.farmDefPath, false)}`,
        validate: getYupStringValidator(customArg.options, isOptional, isDisabled),
        textFieldProps: { disabled: isDisabled, multiline: true, maxRows: 5 },
      };
      return textFieldRemoteStr;
    }

    case 'plenty.farmos.api.rpc.QrCodeJson':
      const multipleQrCodeJsons: FormGen.FieldTextField = {
        type: 'TextField',
        name,
        label,
        default: defaultValue,
        validate: getYupStringValidator(customArg.options, isOptional, isDisabled),
        addGroupOnNewLineOrReturn: field.repeated,
        inputContainerStyle: { width: '750px' },
        textFieldProps: { disabled: isDisabled, multiline: true, maxRows: 5, autoFocus: true },
      };
      return multipleQrCodeJsons;

    case 'plenty.farmos.api.rpc.EupPropPathSelect':
      function filterLocations(possibleLocations) {
        const propRack1 = 'PropagationRack1';
        const propRack2 = 'PropagationRack2';
        const headTableLift = 'HeadTableLift';
        const mainTable = 'MainTable';

        if (!operation.path.includes(propRack1)) {
          possibleLocations = possibleLocations.filter(possibleLocation => !possibleLocation.includes(propRack1));
        }
        if (!operation.path.includes(propRack2)) {
          possibleLocations = possibleLocations.filter(possibleLocation => !possibleLocation.includes(propRack2));
        }
        if (!operation.path.includes(headTableLift)) {
          possibleLocations = possibleLocations.filter(possibleLocation => !possibleLocation.includes(mainTable));
        }
        return possibleLocations;
      }

      const options =
        customArg.options?.farmosRpc?.values?.length > 0
          ? filterLocations(customArg.options?.farmosRpc?.values)
          : filterLocations(field?.options?.farmosRpc?.values);
      const selectField: FormGen.FieldSelect = {
        type: 'Select',
        name,
        label,
        default: defaultValue,
        options: options || [],
        validate,
        selectProps: { disabled: isDisabled },
      };
      return selectField;

    default:
      // for any field containing a "values" array that has length greater than zero then map to "Select" ui element
      if (customArg.options?.farmosRpc?.values?.length > 0 || field?.options?.farmosRpc?.values?.length > 0) {
        // options can come either from custom arg field or it's
        // parent field: "field". this handles cases such as FarmDefPathSelect
        // where the options are defined in the parent field but this code
        // handles the general case where farm def might want to define
        // options one level up.
        const options =
          customArg.options?.farmosRpc?.values?.length > 0
            ? customArg.options?.farmosRpc?.values
            : field?.options?.farmosRpc?.values;
        const selectField: FormGen.FieldSelect = {
          type: 'Select',
          name,
          label,
          default: defaultValue,
          options: options || [],
          validate,
          selectProps: { disabled: isDisabled },
        };
        return selectField;
      }

      console.error(`Unsupported custom type received: ${field.typeName}`);
      return null;
  }
}
