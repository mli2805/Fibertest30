export interface OtauEmulatorConfig {
  Ocm: OtauEmulatorOcmSettings;
  Osm: OtauEmulatorOsmSettings[];
  Oxc: OtauEmulatorOxcSettings[];
}

export interface OtauEmulatorExceptions {
  UnknownOsmModel: boolean;
  Discover: boolean;
  Ping: boolean;
  Connect: boolean;
  Disconnect: boolean;
  SetPort: boolean;
  Blink: boolean;
}

export interface OtauEmulatorSetting {
  EmulatedOtauId: string;
  PortCount: number;
  Offline: boolean;
  SupportBlink: boolean;
  Exceptions: OtauEmulatorExceptions;
}

export type OtauEmulatorOcmSettings = OtauEmulatorSetting;

export interface OtauEmulatorOsmSettings extends OtauEmulatorSetting {
  ChainAddress: number;
}

export interface OtauEmulatorOxcSettings extends OtauEmulatorSetting {
  Ip: string;
  Port: number;
}
