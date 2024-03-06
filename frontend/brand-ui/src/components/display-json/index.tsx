import { Info } from '@material-ui/icons';
import { DialogDisplayJson } from '@plentyag/brand-ui/src/components';
import { IconButton } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

const dataTestIds = {
  button: 'display-json-button',
  dialog: 'display-json-dialog',
};

export { dataTestIds as dataTestIdsDisplayJson };

export interface DisplayJson {
  title: string;
  json: any;
}

/**
 * Component that renders a JSON object into a modal upon click on a CTA.
 */
export const DisplayJson: React.FC<DisplayJson> = ({ json, title }) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  return (
    <>
      <IconButton
        onClick={() => setIsOpen(true)}
        size="small"
        color="default"
        icon={Info}
        data-testid={dataTestIds.button}
      />
      <DialogDisplayJson
        title={title}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        jsonObject={json}
        data-testid={dataTestIds.dialog}
      />
    </>
  );
};
