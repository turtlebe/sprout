import { render } from '@testing-library/react';
import React from 'react';

import { ButtonsSaveCancel, dataTestIdsButtonsSaveCancel as dataTestIds } from '.';

const onSave = jest.fn();
const onCancel = jest.fn();

function renderButtonsSaveCancel() {
  return render(<ButtonsSaveCancel onSave={onSave} onCancel={onCancel} />);
}

describe('ButtonsSaveCancel', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('calls `onSave`', () => {
    const { queryByTestId } = renderButtonsSaveCancel();

    expect(onSave).not.toHaveBeenCalled();
    expect(onCancel).not.toHaveBeenCalled();

    queryByTestId(dataTestIds.save).click();

    expect(onSave).toHaveBeenCalled();
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('calls `onCancel`', () => {
    const { queryByTestId } = renderButtonsSaveCancel();

    expect(onSave).not.toHaveBeenCalled();
    expect(onCancel).not.toHaveBeenCalled();

    queryByTestId(dataTestIds.cancel).click();

    expect(onSave).not.toHaveBeenCalled();
    expect(onCancel).toHaveBeenCalled();
  });
});
