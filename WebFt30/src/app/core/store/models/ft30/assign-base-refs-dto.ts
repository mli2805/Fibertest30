import { BaseRefType, RtuMaker } from './ft-enums';
import { PortOfOtau } from './port-of-otau';

export class AssignBaseRefsDto {
  rtuId!: string;
  rtuMaker!: RtuMaker;

  traceId!: string;
  portOfOtau!: PortOfOtau | null;

  baseFiles!: BaseRefFile[];
  deleteSors!: number[];
}

export class BaseRefFile {
  baseRefType: BaseRefType;
  fileContent: Uint8Array | null;
  isForDelete: boolean;

  constructor(baseRefType: BaseRefType, fileContent: Uint8Array, isForDelete: boolean) {
    this.baseRefType = baseRefType;
    this.fileContent = fileContent;
    this.isForDelete = isForDelete;
  }
}
