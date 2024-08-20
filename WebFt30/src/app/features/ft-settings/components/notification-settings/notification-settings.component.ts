import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, AuthSelectors } from 'src/app/core';
import { NotificationSettingsSelectors } from 'src/app/core/store/notification-settings/notification-settings.selectors';

@Component({
  selector: 'rtu-notification-settings',
  templateUrl: './notification-settings.component.html'
})
export class NotificationSettingsComponent {
  store: Store<AppState> = inject(Store<AppState>);
  hasChangeNotificationSettingsPermission$ = this.store.select(
    AuthSelectors.selectHasChangeNotificationSettingsPermission
  );

  loading$ = this.store.select(NotificationSettingsSelectors.selectLoading);
  loaded$ = this.store.select(NotificationSettingsSelectors.selectLoaded);
  errorMessageId$ = this.store.select(NotificationSettingsSelectors.selectErrorMessageId);
  ntfState$ = this.store.select(NotificationSettingsSelectors.selectNotificationSettingsSet);
}
