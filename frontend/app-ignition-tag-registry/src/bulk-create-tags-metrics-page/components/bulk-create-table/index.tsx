import { useUnitConversion } from '@plentyag/app-environment/src/common/hooks';
import { useTagsFormGenConfig } from '@plentyag/app-ignition-tag-registry/src/common/hooks';
import { Tag } from '@plentyag/app-ignition-tag-registry/src/common/types';
import { BaseForm } from '@plentyag/brand-ui/src/components';
import { FormStateContext } from '@plentyag/brand-ui/src/components/form-gen/hooks/use-form-state-context';
import { Button } from '@plentyag/brand-ui/src/material-ui/core';
import useCoreStore from '@plentyag/core/src/core-store';
import { Metric } from '@plentyag/core/src/types/environment';
import { axiosRequest, parseErrorMessage } from '@plentyag/core/src/utils';
import React from 'react';

import { serializeMetric, serializeTag } from '../../../common/utils';
import { DialogCreateMultipleTags } from '../dialog-create-multiple-tags';

import { useStyles } from './styles';

export const FDS_TAG_ALREADY_EXISTS = 'This tag with the specified path, tag provider and tag path already exists';
export const EVS_METRIC_ALREADY_EXISTS = 'This Metric already exists';

function key(index: number): string {
  return `tags[${index}]`;
}

interface FormState {
  [name: string]: FormGen.FieldState;
}

const dataTestIds = {
  addMultipleTags: 'add-multiple-tags',
  dialog: 'add-multiple-tags-dialog',
};

export { dataTestIds as dataTestIdsBulkCreateTable };

export const BulkCreateTable: React.FC = () => {
  const classes = useStyles({});
  const [coreStore] = useCoreStore();
  const formGenConfig = useTagsFormGenConfig({ username: coreStore.currentUser.username });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isDoneBulkCreating, setIsDoneBulkCreating] = React.useState<boolean>(false);
  const [formState, setFormState] = React.useState<FormState>({});
  const [groupValues, setGroupValues] = React.useState([]);
  const [open, setOpen] = React.useState<boolean>(false);
  const getFieldState: FormStateContext['getFieldState'] = React.useCallback(name => formState[name], [formState]);
  const setFieldState: FormStateContext['setFieldState'] = React.useCallback(
    (name, newFieldState) => {
      setFormState(previousValue => ({ ...previousValue, [name]: newFieldState }));
      setIsDoneBulkCreating(false);
    },
    [formState]
  );
  const { convertToDefaultUnit } = useUnitConversion();

  const handleSubmit: BaseForm['onSubmit'] = (values: any) => {
    const { tags } = values;
    setIsLoading(true);

    void Promise.all(
      Array.from(tags).map(async (rowValue, groupIndex) => {
        const currentState = getFieldState(key(groupIndex));
        if (currentState?.isPersisted) {
          // If the record has already been marked as submitted we don't try to submit this Tag/Metric again.
          return;
        }

        // Mark the row as loading.
        setFieldState(key(groupIndex), { isLoading: true });

        // Create the Tag
        try {
          await axiosRequest<Tag>({
            method: 'POST',
            url: '/api/swagger/farm-def-service/tags-api/create-tag',
            data: serializeTag(rowValue, { username: coreStore.currentUser.username }),
          });
        } catch (response) {
          const error = parseErrorMessage(response);

          // Ignore the error if the Tag is already created.
          if (!error.toLocaleLowerCase().includes(FDS_TAG_ALREADY_EXISTS.toLocaleLowerCase())) {
            setFieldState(key(groupIndex), { isLoading: false, error });
            return error;
          }
        }

        // Create the Metric
        if (rowValue['min'] && rowValue['max']) {
          try {
            await axiosRequest<Metric>({
              method: 'POST',
              url: '/api/swagger/environment-service/metrics-api/create-metric',
              data: serializeMetric(rowValue, { username: coreStore.currentUser.username, convertToDefaultUnit }),
            });
          } catch (response) {
            const error = parseErrorMessage(response);

            // Ignore the error if the Metric is already created.
            if (!error.toLocaleLowerCase().includes(EVS_METRIC_ALREADY_EXISTS.toLocaleLowerCase())) {
              setFieldState(key(groupIndex), { isLoading: false, error });
              return error;
            }
          }
        }

        // Mark the row as not loading and persisted.
        setFieldState(key(groupIndex), { isLoading: false, isPersisted: true });
      })
    )
      .then(responses => {
        if (responses.filter(response => response).length === 0) {
          // when no errors happened, this responses array is empty.
          setIsDoneBulkCreating(true);
        }
      }) // When everything went well, mark the bulk creation as done.
      .finally(() => setIsLoading(false)); // Disable global loading state.
  };

  const handleAddMultiTags = React.useCallback(
    value => {
      const newValues = value.tagPath.map(path => ({ ...value, tagPath: path }));
      setGroupValues([...groupValues, ...newValues]);
    },
    [groupValues]
  );

  const updateGroupValues = React.useCallback(
    value => {
      setGroupValues(value);
    },
    [setGroupValues]
  );

  return (
    <React.Fragment>
      <FormStateContext.Provider value={{ getFieldState, setFieldState, updateGroupValues, groupValues }}>
        <BaseForm
          isUpdating={false}
          isLoading={isLoading}
          isSubmitDisabled={isDoneBulkCreating}
          onSubmit={handleSubmit}
          formGenConfig={formGenConfig}
          layout="groupRow"
          classes={classes}
        />
        <Button
          data-testid={dataTestIds.addMultipleTags}
          variant="contained"
          color="secondary"
          children={'Add Multiple Tags'}
          onClick={() => setOpen(true)}
          className={classes.multiTagAddButton}
        />
      </FormStateContext.Provider>
      <DialogCreateMultipleTags
        open={open}
        onClose={() => setOpen(false)}
        dataTestId={dataTestIds.dialog}
        handleAddMultiTags={handleAddMultiTags}
      />
    </React.Fragment>
  );
};
