export declare global {
  interface Window {
    plenty?: {
      csrfToken: string;
      env: {
        [key: string]: string;
      };
    };
    customEventPayload?: {
      productionActionOnComplete?: { responseCode: number; errorMessage: string };
    };
  }
}
