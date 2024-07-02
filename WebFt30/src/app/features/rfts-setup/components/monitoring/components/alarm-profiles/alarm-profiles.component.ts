import { Component, inject } from '@angular/core';
import { AlarmProfile } from '../../../../../../core/store/models/alarm-profile';
import { Store } from '@ngrx/store';
import { AppState, AuthSelectors } from 'src/app/core';
import { Dialog } from '@angular/cdk/dialog';
import { AlarmProfileEditComponent } from './alarm-profile-edit/alarm-profile-edit.component';
import { AlarmProfilesSelectors } from 'src/app/core/store/alarm-profile/alarm-profiles.selectors';
import { AlarmProfilesFactory } from './alarm-profiles-factory';

@Component({
  selector: 'rtu-alarm-profiles',
  templateUrl: './alarm-profiles.component.html',
  styles: [':host { overflow-y: auto; width: 100%; height: 100%; }']
})
export class AlarmProfilesComponent {
  private store: Store<AppState> = inject(Store<AppState>);
  hasChangeAlarmProfilesPermission$ = this.store.select(
    AuthSelectors.selectHasChangeAlarmProfilesPermission
  );
  loading$ = this.store.select(AlarmProfilesSelectors.selectLoading);
  loaded$ = this.store.select(AlarmProfilesSelectors.selectLoaded);
  errorMessageId$ = this.store.select(AlarmProfilesSelectors.selectErrorMessageId);
  profiles$ = this.store.select(AlarmProfilesSelectors.selectAlarmProfilesArray);

  // see enum ThresholdParameter indices
  thresholdVisibilities = [true, false, true, true, false, false, false];

  constructor(private dialog: Dialog) {}

  onAddClicked() {
    const profile = AlarmProfilesFactory.createOriginalDefaultProfile();
    this.openDialog(profile, true);
  }

  onEditClicked(profile: AlarmProfile) {
    this.openDialog(profile, false);
  }

  openDialog(profile: AlarmProfile, isAddNew: boolean) {
    this.dialog.open(AlarmProfileEditComponent, {
      maxHeight: '95vh',
      maxWidth: '95vw',
      disableClose: true,
      data: { profile, isAddNew }
    });
  }
}
