export class NetworkSettings {
  networkMode!: string;

  localIpAddress!: string;
  localSubnetMask!: string;
  localGatewayIp!: string;

  primaryDnsServer!: string | null;
  secondaryDnsServer!: string | null;
}
