import { ReturnCode } from 'src/app/core/store/models/ft30/return-code';

export enum LandmarksUpdateProgress {
  CommandsPersistedInEventStorage,
  TraceBaseRefsProcessed,
  AllDone
}

export interface LandmarksUpdateProgressedData {
  LandmarksModelId: string;
  Step: LandmarksUpdateProgress;
  TraceId: string;
  TraceCount: number;
  TraceNumber: number;
  ReturnCode: ReturnCode;
  IsSuccess: boolean;
}
