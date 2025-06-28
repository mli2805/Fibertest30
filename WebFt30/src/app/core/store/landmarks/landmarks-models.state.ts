import { EntityState } from '@ngrx/entity';
import { LandmarksModel } from '../models/ft30/colored-landmark';

export interface LandmarksModelsState extends EntityState<LandmarksModel> {
  loaded: boolean;
  loading: boolean;
  errorMessageId: string | null;
}
