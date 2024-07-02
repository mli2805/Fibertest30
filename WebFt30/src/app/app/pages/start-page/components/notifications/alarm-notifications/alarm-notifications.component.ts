import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  AppState,
  AlarmNotificationActions,
  GlobalUiActions,
  AlarmNotificationSelectors,
  OtausSelectors
} from 'src/app/core';
import { ConvertUtils } from 'src/app/core/convert.utils';
import { CoreUtils } from 'src/app/core/core.utils';
import {
  AlarmNotification,
  MonitoringAlarmLevel,
  MonitoringAlarmType
} from 'src/app/core/store/models';

@Component({
  selector: 'rtu-alarm-notifications',
  templateUrl: 'alarm-notifications.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlarmNotificationsComponent {
  conveterUtils = ConvertUtils;
  alarmTypes = MonitoringAlarmType;
  levels = MonitoringAlarmLevel;

  private store: Store<AppState> = inject(Store<AppState>);
  private router: Router = inject(Router);

  alarmNotificationTotalCount$ = this.store.select(AlarmNotificationSelectors.selectTotalCount);

  alarmNotifications$ = this.store.select(
    AlarmNotificationSelectors.selectAlarmNotificationNotifications
  );

  onAnimationDone(alarmNotification: AlarmNotification) {
    this.store.dispatch(
      AlarmNotificationActions.setNotificationSeen({
        alarmEventId: alarmNotification.alarmEvent.id
      })
    );
  }

  onNavigatedToEvent(alarmNotification: AlarmNotification) {
    this.store.dispatch(GlobalUiActions.toggleAlarmNotification());
    this.dismissNotification(alarmNotification);
  }

  dismissNotification(alarmNotification: AlarmNotification) {
    this.store.dispatch(
      AlarmNotificationActions.dismissNotification({
        alarmEventId: alarmNotification.alarmEvent.id
      })
    );
  }

  dismissByLevel(alarmLevel: MonitoringAlarmLevel) {
    this.store.dispatch(AlarmNotificationActions.dismissNotificationsByLevel({ alarmLevel }));
  }

  dismissAll() {
    this.store.dispatch(AlarmNotificationActions.dismissAllNotifications());
  }

  getOtauPortPathByMonitoringPortId(monitoringPortId: number) {
    return CoreUtils.getCurrentState(
      this.store,
      OtausSelectors.selectOtauPathByMonitoringPortId(monitoringPortId)
    );
  }

  navigateToAlarmEvent(alarmEventId: number) {
    // this toggle actually hides the notification as it's open now
    this.store.dispatch(GlobalUiActions.toggleAlarmNotification());
    this.redirectTo('/reporting/alarms', alarmEventId);
  }

  // When AlarmView is open and we click navigate to another AlarmEvent
  // router thinks route is the same (though id is different!) and does not react
  // So this function redirects to a dummy route and quickly returns to the correct one
  redirectTo(uri: string, id: number) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([uri, id]);
    });
  }
}
