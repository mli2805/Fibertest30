import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  AppState,
  SystemNotificationActions,
  SystemNotificationSelectors,
  GlobalUiActions,
  OnDemandActions,
  OnDemandSelectors
} from 'src/app/core';
import { CoreUtils } from 'src/app/core/core.utils';
import { RouterSelectors } from 'src/app/core/router/router.selectors';

@Component({
  selector: 'rtu-on-demand-notification',
  templateUrl: 'on-demand-notification.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OnDemandNotificationComponent {
  private store: Store<AppState> = inject(Store<AppState>);

  showOnDemandNotification$ = this.store.select(
    SystemNotificationSelectors.selectShowOnDemandNotification
  );
  onDemandStarted$ = this.store.select(OnDemandSelectors.selectStarted);
  onDemandCancelling$ = this.store.select(OnDemandSelectors.selectCancelling);
  onDemandCompleted$ = this.store.select(OnDemandSelectors.selectCompleted);
  finishedDate$ = this.store.select(OnDemandSelectors.selectFinishedDate);
  routerStateUrl$ = this.store.select(RouterSelectors.selectRouterStateUrl);

  constructor(private router: Router) {}

  stopOnDemand() {
    const otdrTaskId = CoreUtils.getCurrentState(this.store, OnDemandSelectors.selectOtdrTaskId);
    if (otdrTaskId !== null) {
      this.store.dispatch(OnDemandActions.stopOnDemand({ otdrTaskId }));
    }
  }

  hideOnDemandNotification() {
    this.store.dispatch(SystemNotificationActions.hideOnDemandNotification());
  }

  navigateToOnDemand() {
    // this toggle actually hides the notification as it's open now
    this.store.dispatch(GlobalUiActions.toggleSystemNotification());
    this.router.navigate(['/on-demand']);
  }
}
