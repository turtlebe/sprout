import { dataTestIdBaseFormSubmit } from '@plentyag/brand-ui/src/constants';
import { DateTimeFormat, getLuxonDateTime } from '@plentyag/core/src/utils';
import { fireEvent } from '@testing-library/react';

export function getFormGenFieldElementByName(name: string): HTMLElement | null {
  return document.querySelector<HTMLElement>(`[data-testid="${name}"]`);
}

export function getInputByName(name: string): HTMLInputElement | null {
  return document.querySelector<HTMLInputElement>(`[data-testid="${name}"] input`);
}

export function getInputByNameAndValue(name: string, value: string): HTMLInputElement | null {
  return document.querySelector<HTMLInputElement>(`[data-testid="${name}"] input[value="${value}"]`);
}

export function getTextAreaByName(name: string): HTMLTextAreaElement | null {
  return document.querySelector<HTMLTextAreaElement>(`[data-testid="${name}"] textarea`);
}

function getHTMLInputElement(nameOrElement: string | HTMLInputElement): HTMLInputElement {
  if (typeof nameOrElement === 'string') {
    return getInputByName(nameOrElement);
  } else {
    return nameOrElement;
  }
}

function getHTMLTextAreaElement(nameOrElement: string | HTMLTextAreaElement): HTMLTextAreaElement {
  if (typeof nameOrElement === 'string') {
    return getTextAreaByName(nameOrElement);
  } else {
    return nameOrElement;
  }
}

export function blurTextField(nameOrElement: string | HTMLInputElement) {
  fireEvent.blur(getHTMLInputElement(nameOrElement));
}

export function changeTextField(nameOrElement: string | HTMLInputElement, value: any) {
  fireEvent.change(getHTMLInputElement(nameOrElement), { target: { value } });
}

export function keyDownInTextField(nameOrElement: string | HTMLInputElement, keyCode: number) {
  const target = getHTMLInputElement(nameOrElement);
  fireEvent.keyDown(target, { keyCode, target });
}

export function changeTextFieldDateTime(nameOrElement: string | HTMLInputElement, value: any) {
  fireEvent.change(getHTMLInputElement(nameOrElement), {
    target: { value: getLuxonDateTime(value).toFormat(DateTimeFormat.US_DEFAULT) },
  });
}

export function changeTextArea(nameOrElement: string | HTMLTextAreaElement, value: any) {
  fireEvent.change(getHTMLTextAreaElement(nameOrElement), { target: { value } });
}

export function keyDownInTextArea(nameOrElement: string | HTMLTextAreaElement, keyCode: number) {
  const target = getHTMLTextAreaElement(nameOrElement);
  fireEvent.keyDown(target, { keyCode, target });
}

export function keyUpInTextArea(nameOrElement: string | HTMLTextAreaElement, keyCode: number) {
  const target = getHTMLTextAreaElement(nameOrElement);
  fireEvent.keyUp(target, { keyCode, target });
}

export function clickCheckbox(name: string) {
  getInputByName(name).click();
}

export function clickRadio(name: string, value: string) {
  return getInputByNameAndValue(name, value).click();
}

export function expectErrorOn(name: string) {
  expect(document.querySelector(`[data-testid="${name}"] label#${name}-label`).classList).toContain('Mui-error');
  expect(document.querySelector(`[data-testid="${name}"] .MuiInputBase-root`).classList).toContain('Mui-error');
  expect(document.querySelector(`[data-testid="${name}"] p#${name}-helper-text`).classList).toContain('Mui-error');
}

export function expectErrorToBe(name: string, error: string) {
  expect(document.querySelector(`[data-testid="${name}"] p#${name}-helper-text`)).toHaveTextContent(error);
}

export function expectNoErrorOn(name: string) {
  expect(document.querySelector(`[data-testid="${name}"] label#${name}-label`).classList).not.toContain('Mui-error');
  expect(document.querySelector(`[data-testid="${name}"] .MuiInputBase-root`).classList).not.toContain('Mui-error');
}

export function getSubmitButton() {
  return dataTestIdBaseFormSubmit;
}

export function openSelect(name: string) {
  return fireEvent.mouseDown(document.querySelector(`[data-testid="${name}"] [role="button"]`));
}

export function openAutocomplete(nameOrElement: string | HTMLInputElement) {
  return fireEvent.keyDown(getHTMLInputElement(nameOrElement), { key: 'ArrowDown' });
}

export function chooseFromSelect(value: string) {
  document.querySelector<HTMLElement>(`[role="listbox"] [data-value="${value}"]`).click();
}

export function chooseFromSelectByIndex(index: number) {
  const element = document.querySelectorAll<HTMLElement>('[role="listbox"] [role="option"]')[index];

  if (!element) {
    throw new Error(`no element found with the index: ${index}`);
  }

  element.click();
}

export function chooseFromAutocomplete(label: string, options = { debug: false }) {
  if (options?.debug) {
    console.log(
      Array.from(document.querySelectorAll<HTMLElement>('[role="listbox"] [role="option"]')).map(t => t.textContent)
    );
  }

  const element = Array.from(document.querySelectorAll<HTMLElement>('[role="listbox"] [role="option"]')).find(t => {
    return t.textContent === label;
  });

  if (!element) {
    throw new Error(`no element found with the label: ${label}`);
  }

  element.click();
}

export function chooseFromAutocompleteByIndex(index: number) {
  chooseFromSelectByIndex(index);
}
