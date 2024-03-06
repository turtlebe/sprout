export interface GetTrayIDRecord {
  id: string;
  location: Location;
  materialObj: MaterialObj;
}

interface MaterialObj {
  id: string;
  product: string;
}

interface Location {
  machine: Machine;
}

interface Machine {
  siteName: string;
}
