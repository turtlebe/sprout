import { Show } from '@plentyag/brand-ui/src/components';
import { Box, Button, Drawer } from '@plentyag/brand-ui/src/material-ui/core';
import React, { useState } from 'react';

import { EditLoadedAt } from './components/edit-loaded-at';
import { useStyles } from './styles';
import { getEditableLoadAtAttributes } from './utils/get-editable-loaded-at-attributes';

const dataTestIds = {
  root: 'edit-resource-root',
  drawer: 'edit-resource-drawer',
  loadedAtButton: 'edit-resource-loaded-at-button',
};

export { dataTestIds as dataTestIdsEditResource };

export interface EditResource {
  resourceState: ProdResources.ResourceState;
  onClose: () => void;
}

enum EditContexts {
  LOADED_AT = 'loadedAt',
}

export const EditResource: React.FC<EditResource> = ({ resourceState, onClose }) => {
  const editableAttributes = getEditableLoadAtAttributes(resourceState);
  const isLoadedAtEditable = editableAttributes?.length > 0;

  const classes = useStyles();
  const [editContext, setEditContext] = useState(null);

  const handleEdit = (selectedEditContext: EditContexts) => {
    setEditContext(selectedEditContext);
  };

  const handleCloseEditForm = () => {
    setEditContext(null);
    onClose();
  };

  return (
    <Box display="flex" alignItems="right" flexWrap="wrap" justifyContent="flex-end" data-testid={dataTestIds.root}>
      <Show when={isLoadedAtEditable}>
        <Button
          data-testid={dataTestIds.loadedAtButton}
          className={classes.button}
          variant="contained"
          color="default"
          onClick={() => handleEdit(EditContexts.LOADED_AT)}
        >
          Edit Loaded At Date
        </Button>
      </Show>
      <Drawer data-testid={dataTestIds.drawer} anchor="right" open={Boolean(editContext)} onClose={handleCloseEditForm}>
        <Show when={editContext === EditContexts.LOADED_AT}>
          <EditLoadedAt resourceState={resourceState} onClose={handleCloseEditForm} />
        </Show>
      </Drawer>
    </Box>
  );
};
