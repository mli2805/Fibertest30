import { BaseRefType, FiberState } from 'src/app/core/store/models/ft30/ft-enums';

export class MeasurementStat {
  sorFileId!: number;
  baseRefType!: BaseRefType;
  registeredAt!: Date;
  isEvent!: boolean;
  traceState!: FiberState;
}
