import { notifyProductionActionHasCompleted } from '.';

describe('notifyProductionActionHasCompleted', () => {
  it('custom event is received and its payload is updated in the global window object', () => {
    const mockProductionActionOnComplete = jest.fn();
    const responseCode = 400;
    const errorMessage = 'Bad request error message';
    const div = document.createElement('div');
    div.id = 'root';
    document.body.append(div);
    div.addEventListener('ProductionActionOnComplete', mockProductionActionOnComplete);

    notifyProductionActionHasCompleted(responseCode, errorMessage);

    expect(window.customEventPayload).toBeDefined();
    expect(window.customEventPayload.productionActionOnComplete).toBeDefined();
    expect(window.customEventPayload.productionActionOnComplete.responseCode).toBe(responseCode);
    expect(window.customEventPayload.productionActionOnComplete.errorMessage).toBe(errorMessage);
    expect(mockProductionActionOnComplete).toHaveBeenCalledTimes(1);
  });
});
