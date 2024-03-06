import { convertUrlToFile } from '@plentyag/core/src/utils/convert-url-to-file';
import { axiosRequest } from '@plentyag/core/src/utils/request';
import { forEach, map, set } from 'lodash';
import { IFileWithMeta } from 'react-dropzone-uploader';

const uploadImageToS3 = async (fileWithMeta: IFileWithMeta, s3PresignedUrl: S3PresignedPostUrl) => {
  const form = new FormData();

  // copy AWS Credentials
  forEach(s3PresignedUrl.presignedPostData.fields, (value, key) => form.append(key, value));

  // add file
  form.append('file', fileWithMeta.file);

  // upload to S3
  return axiosRequest({
    method: 'POST',
    url: s3PresignedUrl.presignedPostData.url,
    data: form,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const uploadImagesToS3: FormGen.FieldDragAndDrop['afterSubmit'] = async (
  filesWithMeta: IFileWithMeta[],
  response: any
) => {
  if (!filesWithMeta) {
    return;
  }

  const { id: seedlingQaId } = response;
  const filenames = filesWithMeta.map(fileWithMeta => fileWithMeta.file.name);

  const presignedPostUrls = await axiosRequest<CreatePresignedPostUrls>({
    method: 'POST',
    url: `/api/quality/seedling/${seedlingQaId}/presigned-post-urls`,
    data: { filenames },
  });

  return Promise.all(
    presignedPostUrls.data.s3PresignedPostUrls.map(
      async (s3PresignedUrl, index) => await uploadImageToS3(filesWithMeta[index], s3PresignedUrl)
    )
  );
};

export const downloadImagesFromS3: FormGen.FieldDragAndDrop['onRender'] = async (
  formGenField,
  formikContext: FormikProps<SeedlingQA.Model>
) => {
  const { id } = formikContext.values;

  if (!id) {
    return;
  }

  const { data } = await axiosRequest<CreatePresignedGetUrls>({
    method: 'POST',
    url: `/api/quality/seedling/${id}/presigned-get-urls`,
  });

  if (data?.s3PresignedGetUrls) {
    await Promise.all(
      map(data.s3PresignedGetUrls, async s3SignedUrl => {
        const file = await convertUrlToFile(s3SignedUrl.filename, s3SignedUrl.url);
        set(file, 'downloadedFromS3', true);
        return file;
      })
    )
      .then(files => {
        formikContext.setFieldValue(formGenField.name, files);
      })
      .catch(error => {
        throw error;
      });
  }
};
