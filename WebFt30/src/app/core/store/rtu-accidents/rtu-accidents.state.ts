import { ServerError } from '../../models/server-error';
import { RtuAccident } from '../models/ft30/rtu-accident';

export interface RtuAccidentsState {
  rtuAccidents: RtuAccident[] | null;
  loading: boolean;
  loadedTime: Date | null;
  error: ServerError | null;
}
