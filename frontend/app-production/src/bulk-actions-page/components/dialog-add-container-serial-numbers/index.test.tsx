import { changeTextArea } from '@plentyag/brand-ui/src/test-helpers';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsDialogAddContainerSerialNumbers as dataTestIds, DialogAddContainerSerialNumbers } from '.';

describe('DialogAddContainerSerialNumbers', () => {
  function renderDialog() {
    const mockCancel = jest.fn();
    const mockAdd = jest.fn();
    const { queryByTestId, debug } = render(<DialogAddContainerSerialNumbers onCancel={mockCancel} onAdd={mockAdd} />);

    return { queryByTestId, mockCancel, mockAdd, debug };
  }

  it('does not add serials when cancel button is clicked', () => {
    const { queryByTestId, mockAdd, mockCancel } = renderDialog();
    queryByTestId(dataTestIds.cancel).click();

    expect(mockCancel).toHaveBeenCalled();
    expect(mockAdd).not.toHaveBeenCalled();
  });

  it('adds serials when add button causes clicked', async () => {
    const { queryByTestId, mockAdd, mockCancel } = renderDialog();

    async function testSerialParse(textInput: string, expectedSerials: string[]) {
      await actAndAwait(() => changeTextArea(dataTestIds.textInput, textInput));
      queryByTestId(dataTestIds.add).click();
      expect(mockCancel).not.toHaveBeenCalled();
      expect(mockAdd).toHaveBeenLastCalledWith(expectedSerials);
    }

    const expectedResult = ['P900-0008480B:L78A-EI4O-VG', 'P900-0008480B:R9R6-WY5F-5W', 'P900-0008480B:SZSY-EVI3-6R'];

    await testSerialParse(
      'P900-0008480B:L78A-EI4O-VG, P900-0008480B:R9R6-WY5F-5W,,P900-0008480B:SZSY-EVI3-6R,,,',
      expectedResult
    );
    await testSerialParse(
      'P900-0008480B:L78A-EI4O-VG P900-0008480B:R9R6-WY5F-5W  P900-0008480B:SZSY-EVI3-6R   ',
      expectedResult
    );
    await testSerialParse(
      'P900-0008480B:L78A-EI4O-VG, P900-0008480B:R9R6-WY5F-5W  P900-0008480B:SZSY-EVI3-6R',
      expectedResult
    );
    await testSerialParse('P900-0008480B:L78A-EI4O-VG, P900-0008480B:R9R6-WY5F-5W  P900-0008480B: SZSY-EVI3-6R', [
      'P900-0008480B:L78A-EI4O-VG',
      'P900-0008480B:R9R6-WY5F-5W',
      'P900-0008480B:',
      'SZSY-EVI3-6R',
    ]);
    await testSerialParse('P900-0008480B:L78A-EI4O-VG, P900-0008480B:R9R6-WY5F-5W  P900-0008480B:,SZSY-EVI3-6R', [
      'P900-0008480B:L78A-EI4O-VG',
      'P900-0008480B:R9R6-WY5F-5W',
      'P900-0008480B:',
      'SZSY-EVI3-6R',
    ]);
    await testSerialParse(
      `P900-0008480B:L78A-EI4O-VG
       P900-0008480B:R9R6-WY5F-5W
       P900-0008480B:SZSY-EVI3-6R`,
      expectedResult
    );
    await testSerialParse(
      `  P900-0008480B:L78A-EI4O-VG,

       P900-0008480B:R9R6-WY5F-5W,
       P900-0008480B:SZSY-EVI3-6R  `,
      expectedResult
    );
  });
});
