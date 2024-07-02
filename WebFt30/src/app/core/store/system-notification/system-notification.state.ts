import { EntityState } from '@ngrx/entity';
import { SystemNotification } from '../models';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SystemNotificationState extends EntityState<SystemNotification> {
  showOnDemandNotification: boolean;
}
