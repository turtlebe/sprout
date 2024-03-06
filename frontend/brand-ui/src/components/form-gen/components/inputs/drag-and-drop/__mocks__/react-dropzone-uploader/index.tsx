import React from 'react';
import { IDropzoneProps } from 'react-dropzone-uploader';

interface Dropzone {
  onChangeStatus: IDropzoneProps['onChangeStatus'];
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const Dropzone: React.FC<Dropzone> = React.forwardRef((props, ref) => {
  const handleClick = () => {
    props.onChangeStatus(null, 'done', []);
  };

  return (
    <button data-testid="button" onClick={handleClick}>
      MockedDropzone
    </button>
  );
});

export default Dropzone;
