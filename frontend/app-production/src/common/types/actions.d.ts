type MethodTypes = import('@plentyag/core/src/farm-def/types').MethodTypes;
declare namespace ProdActions {
  // farm def operation to be displayed and executed by the action form.
  interface Operation {
    path: string; // farm def operation/method path.

    // any arguments for operation that should be pre-filled in the action form.
    // that is, these args are not changeable by the user (e.g., serial of container to trash)
    prefilledArgs: { [name: string]: { isDisabled: boolean; value: any } };

    // provides any data needed in fieldFactory to build form.
    // e.g., resource label extends and provide material/container type.
    context?: any;

    // name of field used by bulk operation. ex: in Trash this would the "serial" field.
    bulkFieldName?: string;
  }

  interface AllowedOperation extends Omit<Operation, 'path'> {
    name: string;
    displayName: string;
  }

  type OperationTypes =
    | 'Add Label'
    | 'Remove Label'
    | 'Cult Seed Tray'
    | 'CProc Transplant Tower'
    | 'Index'
    | 'Load Grow Line'
    | 'Cult Load Prop Line'
    | 'Cult Load Germ Stack'; // more to come.

  // backend data describing operation state before and after an operation.
  export interface OperationDeltaModel {
    id: string;
    type: OperationTypes; // operation that occurred.
    startDt: string;
    endDt: string;
    statesIn: ProdResources.ResourceState[]; // state before operation
    statesOut: ProdResources.ResourceState[]; // state after operation
  }

  interface BaseField {
    displayName: string;
    name: string;
  }

  type FundamentalFieldTypes = 'TYPE_STRING' | 'TYPE_FLOAT' | 'TYPE_INT32' | 'TYPE_UINT32' | 'TYPE_BOOL';

  /**
   * @description Represents a field of an action that is either: string, float, int or bool type.
   */
  interface FundamentalField extends BaseField {
    type: FundamentalFieldTypes;
    options?: Options;
  }

  /**
   * @description Represents a field of an action that can contain futher (nested) fields.
   */
  interface NestedField extends BaseField {
    type: 'TYPE_MESSAGE';
    typeName: string; // proto name.
    fields: Field[];
    repeated?: boolean; // if true, user can add more instances of these fields.
    options?: {
      farmosRpc?: {
        // for cases where fields.length === 1, isOptional here will be applied to nested field.
        // for cases where fields.length is > 1, then isOptional here is ignored. Maybe later this
        // case will be handled - but for now this is not needed and would require substantional changes.
        isOptional?: boolean;
        values?: string[];
      };
    };
  }

  /**
   * @description Represents an enum field of an action.
   */
  interface EnumField extends BaseField {
    type: 'TYPE_ENUM';
    typeName: string; // proto name
    enumOptions: {
      name: string; // local proto name
      reservedName?: any[];
      reservedRange?: any[];
      value: { name: string; number: number }[];
    };
    repeated?: boolean; // if true, user can add more instances of these fields.
    options?: Options;
  }

  type Field = NestedField | EnumField | FundamentalField;

  /**
   * @description Model for action - read from backend data - contains details (fields) neceesaary
   * to execute an action.
   */
  interface ActionModel {
    name: string;
    description: string;
    actionType?: MethodTypes;
    fields: Field[];
  }

  // additional details from backend about a field.
  interface Options {
    farmosRpc: {
      description?: string; // field description
      example?: string[]; // array of argumentexamples to show user when error occurs
      values?: string[]; // array of possible values - for items that are bound list of strings. ex: GermStackId
      isOptional?: boolean;
    };
    rules?: StringRules | Int32Rules | UInt32Rules | FloatRules;
  }

  // rules below reflect what is currently used in farm-def method proto (ropc2).
  // complete list of possible (future) here: https://github.com/envoyproxy/protoc-gen-validate

  interface StringRules {
    string: {
      pattern?: string; // regex for validation.
      maxLen?: string; // number - max length of string.
    };
  }

  interface NumberRules {
    gt?: number; // must be greater than.
    gte?: number; // must be greater than or equal.
    lte?: number; // must be less than or equal.
    lt?: number; // must be less than.
  }

  interface UInt32Rules {
    uint32: NumberRules;
  }
  interface Int32Rules {
    int32: NumberRules;
  }

  interface FloatRules {
    float: NumberRules;
  }
}
