import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { act, renderHook } from '@testing-library/react-hooks';

import { useRegisterActionModule } from '.';

describe('useRegisterActionModule', () => {
  function getMockActionModule(name: string) {
    // mock action module props - specific values for actionModulePorps and handleSubmit are not important for this test
    return {
      name,
      actionModuleProps: {
        formik: {} as any,
        actionModel: {} as any,
      },
      handleSubmit: jest.fn(),
    };
  }

  it('adds new action module to the registered list', () => {
    const { result } = renderHook(() => useRegisterActionModule());

    expect(result.current.registeredActionModules).toHaveLength(0);

    act(() => result.current.registerActionModule(getMockActionModule('test')));

    expect(result.current.registeredActionModules).toHaveLength(1);
  });

  it('replaces existing action module with the same name', () => {
    const { result } = renderHook(() => useRegisterActionModule());

    expect(result.current.registeredActionModules).toHaveLength(0);

    act(() => result.current.registerActionModule(getMockActionModule('test')));

    expect(result.current.registeredActionModules).toHaveLength(1);

    act(() => result.current.registerActionModule(getMockActionModule('test')));

    expect(result.current.registeredActionModules).toHaveLength(1);
  });

  it('returns the list of registered action modules', () => {
    const { result } = renderHook(() => useRegisterActionModule());

    expect(result.current.registeredActionModules).toHaveLength(0);

    act(() => result.current.registerActionModule(getMockActionModule('test')));

    act(() => result.current.registerActionModule(getMockActionModule('test2')));

    expect(result.current.registeredActionModules).toHaveLength(2);
  });

  it('saveActionModules calls handleSubmit on all registered action modules', async () => {
    const { result } = renderHook(() => useRegisterActionModule());

    expect(result.current.registeredActionModules).toHaveLength(0);

    act(() => result.current.registerActionModule(getMockActionModule('test')));

    act(() => result.current.registerActionModule(getMockActionModule('test2')));

    expect(result.current.registeredActionModules).toHaveLength(2);

    await actAndAwait(async () => result.current.saveActionModules());

    expect(result.current.registeredActionModules[0].handleSubmit).toBeCalledTimes(1);
    expect(result.current.registeredActionModules[1].handleSubmit).toBeCalledTimes(1);
  });
});
