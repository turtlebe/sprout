import { Context, createContext } from 'react';

export interface AppBarContext {
  reactAppHostName?: string;
  hostCurrentLocation?: string;
}

export const AppBarContext: Context<AppBarContext> = createContext({});
