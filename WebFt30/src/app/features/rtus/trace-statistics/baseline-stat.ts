import { BaseRefType } from 'src/app/core/store/models/ft30/ft-enums';

export class BaselineStat {
  baseRefType!: BaseRefType;
  assignedAt!: Date;
  byUser!: string;
}
