import { EntityState } from '@ngrx/entity';
import { LandmarksModel } from '../models/ft30/colored-landmark';
import { LandmarksUpdateProgressedData } from 'src/app/shared/system-events/system-event-data/landmarks-update';

export interface LandmarksModelsState extends EntityState<LandmarksModel> {
  loaded: boolean;
  loading: boolean;
  errorMessageId: string | null;
  progress: LandmarksUpdateProgressedData[];
}
