import { CircularProgress, FormHelperText } from '@plentyag/brand-ui/src/material-ui/core';
import { cloneDeep } from 'lodash';
import React from 'react';
import Dropzone, { IDropzoneProps } from 'react-dropzone-uploader';

import { useFormikProps } from '../hooks/use-formik-props';
import { memoWithFormikProps } from '../memo-with-formik-props';

import * as Styled from './styles';

const defaultMinSizeBytes = 10240; // 10KB
const defaultOneMBInBytes = 1048576;
const defaultMaxSizeBytes = defaultOneMBInBytes * 15; // eslint-disable-line @typescript-eslint/no-magic-numbers
const defaultMaxFiles = 1;
const defaultInputContent = 'Add Image\n Drag & drop or click here';
const defaultAccept = 'image/*';

export const DragAndDrop = memoWithFormikProps<FormGen.FieldDragAndDrop>(({ formGenField, formikProps, className }) => {
  const refDropzone = React.useRef(null);
  Styled.useStyles({});
  const { value = [], error, name } = useFormikProps(formikProps, formGenField);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleChangeStatus: IDropzoneProps['onChangeStatus'] = (fileWithMeta, status, allFilesWithMeta) => {
    if (status === 'removed') {
      formikProps.setFieldValue(name, cloneDeep(allFilesWithMeta.filter(file => file !== fileWithMeta)));
    }

    // dedup older files with same name
    if (status === 'preparing') {
      allFilesWithMeta
        .filter(
          file =>
            file !== fileWithMeta &&
            file.file.name === fileWithMeta.file.name &&
            file.file.lastModified >= fileWithMeta.file.lastModified
        )
        .forEach(file => file && file.remove());
    }

    if (status === 'done') {
      if (allFilesWithMeta.length) {
        formikProps.setFieldError(name, undefined);
      }
      formikProps.setFieldValue(name, cloneDeep(allFilesWithMeta));
    }
  };

  React.useEffect(() => {
    if (formGenField.onRender) {
      setIsLoading(true);
      formGenField.onRender(formGenField, formikProps).finally(() => setIsLoading(false));
    }
  }, [formGenField.onRender, formikProps.initialValues]);

  return (
    <div className={className}>
      <Dropzone
        ref={refDropzone}
        {...(Boolean(value[0] && !value[0].meta) && {
          initialFiles: value,
        })}
        multiple
        maxFiles={defaultMaxFiles}
        minSizeBytes={defaultMinSizeBytes}
        maxSizeBytes={defaultMaxSizeBytes}
        inputContent={isLoading ? <CircularProgress key="circular-progress" /> : defaultInputContent}
        accept={defaultAccept}
        styles={Styled.styles}
        {...formGenField.dropzoneUploaderProps}
        /**
         * @note placing props after default values to enable overrides
         */
        onChangeStatus={handleChangeStatus}
      />
      {error && <FormHelperText error={Boolean(error)}>{error}</FormHelperText>}
    </div>
  );
});
