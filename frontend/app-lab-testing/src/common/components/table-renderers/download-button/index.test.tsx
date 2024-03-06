import { render } from '@testing-library/react';
import React from 'react';

import { DownloadButton } from '.';

import { dataTestIds as buttonDataTestIds } from './download-item-button';
import { dataTestIds as resultDialogDataTestIds } from './download-items-dialog';

describe('DownloadButton', () => {
  it('by default dialog should not be shown', () => {
    const containerRef = React.createRef<HTMLDivElement>();
    const metadata = [{ uuid: 'id1', date: new Date() }];
    const { queryByTestId } = render(
      <DownloadButton containerRef={containerRef} downloadMetaData={metadata} buttonText="test" />
    );
    expect(queryByTestId(resultDialogDataTestIds.dialog)).not.toBeInTheDocument();
  });

  it('With single item to download clicking button should not open dialog', () => {
    const containerRef = React.createRef<HTMLDivElement>();
    const metadata = [{ uuid: 'id1', date: new Date() }];
    const { queryByTestId } = render(
      <DownloadButton containerRef={containerRef} downloadMetaData={metadata} buttonText="test" />
    );
    const button = queryByTestId(buttonDataTestIds.button);
    button && button.click();
    expect(queryByTestId(resultDialogDataTestIds.dialog)).not.toBeInTheDocument();
  });

  it('With multiple items to download clicking button should open dialog', () => {
    const containerRef = React.createRef<HTMLDivElement>();
    const metadata = [
      { uuid: 'id1', date: new Date() },
      { uuid: 'id2', date: new Date() },
    ];
    const { queryByTestId } = render(
      <DownloadButton containerRef={containerRef} downloadMetaData={metadata} buttonText="test" />
    );

    const button = queryByTestId(buttonDataTestIds.button);
    button && button.click();
    expect(queryByTestId(resultDialogDataTestIds.dialog)).toBeInTheDocument();
  });
});
