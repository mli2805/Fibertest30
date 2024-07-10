export class NetAddress {
  ip4Address!: string;
  hostName!: string;
  port!: number;

  toString() {
    return `${this.ip4Address} : ${this.port}`;
  }
}
