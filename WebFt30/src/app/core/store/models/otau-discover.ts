export class OtauDiscover {
  serialNumber!: string;
  portCount!: number;
}

export enum OtauDiscoverError {
  NoError,
  OsmModuleNotFound,
  UnsupportedOsmModuleConnected
}

export class OtauDiscoverResult {
  discover: OtauDiscover | null = null;
  error!: OtauDiscoverError;
}
