import React from 'react';

import { ListboxHeader } from '.';

export const dataTestIdsListboxComponent = {
  listbox: 'autocomplete-listbox-component',
};

export const ListboxComponentFactory = (id: string): React.FC<any> =>
  React.memo(
    React.forwardRef(({ children, ...listboxProps }, ref) => {
      return (
        <ul data-testid={dataTestIdsListboxComponent.listbox} ref={ref} {...listboxProps}>
          <ListboxHeader id={id} />
          {children}
        </ul>
      );
    })
  );
