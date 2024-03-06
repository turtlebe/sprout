import { TooltipProps } from '@plentyag/brand-ui/src/material-ui/core';

export const dataTestIdsFakeTooltipTitle = {
  title: 'fake-tooltip-title',
};

jest.mock('@material-ui/core/Tooltip', () => {
  // fake tooltip that we can query to make sure "title" data is getting set properly.
  const FakeTooltip: React.FC<TooltipProps> = ({ title, children }) => {
    return (
      <div>
        <div data-testid="fake-tooltip-title">{title}</div>
        {children}
      </div>
    );
  };
  return { __esModule: true, default: FakeTooltip, Tooltip: FakeTooltip };
});
