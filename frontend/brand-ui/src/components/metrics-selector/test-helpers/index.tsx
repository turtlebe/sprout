export * from './mocks';

export const addMetric = (index: number) => {
  const element = document.querySelectorAll<HTMLElement>('[data-testid="transfer-list-options"] [role="listitem"]')[
    index
  ];

  if (!element) {
    throw new Error(`no element found with the index: ${index}`);
  }

  element.click();
};

export const removeMetric = (index: number) => {
  const element = document.querySelectorAll<HTMLElement>('[data-testid="transfer-list-selected"] [role="listitem"]')[
    index
  ];

  if (!element) {
    throw new Error(`no element found with the index: ${index}`);
  }

  element.click();
};
