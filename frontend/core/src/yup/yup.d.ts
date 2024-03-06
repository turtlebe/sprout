// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ArraySchema, MixedSchema, NotRequiredArraySchema, NumberSchema } from 'yup';

import {
  ValidateRadioGridValuesOptions,
  ValidateTextFieldGridValuesOptions,
  ValidateTextFieldGridValuesUsingFunctionOpitons,
} from './extension';

declare module 'yup' {
  interface MixedSchema {
    requireSeedlingTableColumn(columnDefField: string): MixedSchema;
    validateRadioGridValues(options: ValidateRadioGridValuesOptions);
    validateTextFieldGridValues(options: ValidateTextFieldGridValuesOptions): MixedSchema;
    validateTextFieldGridValuesUsingFunction(options: ValidateTextFieldGridValuesUsingFunctionOpitons): MixedSchema;
    validateDragAndDrop(): MixedSchema;
  }

  interface StringSchema {
    noMomentError(): StringSchema; // @deprecated
    noDateTimeError(): StringSchema;
    noFutureDateTime(): StringSchema;
  }

  interface NumberSchema {
    cropTargetRatio(targets: number[]): NumberSchema;
  }

  interface NotRequiredArraySchema {
    tupleOf<T>(schemas: yup.Schema<T>[]): NotRequiredArraySchema<T>;
  }

  interface ArraySchema {
    tupleOf<T>(schemas: yup.Schema<T>[]): ArraySchema<T>;
  }
}
