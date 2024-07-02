import { EntityState } from '@ngrx/entity';
import { Otau } from '../models';

export interface OtausState extends EntityState<Otau> {
  loading: boolean;
  errorMessageId: string | null;

  routerSelectedOtauOcmPortIndex: number | null;
}
