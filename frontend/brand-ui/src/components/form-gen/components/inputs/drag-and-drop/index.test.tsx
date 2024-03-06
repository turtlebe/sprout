import { actAndAwait } from '@plentyag/core/src/test-helpers';

import { makeOptions, renderFormGenInputAsync } from '../test-helpers';

import { DragAndDrop } from '.';

jest.mock('react-dropzone-uploader');

const options = makeOptions({
  formGenField: { onRender: jest.fn().mockResolvedValue({}), afterSubmit: jest.fn() },
});

describe('DragAndDrop', () => {
  it('executes a onRender callback', async () => {
    const [, { formGenField }] = await renderFormGenInputAsync(DragAndDrop, options());

    expect(formGenField.onRender).toHaveBeenCalled();
  });

  it('executes a onRender callback', async () => {
    let formikProps;
    const [{ getByTestId }] = await renderFormGenInputAsync(
      DragAndDrop,
      options({ setFormikProps: f => (formikProps = f) })
    );

    const setFieldValue = jest.spyOn(formikProps, 'setFieldValue');

    await actAndAwait(() => getByTestId('button').click());

    expect(setFieldValue).toHaveBeenCalled();
  });
});
