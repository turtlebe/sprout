import { getOperationColor } from './get-operation-color';

/** @todo: this will eventually come from backend */
const majorOperation: ProdActions.OperationTypes[] = ['CProc Transplant Tower', 'Cult Seed Tray'];

function isMajorOperation(operation: ProdResources.Operation) {
  return majorOperation.includes(operation.type);
}

export function getOperationAttributes(operation: ProdResources.Operation) {
  return {
    color: getOperationColor(operation.type),
    size: isMajorOperation(operation) ? 10 : 5,
  };
}
