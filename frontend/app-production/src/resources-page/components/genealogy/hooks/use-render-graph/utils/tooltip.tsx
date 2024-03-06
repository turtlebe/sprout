import { Tooltip } from '@plentyag/brand-ui/src/material-ui/core';
import { GlobalStyles } from '@plentyag/brand-ui/src/theme';
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

const ID = 'genealogy-tooltip';

export const removeTooltip = () => {
  const div = document.getElementById(ID);
  if (div) {
    unmountComponentAtNode(div);
    div.remove();
  }
};

export const addTooltip = (element, toolTipContent: JSX.Element) => {
  removeTooltip();
  const div = document.createElement('div');
  div.id = ID;
  document.body.append(div);

  render(
    <GlobalStyles>
      <Tooltip arrow open={true} title={toolTipContent} PopperProps={{ anchorEl: element }}>
        <span />
      </Tooltip>
    </GlobalStyles>,
    div
  );
};
