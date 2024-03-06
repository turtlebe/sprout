import { render } from '@testing-library/react';
import React from 'react';

import { mockPropLoadCompletedPlan } from '../../../workcenters-page/test-helpers';

import { dataTestIdsSummary as dataTestIds, SummaryView } from '.';

describe('SummaryView', () => {
  it('shows no summary view list when summary not provided', () => {
    const { queryByTestId } = render(<SummaryView summary={undefined} />);

    expect(queryByTestId(dataTestIds.listRoot)).not.toBeInTheDocument();
  });

  it('shows summary view list', () => {
    const mockSummary = mockPropLoadCompletedPlan.plan.summary;
    const { queryByTestId, queryAllByTestId } = render(<SummaryView summary={mockSummary} />);

    expect(queryByTestId(dataTestIds.listRoot)).toBeInTheDocument();

    const summary = queryAllByTestId(dataTestIds.summaryText);
    expect(summary).toHaveLength(2);
    summary.forEach((summaryItem, index) => expect(summaryItem).toHaveTextContent(mockSummary[index].description));

    expect(queryByTestId(dataTestIds.singleLineSummary)).not.toBeInTheDocument();
  });

  it('shows single line for summary view when summary data has only one item', () => {
    const mockSummary = mockPropLoadCompletedPlan.plan.summary[0];
    const { queryByTestId } = render(<SummaryView summary={[mockSummary]} />);

    const singleLineSummary = queryByTestId(dataTestIds.singleLineSummary);
    expect(singleLineSummary).toBeInTheDocument();
    expect(singleLineSummary).toHaveTextContent(mockSummary.description);
  });
});
