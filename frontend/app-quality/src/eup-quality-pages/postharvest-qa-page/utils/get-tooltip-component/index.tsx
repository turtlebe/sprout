import { DialogFormGenTooltip } from '@plentyag/brand-ui/src/components';
import { Typography } from '@plentyag/brand-ui/src/material-ui/core';

export type GetTooltipComponentReturn = (props: FormGen.TooltipProps) => JSX.Element;

export const getTooltipComponent = (title: string, description: string): GetTooltipComponentReturn => {
  return props => (
    <DialogFormGenTooltip {...props} title={title}>
      <Typography>{description}</Typography>
    </DialogFormGenTooltip>
  );
};
