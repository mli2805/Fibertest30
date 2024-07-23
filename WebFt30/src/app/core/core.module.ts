import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule, Optional, SkipSelf } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { DialogModule } from '@angular/cdk/dialog';

import { metaReducers, reducers } from './core.state';
import { environment } from 'src/environments/environment';
import { CustomSerializer } from './router/custom-serializer';
import { AuthEffects } from './auth/auth.effects';
import { SettingsEffects } from './store/settings/settings.effects';
import { DeviceEffects } from './store/device/device.effects';
import { OnDemandEffects } from './store/on-demand/on-demand.effects';
import { GlobalUiEffects } from './store/global-ui/global-ui.effects';
import { RtuTranslateLoader } from '../shared/utils/rtu-translate-loader';
import { StartPageModule } from '../app/pages/start-page/start-page.module';
import { ErrorPageComponent } from '../app/pages/erorr-page/error-page.component';
import { LoginPageComponent } from '../app/pages/login-page/login-page.component';
import { AppErrorHandler } from './error-handler/app-error-handler.service';
import { UserSettingsDialogComponent } from '../app/dialogs/user-settings-dialog/user-settings-dialog.component';
import { SharedModule } from '../shared/shared.module';
import { DatetimeFormatSwitcherComponent } from '../app/pages/start-page/components/datetime-format-switcher/datetime-format-switcher.component';
import { UsersEffects } from './store/users/users.effects';
import { SystemEventsEffects } from './store/system-events/system-events.effects';
import { SystemNotificationEffects } from './store/system-notification/system-notification.effects';
import { RolesEffects } from './store/roles/roles.effects';
import { OnDemandHistoryEffects } from './store/on-demand-history/on-demand-history.effects';
import { OtausEffects } from './store/otaus/otaus.effects';
import { MonitoringPortEffects } from './store/monitoring/monitoring-port.effects';
import { MonitoringHistoryEffects } from './store/monitoring-history/monitoring-history.effects';
import { BaselineSetupEffects } from './store/baseline/baseline-setup.effects';
import { AlarmProfilesEffects } from './store/alarm-profile/alarm-profiles.effects';
import { AlarmNotificationEffects } from './store/alarm-notification/alarm-notification.effects';
import { NotificationSettingsEffects } from './store/notification-settings/notification-settings.effects';
import { ActiveAlarmsEffects } from './store/active-alarms/active-alarms.effects';
import { QuickAnalysisEffects } from './store/quick-analysis/quick-analysis.effects';
import { AlarmEventsEffects } from './store/alarm-events/alarm-events.effects';
import { AllAlarmsEffects } from './store/all-alarms/all-alarms.effects';
import { BaselineHistoryEffects } from './store/baseline-history/baseline-history.effects';
import { NetworkSettingsEffects } from './store/network-settings/network-settings.effects';
import { PortLabelsEffects } from './store/port-labels/port-labs.effects';
import { TimeSettingsEffects } from './store/time-settings/time-settings.effects';
import { RtuTreeEffects } from './store/rtu-tree/rtu-tree.effects';
import { RtuMgmtEffects } from './store/rtu-mgmt/rtu-mgmt.effects';

@NgModule({
  imports: [
    // angular
    CommonModule,
    HttpClientModule,
    FormsModule,

    // angular cdk
    DialogModule,

    // 3rd party
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => new RtuTranslateLoader(http),
        deps: [HttpClient]
      }
    }),

    // ngrx
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: !environment.production,
        strictActionImmutability: false,
        strictStateSerializability: false,
        strictActionSerializability: false,
        strictActionWithinNgZone: !environment.production,
        strictActionTypeUniqueness: !environment.production
      }
    }),
    EffectsModule.forRoot([
      AuthEffects,
      SettingsEffects,
      DeviceEffects,
      AlarmNotificationEffects,
      ActiveAlarmsEffects,
      AllAlarmsEffects,
      SystemNotificationEffects,
      OnDemandEffects,
      OnDemandHistoryEffects,
      MonitoringHistoryEffects,
      UsersEffects,
      RolesEffects,
      OtausEffects,
      MonitoringPortEffects,
      BaselineSetupEffects,
      GlobalUiEffects,
      SystemEventsEffects,
      AlarmProfilesEffects,
      AlarmEventsEffects,
      NotificationSettingsEffects,
      QuickAnalysisEffects,
      BaselineHistoryEffects,
      NetworkSettingsEffects,
      TimeSettingsEffects,
      PortLabelsEffects,

      RtuTreeEffects,
      RtuMgmtEffects
    ]),
    StoreRouterConnectingModule.forRoot(), //setup dev tools
    environment.production
      ? []
      : StoreDevtoolsModule.instrument({
          name: 'Rfts400',
          actionsBlocklist: ['[Test Queue] Set Current', '[Test Queue] Set Last']
        }),

    // app
    SharedModule,
    StartPageModule
  ],
  declarations: [
    ErrorPageComponent,
    LoginPageComponent,
    UserSettingsDialogComponent,
    DatetimeFormatSwitcherComponent
  ],
  providers: [
    { provide: RouterStateSerializer, useClass: CustomSerializer },
    { provide: ErrorHandler, useClass: AppErrorHandler }
  ],
  exports: [
    // angular
    FormsModule,

    TranslateModule,
    UserSettingsDialogComponent,
    DatetimeFormatSwitcherComponent
  ]
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule
  ) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import only in AppModule');
    }
  }
}
