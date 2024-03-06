import { ICellEditor } from '@ag-grid-community/all-modules';
import { dataTestIdsSnackbar } from '@plentyag/brand-ui/src/components/snackbar';
import { render, waitFor } from '@testing-library/react';
import React from 'react';

import { useSaveNotes } from '../../hooks/use-save-notes';

import { dataTestIds, NotesEditor } from './notes-editor';

jest.mock('../../../common/hooks/use-save-notes');

const mockUseSaveNotes = useSaveNotes as jest.Mock;

describe('NotesEditor', () => {
  function mockSaveNotesImpl() {
    function saveNotes(param: { data: any; onSuccess: any; onError: any }) {
      param.onSuccess();
    }
    const isSaving = false;
    return { isSaving, saveNotes };
  }

  mockUseSaveNotes.mockImplementation(mockSaveNotesImpl);

  function renderNotes(apiRef?: React.RefObject<ICellEditor>, stopEditing?: any) {
    const value = {
      notes: 'note',
      labTestSampleId: 'xyz',
      username: 'testuser',
      containerRef: React.createRef<HTMLDivElement>(),
    };
    return render(
      <NotesEditor
        ref={apiRef ? apiRef : React.createRef<ICellEditor>()}
        value={value}
        keyPress={null}
        charPress={null}
        column={undefined}
        colDef={undefined}
        node={undefined}
        data={null}
        rowIndex={0}
        api={null}
        columnApi={null}
        cellStartedEdit={false}
        context={null}
        $scope={null}
        onKeyDown={() => {}}
        stopEditing={stopEditing ? stopEditing : () => {}}
        eGridCell={undefined}
        parseValue={() => {}}
        formatValue={() => {}}
      />
    );
  }

  it('focuses is in textarea after open', async () => {
    const { queryByTestId } = renderNotes();

    const textarea = queryByTestId(dataTestIds.textarea);

    await waitFor(() => expect(textarea).toHaveFocus());
    expect(textarea).toHaveTextContent('note');
  });

  it('closes when clicking cancel', () => {
    const apiRef = React.createRef<ICellEditor>();
    const stopEditingSpy = jest.fn();

    const { queryByTestId } = renderNotes(apiRef, stopEditingSpy);

    const cancelButton = queryByTestId(dataTestIds.cancel);
    cancelButton.click();

    expect(stopEditingSpy).toHaveBeenCalled();
    expect(apiRef.current.isCancelAfterEnd()).toBe(true);
  });

  it('saves and update data when clicking the save button', () => {
    const apiRef = React.createRef<ICellEditor>();
    const stopEditingSpy = jest.fn();
    const { queryByTestId } = renderNotes(apiRef, stopEditingSpy);

    const textarea = queryByTestId(dataTestIds.textarea);
    (textarea as HTMLTextAreaElement).value = 'new text';

    const saveButton = queryByTestId(dataTestIds.save);
    saveButton.click();

    expect(stopEditingSpy).toHaveBeenCalled();
    expect(apiRef.current.getValue().notes).toBe('new text');
    expect(queryByTestId(dataTestIdsSnackbar.snackbar)).not.toBeInTheDocument();
  });

  it('shows a snackbar error when erroring during save', () => {
    function mockSaveNotesImpl() {
      function saveNotes(param: { data: any; onSuccess: any; onError: any }) {
        param.onError();
      }
      const isSaving = false;
      return { isSaving, saveNotes };
    }

    mockUseSaveNotes.mockImplementation(mockSaveNotesImpl);

    const apiRef = React.createRef<ICellEditor>();
    const stopEditingSpy = jest.fn();

    const { queryByTestId } = renderNotes(apiRef, stopEditingSpy);

    const saveButton = queryByTestId(dataTestIds.save);
    saveButton.click();

    expect(stopEditingSpy).not.toHaveBeenCalled();
    expect(queryByTestId(dataTestIdsSnackbar.snackbar)).toBeInTheDocument();
  });
});
