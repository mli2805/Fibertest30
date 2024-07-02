import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState, AuthSelectors, SettingsSelectors, User } from 'src/app/core';

@Component({
  selector: 'rtu-user-settings-dialog',
  templateUrl: 'user-settings-dialog.component.html',
  styles: [
    `
      :host {
        width: 100%;
        height: 100%;
      }
    `
  ]
})
export class UserSettingsDialogComponent {
  public dialogRef: DialogRef<boolean> = inject(DialogRef<boolean>);
  public store: Store<AppState> = inject(Store);
  user$!: Observable<User | null>;
  saveUserSettingsError$!: Observable<string | null>;

  constructor() {
    this.user$ = this.store.select(AuthSelectors.selectUser);
    this.saveUserSettingsError$ = this.store.select(SettingsSelectors.selectSaveUserSettingsError);
  }
}
