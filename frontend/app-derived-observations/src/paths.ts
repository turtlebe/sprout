const BASE_PATH = '/derived-observations';

export const PATHS = {
  baseObservationDefinitionPage: (definitionId: string) => `${BASE_PATH}/base-observation-definitions/${definitionId}`,
  baseObservationDefinitionsPage: `${BASE_PATH}/base-observation-definitions`,
  derivedObservationDefinitionPage: (definitionId: string) =>
    `${BASE_PATH}/derived-observation-definitions/${definitionId}`,
  derivedObservationDefinitionsPage: `${BASE_PATH}/derived-observation-definitions`,
};
