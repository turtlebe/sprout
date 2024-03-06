import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

import { CropSkuCardItem } from './index';

interface StyleProps {
  value?: CropSkuCardItem['value'];
}

export const useStyles = makeStyles(() => ({
  textField: {
    fontStyle: (props: StyleProps) => (!props.value ? 'italic' : 'normal'),
  },
}));
