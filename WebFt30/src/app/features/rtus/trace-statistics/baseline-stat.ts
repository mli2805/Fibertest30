import { BaseRefType } from 'src/app/core/store/models/ft30/ft-enums';

export class BaselineStat {
  sorFileId!: number;
  baseRefType!: BaseRefType;
  assignedAt!: Date;
  byUser!: string;
}
