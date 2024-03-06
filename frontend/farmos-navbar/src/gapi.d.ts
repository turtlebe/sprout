interface Profile {
  getImageUrl(): string;
}

interface User {
  getBasicProfile(): Profile;
}

interface UserProxy {
  get(): User;
}

interface Auth2Resolve {
  currentUser: UserProxy;
}

interface Auth2 {
  init(): Promise<Auth2Resolve>;
}

interface GapiObject {
  load: Function;
  auth2: Auth2;
}

declare var gapi: GapiObject;
