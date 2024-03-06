import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

export const useStyles = makeStyles({
  textField: {
    // disables up/down arrows for input number
    // Chrome, Safari, Edge, Opera
    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
    // Firefox
    '& input[type=number]': {
      '-moz-appearance': 'textfield',
    },

    '& .MuiInputBase-input': {
      textAlign: 'center',
      width: '50px',
      padding: '0.25rem',
    },
  },
});
