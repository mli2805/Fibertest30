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
  User,
  RolesSelectors
} from 'src/app/core';
import { RouterSelectors } from 'src/app/core/router/router.selectors';
import { RouterStateUrl } from 'src/app/core/router/router.state';
import { StartPageHeaderTitle } from './titles/page-header-title';
import { CoreUtils } from 'src/app/core/core.utils';
import { RolesResolver } from '../guards';
import { UserEditDialogComponent } from 'src/app/features/ft-settings/components/user-accounts/components/user-edit-dialog/user-edit-dialog.component';

@Component({
  selector: 'rtu-start-page-header',
  templateUrl: 'start-page-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StartPageHeaderComponent {
  private readonly titleMap = new Map<RegExp, StartPageHeaderTitle>([
    [/^\/rtus$/, { titleId: 'i18n.ft.rtus' }],
    [/^\/rtus\/information\/.*$/, { titleId: 'i18n.ft.information' }],
    [/^\/rtus\/trace-information\/.*$/, { titleId: 'i18n.ft.information' }],
    [/^\/rtus\/initialization\/.*$/, { titleId: 'i18n.ft.network-settings' }],
    [/^\/rtus\/trace-statistics\/.*$/, { titleId: 'i18n.ft.statistics' }],
    [/^\/rtus\/state\/.*$/, { titleId: 'i18n.ft.state' }],
    [/^\/rtus\/landmarks\/.*$/, { titleId: 'i18n.ft.landmarks' }],
    [/^\/rtus\/trace-landmarks\/.*$/, { titleId: 'i18n.ft.landmarks' }],
    [/^\/rtus\/monitoring-settings\/.*$/, { titleId: 'i18n.ft.monitoring-settings' }],
    [/^\/rtus\/measurement-client\/.*$/, { titleId: 'i18n.ft.measurement-client' }],
    [/^\/rtus\/assign-base\/.*$/, { titleId: 'i18n.ft.assign-base-refs' }],
    [/^\/rfts-setup$/, { titleId: 'i18n.ft.settings' }],
    [
      /^\/rfts-setup\/monitoring\/monitoring-profiles$/,
      { titleId: 'i18n.monitoring.monitoring-profiles' }
    ],
    [/^\/event-tables$/, { titleId: 'i18n.ft.events' }],
    [/^\/event-tables\/system-events$/, { titleId: 'i18n.ft.system-events' }],
    [/^\/evnts-new$/, { titleId: 'i18n.ft.new-events' }],
    [/^\/op-evnts\/optical-events$/, { titleId: 'i18n.ft.optical-events' }],
    [/^\/net-evnts\/network-events$/, { titleId: 'i18n.ft.network-events' }],
    [/^\/bop-net-evnts\/network-events-bop$/, { titleId: 'i18n.ft.bop-network-events' }],
    [/^\/sts-evnts\/status-events$/, { titleId: 'i18n.ft.rtu-status-events' }],
    [/^\/gis$/, { titleId: 'i18n.ft.gis' }],
    [/^\/reports\/system-events$/, { titleId: 'i18n.ft.system-events' }]
  ]);

  currentUser$ = this.store.select(AuthSelectors.selectUser);
  routerStateUrl$ = this.store.select(RouterSelectors.selectRouterStateUrl);
  routeData$ = this.store.select(RouterSelectors.selectRouterData);

  totalCountSystemNotifications$ = this.store.select(SystemNotificationSelectors.selectTotalCount);

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
