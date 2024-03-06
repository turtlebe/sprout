type SeedlingQaError = import('@plentyag/app-quality/src/common/types').SeedlingQaError;

declare namespace SeedlingQA {
  interface Common {
    id: string;
    createdAt: string;
    updatedAt: string;
    username: string;
  }

  interface Model extends Common {
    cultivar: string;
    trayId: string;
    site: string;
    notes?: string;
    plugs: any;
    seedlingQAActionResponse: SeedlingQAActionResponse;
  }

  interface URLParams {
    seedlingQaId: string;
  }

  interface Property {
    name: string;
    type: string;
    value: string;
  }

  interface Plug {
    location: string;
    properties: Property[];
  }

  interface SeedlingQAActionResponse {
    status: boolean;
    error: SeedlingQaError;
  }
}
