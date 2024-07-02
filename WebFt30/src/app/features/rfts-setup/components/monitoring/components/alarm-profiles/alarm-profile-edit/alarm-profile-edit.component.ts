import { DIALOG_DATA, Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit, inject } from '@angular/core';
import { AlarmProfile } from '../../../../../../../core/store/models/alarm-profile';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Threshold, ThresholdParameter } from '../../../../../../../core/store/models/threshold';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core';
import { AlarmProfilesActions } from 'src/app/core/store/alarm-profile/alarm-profiles.actions';
import { ThresholdFormFactory } from './threshold-form-factory';
import { ConfirmationComponent } from 'src/app/shared/components/confirmation/confirmation.component';
import { TranslateService } from '@ngx-translate/core';
import { CoreUtils } from 'src/app/core/core.utils';
import { AlarmProfilesSelectors } from 'src/app/core/store/alarm-profile/alarm-profiles.selectors';

@Component({
  selector: 'rtu-alarm-profile-edit',
  templateUrl: './alarm-profile-edit.component.html'
})
export class AlarmProfileEditComponent implements OnInit {
  public dialogRef: DialogRef<boolean> = inject(DialogRef<boolean>);
  public store: Store<AppState> = inject(Store);

  profile: AlarmProfile;
  isAddNew: boolean;
  canRemove: boolean;
  form!: FormGroup;

  childForms: FormGroup[] = [];
  childParameters: ThresholdParameter[] = [];

  constructor(
    @Inject(DIALOG_DATA) private data: any,
    private dialog: Dialog,
    private ts: TranslateService
  ) {
    this.profile = data.profile;
    this.isAddNew = data.isAddNew;
    this.canRemove = !this.isAddNew && this.profile.id !== 1;
  }

  private profiles!: AlarmProfile[];

  // see enum ThresholdParameter indices
  thresholdVisibilities = [true, false, true, true, false, false, false];

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(this.profile.name, [Validators.required, this.uniqueNameValidator()])
    });

    for (const threshold of this.profile.thresholds) {
      if (this.thresholdVisibilities[threshold.parameter]) {
        this.childForms.push(ThresholdFormFactory.create(threshold));
        this.childParameters.push(threshold.parameter);
      }
    }

    this.profiles = CoreUtils.getCurrentState(
      this.store,
      AlarmProfilesSelectors.selectAlarmProfilesArray
    );
  }

  uniqueNameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.pristine) return null;
      const result = this.profiles.find(
        (p) => p.name.toLowerCase() === control.value.toLowerCase() && p.id !== this.profile.id
      );
      return result === undefined ? null : { notUnique: { value: '' } };
    };
  }

  isNameValid(): boolean {
    if (this.form.controls['name'].pristine) return true;
    return this.form.controls['name'].valid;
  }

  isApplyDisabled(): boolean {
    if (!this.form.valid) return true;

    let isAllChildPristine = true;
    for (const childForm of this.childForms) {
      if (!childForm.valid) return true;
      if (!childForm.pristine) isAllChildPristine = false;
    }

    if (this.form.pristine && isAllChildPristine) return true;

    return false;
  }

  composeAlarmProfileFromInputs(): AlarmProfile {
    const profileWithChanges = new AlarmProfile();
    profileWithChanges.id = this.profile.id;
    profileWithChanges.name = this.form.controls['name'].value;

    for (const threshold of this.profile.thresholds) {
      const indexInVisible = this.childParameters.findIndex((p) => p === threshold.parameter);
      if (indexInVisible === -1) {
        profileWithChanges.thresholds.push(threshold);
      } else {
        const childForm = this.childForms[indexInVisible];
        const thresholdWithChanges = this.composeThresholdFromInputs(threshold, childForm);
        profileWithChanges.thresholds.push(thresholdWithChanges);
      }
    }

    return profileWithChanges;
  }

  composeThresholdFromInputs(threshold: Threshold, childForm: FormGroup): Threshold {
    const thresholdWithChanges = new Threshold(threshold.parameter);
    thresholdWithChanges.id = threshold.id;

    thresholdWithChanges.isMinorOn = childForm.controls['isMinorOn'].value;
    thresholdWithChanges.isMajorOn = childForm.controls['isMajorOn'].value;
    thresholdWithChanges.isCriticalOn = childForm.controls['isCriticalOn'].value;
    thresholdWithChanges.minor = childForm.controls['minorValue'].value;
    thresholdWithChanges.major = childForm.controls['majorValue'].value;
    thresholdWithChanges.critical = childForm.controls['criticalValue'].value;

    return thresholdWithChanges;
  }

  onApplyClicked() {
    const profileToSend = this.composeAlarmProfileFromInputs();
    if (this.isAddNew) {
      this.store.dispatch(AlarmProfilesActions.createAlarmProfile({ profile: profileToSend }));
    } else {
      this.store.dispatch(AlarmProfilesActions.updateAlarmProfile({ profile: profileToSend }));
    }
    this.dialogRef.close();
  }

  OnRemoveClicked() {
    const confirmation = this.dialog.open(ConfirmationComponent, {
      maxHeight: '95vh',
      maxWidth: '95vw',
      disableClose: true,
      data: {
        title: this.profile.name,
        message: this.ts.instant('i18n.alarm-profiles.confirm-remove'),
        mode: 'remove'
      }
    });

    confirmation.closed.subscribe((result) => {
      if (result) {
        this.store.dispatch(
          AlarmProfilesActions.deleteAlarmProfile({ alarmProfileId: this.profile.id })
        );
        this.dialogRef.close();
      }
    });
  }

  onDiscardClicked() {
    this.dialogRef.close();
  }
}
