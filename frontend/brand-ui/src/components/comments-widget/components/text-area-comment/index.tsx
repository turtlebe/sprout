import { Send } from '@material-ui/icons';
import { Show } from '@plentyag/brand-ui/src/components/show';
import { Box, Button, TextField, TextFieldProps } from '@plentyag/brand-ui/src/material-ui/core';
import { Comment } from '@plentyag/core/src/types';
import { getScopedDataTestIds, isKeyPressed } from '@plentyag/core/src/utils';
import React from 'react';

const dataTestIds = getScopedDataTestIds(
  {
    textarea: 'textarea',
    submit: 'submit',
    cancel: 'cancel',
  },
  'TextAreaComment'
);

export { dataTestIds as dataTestIdsTextAreaComment };

export const getTextAreaCommentDataTestIds = (prefix = '') => getScopedDataTestIds(dataTestIds, prefix);

export interface TextAreaComment {
  comment: Comment;
  onChange: (comment: Comment) => void;
  onSubmit: (comment: Comment) => void;
  onCancel?: () => void;
  disabled?: boolean;
  'data-testid'?: string;
}

export const TextAreaComment: React.FC<TextAreaComment> = ({
  onSubmit,
  onChange,
  onCancel,
  disabled,
  comment,
  'data-testid': dataTestId,
}) => {
  const dataTestIdsWithPrefix = getTextAreaCommentDataTestIds(dataTestId);
  const [keyPressed, setKeyPressed] = React.useState<React.KeyboardEvent<HTMLDivElement>>();
  const [isMetaDown, setIsMetaDown] = React.useState<boolean>(false);
  const inputRef = React.useRef<HTMLInputElement>();

  function handleSubmit() {
    onSubmit(comment);
  }

  const handleChange: TextFieldProps['onChange'] = e => {
    onChange({ ...comment, content: e.currentTarget.value });
  };

  const handleKeyDown: TextFieldProps['onKeyDown'] = keyEvent => {
    setKeyPressed(keyEvent);

    const { isMetaPressed } = isKeyPressed(keyEvent);

    if (isMetaPressed) {
      setIsMetaDown(true);
    }
  };

  const handleKeyUp: TextFieldProps['onKeyUp'] = keyEvent => {
    setKeyPressed(keyEvent);

    const { isMetaPressed } = isKeyPressed(keyEvent);

    if (isMetaPressed) {
      setIsMetaDown(false);
    }
  };

  React.useEffect(() => {
    if (isMetaDown && keyPressed) {
      const { isEnterPressed } = isKeyPressed(keyPressed);

      if (isEnterPressed) {
        handleSubmit();
      }
    }
  }, [isMetaDown, keyPressed]);

  const isDisabled = disabled || comment.content === '';

  React.useEffect(() => {
    if (!disabled) {
      // re-focus when the input becsome enabled again
      inputRef?.current?.focus();
    }
  }, [disabled]);

  return (
    <Box display="flex" flexDirection="column" gridGap="0.5rem">
      <TextField
        multiline
        variant="outlined"
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        value={comment.content}
        onChange={handleChange}
        disabled={disabled}
        data-testid={dataTestIdsWithPrefix.textarea}
        inputRef={ref => (inputRef.current = ref)}
      />
      <Box alignSelf="end" display="flex" gridGap="0.5rem">
        <Show when={Boolean(onCancel)}>
          <Button color="default" onClick={onCancel} disabled={isDisabled} data-testid={dataTestIdsWithPrefix.cancel}>
            Cancel
          </Button>
        </Show>
        <Button
          color="primary"
          variant="contained"
          startIcon={<Send />}
          onClick={handleSubmit}
          disabled={isDisabled}
          data-testid={dataTestIdsWithPrefix.submit}
        >
          {onCancel ? 'Update' : 'Post'}
        </Button>
      </Box>
    </Box>
  );
};
