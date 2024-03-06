import { render } from '@testing-library/react';
import React from 'react';

import { mockGenealogyData } from '../../hooks/use-genealogy/mock-genealogy-data';

import { Legend } from '.';

import { dataTestIds } from './legend-item';

describe('Legend', () => {
  it('renders major events from mock data', () => {
    const { getAllByTestId } = render(<Legend focusedResource={mockGenealogyData} />);
    const items = getAllByTestId(dataTestIds.legendCategory);
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent(
      'Cult Seed Tray' + 'Add Label' + 'CProc Transplant Tower' + 'Load Grow Line' + 'Index' + 'Overlapping Events'
    );
  });

  it('render resource types from mock data', () => {
    const { getAllByTestId } = render(<Legend focusedResource={mockGenealogyData} />);
    const items = getAllByTestId(dataTestIds.legendCategory);
    expect(items).toHaveLength(2);
    expect(items[1]).toHaveTextContent('tray.svgTRAY');
  });
});
