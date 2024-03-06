export function getMatch(seedlingQaId: string = undefined) {
  return {
    isExact: true,
    params: {
      seedlingQaId,
    },
    path: seedlingQaId ? '/quality/seedling/:seedlingQaId' : '/quality/seedling/',
    url: seedlingQaId ? `/quality/seedling/${seedlingQaId}` : '/quality/seedling',
  };
}

export function getCheckboxInGrid(name: string, columnIndex: number): HTMLInputElement | null {
  return document.querySelector<HTMLInputElement>(`input[name="${name}[${columnIndex}]"]`);
}

export function getTextFieldInGrid(name: string, columnIndex: number): HTMLInputElement | null {
  return document.querySelector<HTMLInputElement>(`input[name="${name}[${columnIndex}]"]`);
}

export function getRadioInGrid(name: string, columnIndex: number, value: string): HTMLInputElement | null {
  return document.querySelector<HTMLInputElement>(`input[name="${name}[${columnIndex}]"][value="${value}"]`);
}
