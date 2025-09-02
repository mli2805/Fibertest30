import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  AppState,
  SystemNotificationActions,
  SystemNotificationSelectors,
  GlobalUiActions
} from 'src/app/core';
import { CoreUtils } from 'src/app/core/core.utils';
import { SystemNotification, SystemEventLevel, SystemEventSource } from 'src/app/core/store/models';

@Component({
    selector: 'rtu-system-notifications',
    templateUrl: 'system-notifications.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class SystemNotificationsComponent {
  levels = SystemEventLevel;

  private store: Store<AppState> = inject(Store<AppState>);

  systemNotificationTotalCount$ = this.store.select(SystemNotificationSelectors.selectTotalCount);

  systemNotifications$ = this.store.select(
    SystemNotificationSelectors.selectSystemNotificationNotifications
  );

  getSource(source: SystemEventSource) {
    return CoreUtils.getSystemEventSource(this.store, source);
  }

  onAnimationDone(systemNotification: SystemNotification) {
    this.store.dispatch(
      SystemNotificationActions.setNotificationSeen({
        systemEventId: systemNotification.systemEvent.id
      })
    );
  }

  onNavigatedToEvent(systemNotification: SystemNotification) {
    this.store.dispatch(GlobalUiActions.toggleSystemNotification());
    this.dismissNotification(systemNotification);
  }

  dismissNotification(systemNotification: SystemNotification) {
    this.store.dispatch(
      SystemNotificationActions.dismissNotification({
        systemEventId: systemNotification.systemEvent.id
      })
    );
  }

  dismissByLevel(systemEventLevel: SystemEventLevel) {
    this.store.dispatch(
      SystemNotificationActions.dismissNotificationsByLevel({ systemEventLevel })
    );
  }

  dismissAll() {
    this.store.dispatch(SystemNotificationActions.dismissAllNotifications());
  }
}
