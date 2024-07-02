import { Dialog } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';

import {
  AppState,
  AuthSelectors,
  SystemNotificationSelectors,
  GlobalUiActions,
  OnDemandSelectors,
  AlarmNotificationSelectors,
  User,
  RolesSelectors
} from 'src/app/core';
import { RouterSelectors } from 'src/app/core/router/router.selectors';
import { RouterStateUrl } from 'src/app/core/router/router.state';
import { StartPageHeaderTitle } from './titles/page-header-title';
import { CoreUtils } from 'src/app/core/core.utils';
import { UserEditDialogComponent } from 'src/app/features/rfts-setup/components/platform-management/user-accounts/components/user-edit-dialog/user-edit-dialog.component';
import { RolesResolver } from '../guards';

@Component({
  selector: 'rtu-start-page-header',
  templateUrl: 'start-page-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StartPageHeaderComponent {
  private readonly titleMap = new Map<RegExp, StartPageHeaderTitle>([
    [/^\/dashboard$/, { titleId: 'i18n.start-page.dashboard' }],
    [/^\/rfts-setup$/, { titleId: 'i18n.start-page.rfts-setup' }],
    [/^\/rfts-setup\/platform-management$/, { titleId: 'i18n.page-title.platform-management' }],
    [/^\/rfts-setup\/monitoring\/alarm-profiles$/, { titleId: 'i18n.monitoring.alarm-profiles' }],
    [
      /^\/rfts-setup\/monitoring\/monitoring-profiles$/,
      { titleId: 'i18n.monitoring.monitoring-profiles' }
    ],
    [/^\/on-demand$/, { titleId: 'i18n.start-page.on-demand' }],
    [/^\/reporting$/, { titleId: 'i18n.start-page.reporting' }],
    [/^\/reporting\/system-events$/, { titleId: 'i18n.page-title.system-events' }],
    [/^\/reporting\/on-demand-history$/, { titleId: 'i18n.page-title.on-demand-history' }],
    [/^\/reporting\/monitoring-history$/, { titleId: 'i18n.page-title.monitoring-history' }],
    [/^\/reporting\/baseline-history$/, { titleId: 'i18n.page-title.baseline-history' }],
    [/^\/reporting\/alarm-view$/, { titleId: 'i18n.page-title.alarm-view' }],
    [/^\/reporting\/alarms$/, { titleId: 'i18n.reporting.alarms' }],
    [/^\/gis$/, { titleId: 'i18n.start-page.gis' }],
    [
      /^\/rfts-setup\/monitoring\/ports\/\d+\/dashboard\/\d+$/,
      {
        customHeader: 'routerBaselineTitle',
        titleId: 'i18n.common.port-dashboard'
      }
    ],
    [
      /^\/rfts-setup\/monitoring\/ports\/.*$/,
      {
        customHeader: 'routerOtauTitle',
        titleId: 'i18n.monitoring.ports'
      }
    ],
    [
      /^\/rfts-setup\/monitoring\/otau-dashboard\/.*$/,
      {
        customHeader: 'routerOtauTitle',
        titleId: 'i18n.monitoring.otau-dashboard'
      }
    ]
  ]);

  currentUser$ = this.store.select(AuthSelectors.selectUser);
  routerStateUrl$ = this.store.select(RouterSelectors.selectRouterStateUrl);
  routeData$ = this.store.select(RouterSelectors.selectRouterData);
  showOnDemandNotification$ = this.store.select(
    SystemNotificationSelectors.selectShowOnDemandNotification
  );
  onDemandPending$ = this.store.select(OnDemandSelectors.selectPending);
  onDemandRunning$ = this.store.select(OnDemandSelectors.selectRunning);
  onDemandCompleted$ = this.store.select(OnDemandSelectors.selectCompleted);
  totalCountSystemNotifications$ = this.store.select(SystemNotificationSelectors.selectTotalCount);
  totalCountAlarmNotifications$ = this.store.select(AlarmNotificationSelectors.selectTotalCount);

  openUserMenu = false;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private dialog: Dialog,
    private rolesResolver: RolesResolver
  ) {}

  getTitle(stateUrl: RouterStateUrl): StartPageHeaderTitle {
    let title = this.getTitleFromMaps(stateUrl.url);
    if (!title) {
      const parentUrl = this.getParentUlr(stateUrl.url);
      title = this.getTitleFromMaps(parentUrl);
    }

    return title || { titleId: stateUrl.url };
  }

  getTitleFromMaps(url: string): StartPageHeaderTitle | null {
    for (const [regex, title] of this.titleMap) {
      if (regex.test(url)) {
        return title;
      }
    }

    return null;
  }

  goUp(stateUrl: RouterStateUrl, navigateToParent: number) {
    let currentUrl = stateUrl.url;
    while (navigateToParent > 0) {
      currentUrl = this.getParentUlr(currentUrl);
      navigateToParent--;
    }

    this.router.navigate([currentUrl]);
  }

  getParentUlr(url: string): string {
    return url.split('/').slice(0, -1).join('/');
  }

  toggleSystemNotification() {
    this.store.dispatch(GlobalUiActions.toggleSystemNotification());
  }

  toggleAlarmNotification() {
    this.store.dispatch(GlobalUiActions.toggleAlarmNotification());
  }

  async openUserEditDialog(user: User) {
    await firstValueFrom(this.rolesResolver.resolve());
    const roles = CoreUtils.getCurrentState(this.store, RolesSelectors.selectRolesRoles);

    this.dialog.open(UserEditDialogComponent, {
      maxHeight: '95vh',
      maxWidth: '95vw',
      minWidth: '25ch',
      disableClose: true,
      data: {
        user,
        roles,
        isInCreationMode: false,
        outsidePageCall: true,
        adminProfileComplete: true
      }
    });
  }
}
