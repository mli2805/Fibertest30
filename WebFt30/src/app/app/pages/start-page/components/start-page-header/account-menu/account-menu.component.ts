import { Dialog } from '@angular/cdk/dialog';
import { Component, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserSettingsDialogComponent } from 'src/app/app/dialogs/user-settings-dialog/user-settings-dialog.component';
import { AppState, AuthActions, AuthSelectors, RolesSelectors, User } from 'src/app/core';
import { UserEditDialogComponent } from 'src/app/features/ft-settings/components/user-accounts/components/user-edit-dialog/user-edit-dialog.component';
import { OverlayBase } from 'src/app/shared/components/overlays/overlay-base';
import { firstValueFrom } from 'rxjs';
import { RolesResolver } from 'src/app/app/pages/start-page/components/guards';
import { CoreUtils } from 'src/app/core/core.utils';

@Component({
    selector: 'rtu-account-menu',
    templateUrl: 'account-menu.component.html',
    standalone: false
})
export class AccountMenuComponent extends OverlayBase {
  currentUser$ = this.store.select(AuthSelectors.selectUser);

  constructor(
    private store: Store<AppState>,
    elementRef: ElementRef,
    private dialog: Dialog,
    private rolesResolver: RolesResolver
  ) {
    super(elementRef);
  }

  async openUserEditDialog(user: User) {
    await firstValueFrom(this.rolesResolver.resolve());
    const roles = CoreUtils.getCurrentState(this.store, RolesSelectors.selectRolesRoles);

    this.dialog.open(UserEditDialogComponent, {
      maxHeight: '95vh',
      maxWidth: '95vw',
      minWidth: '25ch',
      disableClose: true,
      data: { user, roles, isInCreationMode: false, outsidePageCall: true }
    });
  }

  openUserSettingsDialog() {
    this.dialog.open(UserSettingsDialogComponent, {
      maxHeight: '95vh',
      maxWidth: '95vw',
      minWidth: '25ch',
      disableClose: false
    });
  }

  signOut() {
    this.store.dispatch(AuthActions.logout());
  }
}
