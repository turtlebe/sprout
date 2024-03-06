export function getEditConfirmationMessage(editType: 'SKU' | 'Crop') {
  return `You are about to edit a ${editType}. Your edits could affect production and reporting. Are you sure you want to proceed? Yes, proceed to edit page. No, to cancel.`;
}
