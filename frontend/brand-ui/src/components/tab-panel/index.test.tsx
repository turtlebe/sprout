import { render } from '@testing-library/react';
import React from 'react';

import { TabPanel } from './index';

describe('TabPanel', () => {
  const renderTabPanel = (value: string, index: string) => {
    return render(
      <TabPanel value={value} index={index}>
        <div data-testid="test-comp">test</div>
      </TabPanel>
    );
  };
  it('will render nothing if index and value do not match', () => {
    const { queryByTestId } = renderTabPanel('1', '2');
    expect(queryByTestId('test-comp')).not.toBeInTheDocument();
  });

  it('will render if value and index match', () => {
    const { queryByTestId } = renderTabPanel('1', '1');
    expect(queryByTestId('test-comp')).toBeInTheDocument();
  });
});
