import { fireEvent } from '@testing-library/react';

/**
 * Helper to expand/collapse a MUI accordion element.
 */
export function toggleAccordion(accordionRootElement: HTMLElement) {
  const accordionButton = accordionRootElement.querySelectorAll('[role="button"]');
  expect(accordionButton).toHaveLength(1);
  fireEvent.click(accordionButton[0]);
}
