import {
  changeTextArea,
  getTextAreaByName,
  keyDownInTextArea,
  keyUpInTextArea,
} from '@plentyag/brand-ui/src/test-helpers';
import { buildComment } from '@plentyag/core/src/test-helpers/mocks';
import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsTextAreaComment as dataTestIds, TextAreaComment } from '.';

const classDisabled = 'Mui-disabled';
const onChange = jest.fn();
const onSubmit = jest.fn();
const onCancel = jest.fn();

describe('TextAreaComment', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders as disabled when disabled is passed', () => {
    const comment = buildComment({});

    const { queryByTestId } = render(
      <TextAreaComment comment={comment} onChange={onChange} onSubmit={onSubmit} disabled />
    );

    expect(queryByTestId(dataTestIds.cancel)).not.toBeInTheDocument();
    expect(getTextAreaByName(dataTestIds.textarea)).toHaveClass(classDisabled);
    expect(queryByTestId(dataTestIds.submit)).toHaveClass(classDisabled);
  });

  it('disables the submit when the content is empty', () => {
    const comment = buildComment({ content: '' });

    const { queryByTestId } = render(<TextAreaComment comment={comment} onChange={onChange} onSubmit={onSubmit} />);

    expect(queryByTestId(dataTestIds.cancel)).not.toBeInTheDocument();
    expect(getTextAreaByName(dataTestIds.textarea)).not.toHaveClass(classDisabled);
    expect(queryByTestId(dataTestIds.submit)).toHaveClass(classDisabled);
  });

  it('updates the comment', () => {
    const comment = buildComment({});
    const content = comment.content + ' Edited';

    render(<TextAreaComment comment={comment} onChange={onChange} onSubmit={onSubmit} />);

    expect(onChange).toHaveBeenCalledTimes(0);

    expect(getTextAreaByName(dataTestIds.textarea)).toHaveValue(comment.content);

    changeTextArea(dataTestIds.textarea, content);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({ ...comment, content });
  });

  it('submits the comment', () => {
    const comment = buildComment({});

    const { queryByTestId } = render(<TextAreaComment comment={comment} onChange={onChange} onSubmit={onSubmit} />);

    expect(onSubmit).toHaveBeenCalledTimes(0);

    expect(getTextAreaByName(dataTestIds.textarea)).toHaveValue(comment.content);

    queryByTestId(dataTestIds.submit).click();

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith(comment);
  });

  it('submits the comment when hitting Meta+Enter', () => {
    const comment = buildComment({});

    const { queryByTestId } = render(<TextAreaComment comment={comment} onChange={onChange} onSubmit={onSubmit} />);

    expect(onSubmit).toHaveBeenCalledTimes(0);

    expect(getTextAreaByName(dataTestIds.textarea)).toHaveValue(comment.content);
    expect(queryByTestId(dataTestIds.submit)).not.toHaveClass(classDisabled);

    keyDownInTextArea(dataTestIds.textarea, 93); // Meta
    keyDownInTextArea(dataTestIds.textarea, 13); // Enter

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith(comment);
  });

  it('does not submit the comment when releasing Meta before Enter', () => {
    const comment = buildComment({});

    render(<TextAreaComment comment={comment} onChange={onChange} onSubmit={onSubmit} />);

    expect(onSubmit).toHaveBeenCalledTimes(0);

    keyDownInTextArea(dataTestIds.textarea, 93); // Meta down
    keyUpInTextArea(dataTestIds.textarea, 93); // Meta up
    keyDownInTextArea(dataTestIds.textarea, 13); // Enter

    expect(onSubmit).toHaveBeenCalledTimes(0);
  });

  it('calls `onCancel`', () => {
    const comment = buildComment({});

    const { queryByTestId } = render(
      <TextAreaComment comment={comment} onChange={onChange} onSubmit={onSubmit} onCancel={onCancel} />
    );

    expect(queryByTestId(dataTestIds.cancel)).toBeInTheDocument();

    expect(onCancel).toHaveBeenCalledTimes(0);

    queryByTestId(dataTestIds.cancel).click();

    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
