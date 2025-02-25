import { Dialog } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState, AuthSelectors, RolesSelectors, User } from 'src/app/core';
import { UsersSelectors } from 'src/app/core/store/users/users.selectors';
import { UserEditDialogComponent } from './components/user-edit-dialog/user-edit-dialog.component';
import { CoreUtils } from 'src/app/core/core.utils';
import { UsersActions } from 'src/app/core/store/users/users.actions';
import { firstValueFrom } from 'rxjs';
import { RolesResolver } from 'src/app/app/pages/start-page/components/guards';

@Component({
  selector: 'rtu-user-accounts',
  templateUrl: './user-accounts.component.html',
  styles: [':host { width: 100%; height: 100%; }']
})
export class UserAccountsComponent {
  usersActions = UsersActions;

  private store: Store<AppState> = inject(Store<AppState>);

  loaded$ = this.store.select(UsersSelectors.selectLoaded);
  loading$ = this.store.select(UsersSelectors.selectLoading);
  users$ = this.store.pipe(select(UsersSelectors.selectUsersUsers));
  errorMessageId$ = this.store.select(UsersSelectors.selectErrorMessageId);
  hasEditUsersPermission$ = this.store.select(AuthSelectors.selectHasEditUsersPermission);
  loggedUser$ = this.store.select(AuthSelectors.selectUser);

  constructor(private dialog: Dialog, private rolesResolver: RolesResolver) {
    this.loadUsersIfNotLoaded();
  }

  private loadUsersIfNotLoaded() {
    const loaded = CoreUtils.getCurrentState(this.store, UsersSelectors.selectLoaded);
    if (!loaded) {
      this.store.dispatch(UsersActions.getUsers());
    }
  }

  async onUserCardClick(user: User) {
    await this.openUserDialog(user, false);
  }

  async onUserPlusClick() {
    const user = new User();
    user.email = '';
    user.jobTitle = '';
    user.phoneNumber = '';
    user.role = 'Operator';
    await this.openUserDialog(user, true);
  }

  private async openUserDialog(user: User, isInCreationMode: boolean) {
    // We need to load roles before opening the dialog
    // As our resolver does not return roles directly, we get the roles from the current state
    await firstValueFrom(this.rolesResolver.resolve());
    const roles = CoreUtils.getCurrentState(this.store, RolesSelectors.selectRolesRoles);

    this.dialog.open(UserEditDialogComponent, {
      maxHeight: '95vh',
      maxWidth: '95vw',
      disableClose: true,
      data: { user, roles, isInCreationMode }
    });
  }
}
