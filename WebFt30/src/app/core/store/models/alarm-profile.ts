import { Threshold } from './threshold';

export class AlarmProfile {
  id!: number;
  name!: string;
  thresholds: Threshold[];

  constructor() {
    this.thresholds = [];
  }
}
