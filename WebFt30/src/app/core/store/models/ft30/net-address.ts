export class NetAddress {
  ip4Address!: string;
  hostName!: string;
  port!: number;

  toString() {
    if (this.ip4Address !== '') {
      return `${this.ip4Address} : ${this.port}`;
    }
    return '';
  }
}
