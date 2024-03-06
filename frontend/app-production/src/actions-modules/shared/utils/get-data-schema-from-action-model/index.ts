import {
  getYupNumberValidator,
  getYupStringValidator,
} from '@plentyag/app-production/src/actions-form-page/utils/yup-validators';
import { SUBMISSION_METHOD_DEFAULT, SUBMISSION_METHOD_IGNITION_CONTEXT } from '@plentyag/core/src/utils';
import { lazy, object, string, TestOptions } from 'yup';

export const getDataSchemaFromActionModel = (
  actionModel: ProdActions.ActionModel,
  additionalValidation?: TestOptions<Record<string, any>>
) => {
  const data = (actionModel?.fields || []).reduce((acc, field: ProdActions.Field) => {
    const fieldName = field.name;
    const isOptional = field.options?.farmosRpc?.isOptional;

    switch (field.type) {
      case 'TYPE_MESSAGE': {
        field.fields.forEach(nestedField => {
          if (nestedField.name === 'value') {
            const fieldType = nestedField.type;
            switch (fieldType) {
              case 'TYPE_STRING': {
                const values = nestedField.options?.farmosRpc?.values || [];

                acc[fieldName] = lazy((fieldValue: { value: string } | {}) => {
                  return fieldValue && (fieldValue as { value: string })?.value
                    ? object({
                        value: getYupStringValidator(
                          nestedField.options as ProdActions.Options,
                          isOptional,
                          false
                        ).oneOf(values),
                      }).required()
                    : object({}).required();
                });
              }
            }
          }
        });
        break;
      }
      case 'TYPE_INT32': {
        acc[fieldName] = getYupNumberValidator(field.options, field.type, isOptional);
        break;
      }
    }

    return acc;
  }, {});

  const schema = object({
    ...data,
    submitter: string(),
    submission_method: string().oneOf([SUBMISSION_METHOD_DEFAULT, SUBMISSION_METHOD_IGNITION_CONTEXT]).required(),
  });

  return additionalValidation ? schema.test(additionalValidation) : schema;
};
