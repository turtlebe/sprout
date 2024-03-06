import { PaginatedList } from '@plentyag/core/src/types';
import { act, render, RenderOptions } from '@testing-library/react';
import { act as actForHook, renderHook, RenderHookOptions } from '@testing-library/react-hooks';
import { Settings } from 'luxon';
import moment from 'moment-timezone';

export async function actAndAwait(callback) {
  // eslint-disable-next-line @typescript-eslint/await-thenable
  await act(async () => {
    await callback();
  });
}

export async function actAndAwaitForHook(callback) {
  // eslint-disable-next-line @typescript-eslint/await-thenable
  await actForHook(async () => {
    await callback();
  });
}

export async function actAndAwaitRender(Component, options?: RenderOptions) {
  let component;

  // eslint-disable-next-line @typescript-eslint/await-thenable
  await act(async () => {
    // eslint-disable-next-line @typescript-eslint/await-thenable
    component = await render(Component, options);
  });

  return component;
}

export async function actAndAwaitRenderHook<TProps>(callback, options?: RenderHookOptions<TProps>) {
  let hook;

  // eslint-disable-next-line @typescript-eslint/await-thenable
  await actForHook(async () => {
    // eslint-disable-next-line @typescript-eslint/await-thenable
    hook = await renderHook(callback, options);
  });

  return hook;
}

export function dataTestId(value: string): string {
  return `[data-testid="${value}"]`;
}

export function mockConsoleError() {
  return jest.spyOn(console, 'error').mockImplementation(() => {});
}

export function buildPaginatedResponse<T>(response = []): PaginatedList<T> {
  return { data: response, meta: { total: response.length, limit: 100, offset: 0 } };
}

export function mockLocation(mock: any) {
  const location = window.location;
  delete window.location;
  window.location = { ...location, ...mock };

  function restore() {
    window.location = location;
  }

  return restore;
}

/**
 * Fake Timers for Jest, Luxon and Moment
 */
export function useFakeTimers(nowIsoOrDate: string | Date, zone = 'America/Los_Angeles') {
  Settings.defaultZone = zone;
  moment.tz.setDefault(zone);

  jest.useFakeTimers();
  jest.setSystemTime(typeof nowIsoOrDate === 'string' ? new Date(nowIsoOrDate) : nowIsoOrDate);
}

/**
 * Reset Timers to default for Jest, Luxon and Moment
 */
export function useRealTimers() {
  jest.useRealTimers();

  Settings.defaultZone = 'system';
  moment.tz.setDefault();
}
