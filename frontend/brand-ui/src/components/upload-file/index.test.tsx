import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';

import { dataTestIdsUploadFile as dataTestIds, UploadFile } from '.';

async function flushPromises(rerender, ui) {
  await actAndAwait(async () => waitFor(() => rerender(ui)));
}

const mockFile = new File(['mock-file'], 'mock-file.txt', { type: 'text/plain' });

function createDtWithFiles(files = []) {
  return {
    dataTransfer: {
      files,
      items: files.map(file => ({
        kind: 'file',
        size: file.size,
        type: file.type,
        getAsFile: () => file,
      })),
      types: ['Files'],
    },
  };
}

const expectBrowseCtaToBeInTheDocument = queryByTestId => {
  expect(queryByTestId(dataTestIds.submit)).not.toBeInTheDocument();
  expect(queryByTestId(dataTestIds.fileName)).not.toBeInTheDocument();
  expect(queryByTestId(dataTestIds.dragAndDrop)).toBeInTheDocument();
  expect(queryByTestId(dataTestIds.upload)).toBeInTheDocument();
};

const expectUploadCtaToBeInTheDocument = queryByTestId => {
  expect(queryByTestId(dataTestIds.submit)).toBeInTheDocument();
  expect(queryByTestId(dataTestIds.fileName)).toHaveTextContent('mock-file.txt');
  expect(queryByTestId(dataTestIds.dragAndDrop)).not.toBeInTheDocument();
  expect(queryByTestId(dataTestIds.upload)).not.toBeInTheDocument();
};

describe('UploadFile', () => {
  it('allows to drag and and drop a file', async () => {
    const onSubmit = jest.fn();
    const uploadButtonTitle = 'Press to Upload';
    const ui = <UploadFile onSubmit={onSubmit} uploadButtonTitle={uploadButtonTitle} />;
    const { queryByTestId, rerender } = render(ui);

    expectBrowseCtaToBeInTheDocument(queryByTestId);

    fireEvent.drop(queryByTestId(dataTestIds.dragAndDrop), createDtWithFiles([mockFile]));

    await flushPromises(rerender, ui);

    expectUploadCtaToBeInTheDocument(queryByTestId);

    // ensure upload button has custom text
    expect(queryByTestId(dataTestIds.submit)).toHaveTextContent(uploadButtonTitle);

    queryByTestId(dataTestIds.submit).click();

    expect(onSubmit).toHaveBeenCalledWith(mockFile);
    expectUploadCtaToBeInTheDocument(queryByTestId);
  });

  it('accepts file that matches "accept" type', async () => {
    const ui = <UploadFile accept={{ 'text/plain': ['.txt'] }} />;
    const { queryByTestId, rerender } = render(ui);

    fireEvent.dragEnter(queryByTestId(dataTestIds.dragAndDrop), createDtWithFiles([mockFile]));

    await flushPromises(rerender, ui);

    expect(queryByTestId(dataTestIds.rejectFileMessage)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.selectFileMessage)).toBeInTheDocument();
  });

  it('rejects file that does not match "accept" type', async () => {
    const ui = <UploadFile accept={{ 'application/pdf': ['.pdf'] }} />;
    const { queryByTestId, rerender } = render(ui);

    fireEvent.dragEnter(queryByTestId(dataTestIds.dragAndDrop), createDtWithFiles([mockFile]));

    await flushPromises(rerender, ui);

    expect(queryByTestId(dataTestIds.rejectFileMessage)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.selectFileMessage)).not.toBeInTheDocument();
  });

  it('aborts uploading a file', async () => {
    const onSubmit = jest.fn();
    const ui = <UploadFile onSubmit={onSubmit} />;
    const { queryByTestId, rerender } = render(ui);

    expectBrowseCtaToBeInTheDocument(queryByTestId);

    fireEvent.drop(queryByTestId(dataTestIds.dragAndDrop), createDtWithFiles([mockFile]));

    await flushPromises(rerender, ui);

    expectUploadCtaToBeInTheDocument(queryByTestId);

    fireEvent.click(queryByTestId(dataTestIds.fileName).querySelector('svg'));

    expectBrowseCtaToBeInTheDocument(queryByTestId);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('calls an onClose callback', () => {
    const onClose = jest.fn();
    const ui = <UploadFile onSubmit={jest.fn()} onClose={onClose} />;
    const { queryByTestId } = render(ui);

    expectBrowseCtaToBeInTheDocument(queryByTestId);

    queryByTestId(dataTestIds.close).click();

    expect(onClose).toHaveBeenCalled();
  });

  it('does not render close button "onClose" callback not provided', () => {
    const { queryByTestId } = render(<UploadFile />);

    expect(queryByTestId(dataTestIds.close)).not.toBeInTheDocument();
  });

  describe('as a controlled component', () => {
    let mockOnSubmit, mockOnSet, mockOnRemove;

    beforeEach(() => {
      mockOnSubmit = jest.fn();
      mockOnSet = jest.fn();
      mockOnRemove = jest.fn();
    });

    afterEach(() => jest.clearAllMocks());

    it('should support taking injected "file" prop and onRemove callback when abort', () => {
      const ui = (
        <UploadFile
          onSubmit={mockOnSubmit}
          uploadButtonTitle={'Press to Upload'}
          file={mockFile}
          onSet={mockOnSet}
          onRemove={mockOnRemove}
        />
      );
      const { queryByTestId } = render(ui);

      // -> expect ready to upload
      expectUploadCtaToBeInTheDocument(queryByTestId);

      // -> click on "delete"
      fireEvent.click(queryByTestId(dataTestIds.fileName).querySelector('svg'));

      // -> should call remove handler
      expect(mockOnRemove).toHaveBeenCalled();
    });

    it('should support taking injected "file" prop and onSubmit callback when submit is clicked', () => {
      const ui = (
        <UploadFile
          onSubmit={mockOnSubmit}
          uploadButtonTitle={'Press to Upload'}
          file={mockFile}
          onSet={mockOnSet}
          onRemove={mockOnRemove}
        />
      );
      const { queryByTestId } = render(ui);

      // -> expect ready to upload
      expectUploadCtaToBeInTheDocument(queryByTestId);

      // -> submit
      queryByTestId(dataTestIds.submit).click();

      // -> should call submit handler
      expect(mockOnSubmit).toHaveBeenCalled();
    });

    it('should support setting "file" prop and onSet callback when set', async () => {
      const ui = (
        <UploadFile
          onSubmit={mockOnSubmit}
          uploadButtonTitle={'Press to Upload'}
          file={null}
          onSet={mockOnSet}
          onRemove={mockOnRemove}
        />
      );
      const { queryByTestId, rerender } = render(ui);

      // -> expect ready to browse
      expectBrowseCtaToBeInTheDocument(queryByTestId);

      // -> add file
      fireEvent.drop(queryByTestId(dataTestIds.dragAndDrop), createDtWithFiles([mockFile]));
      await flushPromises(rerender, ui);

      // -> should call set handler
      expect(mockOnSet).toHaveBeenCalled();
    });
  });
});
