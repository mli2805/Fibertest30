import { EventStatus } from 'src/app/core/store/models/ft30/ft-enums';

export interface MeasurementUpdatedData {
  SorFileId: number;
  EventStatus: EventStatus;
}
