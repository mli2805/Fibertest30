import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectorRef, Component, ElementRef, Inject, ViewChild, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState, AuthSelectors, User, UsersSelectors } from 'src/app/core';
import { OneDayWorkHours } from './one-day-work-hours';
import { UsersActions } from 'src/app/core/store/users/users.actions';
import { ApplicationUserPatch } from './application-user-patch';
import { CoreUtils } from 'src/app/core/core.utils';
import { Role } from 'src/grpc-generated';
import { RtuDateToDayOfWeekPipe } from 'src/app/shared/pipes/day-of-week-pipe';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'rtu-user-edit-dialog',
    templateUrl: './user-edit-dialog.component.html',
    styleUrls: ['./user-edit-dialog.component.css'],
    standalone: false
})
export class UserEditDialogComponent {
  public dialogRef: DialogRef<boolean> = inject(DialogRef<boolean>);
  public store: Store<AppState> = inject(Store);
  public environment = environment;
  userForm!: FormGroup;

  allUsers;
  userInWork: User;
  loggedUser;
  isSelfEdit;
  isInCreationMode: boolean;
  requireFullNameAndPassword: boolean;

  @ViewChild('userNameInput') userNameInput!: ElementRef;
  isFirstNameEdit: boolean;
  firstNameValue = '';
  @ViewChild('firstNameInput') firstNameInput!: ElementRef;
  isLastNameEdit: boolean;
  lastNameValue = '';
  @ViewChild('lastNameInput') lastNameInput!: ElementRef;

  roles: string[];

  isScheduleOn!: boolean;
  week!: OneDayWorkHours[];

  openPasswordValidation = false;
  initialFormValueJson;

  outsidePageCall: boolean;
  adminProfileComplete: boolean;

  constructor(
    private cdr: ChangeDetectorRef,
    @Inject(DIALOG_DATA) private data: any,
    private dateNamePipe: RtuDateToDayOfWeekPipe
  ) {
    this.outsidePageCall = data.outsidePageCall ?? false;
    this.adminProfileComplete = data.adminProfileComplete ?? false;
    this.isInCreationMode = data.isInCreationMode;
    this.requireFullNameAndPassword = this.isInCreationMode || this.adminProfileComplete;

    this.roles = data.roles.map((x: Role) => x.name);

    this.allUsers = CoreUtils.getCurrentState(this.store, UsersSelectors.selectUsersUsers);
    this.userInWork = data.user;
    this.loggedUser = CoreUtils.getCurrentState(this.store, AuthSelectors.selectUser);
    this.isSelfEdit = this.loggedUser?.name === this.userInWork.name;

    this.isFirstNameEdit = false;
    this.firstNameValue = this.userInWork.firstName === undefined ? '' : this.userInWork.firstName;
    this.isLastNameEdit = false;
    this.lastNameValue = this.userInWork.lastName === undefined ? '' : this.userInWork.lastName;
    // this.isEmailVerified = true;
    // this.isPhoneVerified = true;
    this.p1InputType = 'password';

    this.userForm = new FormGroup({
      userName: new FormControl(this.userInWork.name, [
        Validators.required,
        this.usernameValidator()
      ]),
      firstName: new FormControl(this.userInWork.firstName),
      lastName: new FormControl(this.userInWork.lastName),
      role: new FormControl(
        { value: this.userInWork.role, disabled: this.isSelfEdit },
        Validators.required
      ),
      jobTitle: new FormControl(this.userInWork.jobTitle),
      email: new FormControl(this.userInWork.email, [Validators.email]),
      phone: new FormControl(this.userInWork.phoneNumber, [
        Validators.pattern('^\\+?[0-9]{5,15}$')
      ]),
      password: new FormControl(
        '',
        this.passwordSeparateValidator(this.requireFullNameAndPassword)
      ),
      repeatPassword: new FormControl('', [this.confirmedValidator()])
    });

    this.userForm.get('password')?.valueChanges.subscribe((_) => {
      this.userForm.controls['repeatPassword'].updateValueAndValidity();
    });

    this.initialFormValueJson = JSON.stringify(this.userForm.value);
    this.seedSchedule();
  }

  get passwordControl(): AbstractControl {
    return this.userForm.controls['password'];
  }

  usernameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.pristine) return null;
      const result = this.allUsers
        .filter((f) => f.id !== this.userInWork.id)
        .some((u) => u.name.toLowerCase() === control.value.toLowerCase());
      return result ? { notUnique: { value: '' } } : null;
    };
  }

  uppercaseRegex = new RegExp('[A-Z]');
  lowercaseRegex = new RegExp('[a-z]');
  digitRegex = new RegExp('[0-9]');
  specialCharacterRegex = new RegExp('[!@#$%^&*]');

  passwordSeparateValidator(required: boolean): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!required && control.value === '') return null;

      const map = new Map();
      if (control.value.length < 8) map.set('8characters', { value: '' });
      if (!this.uppercaseRegex.test(control.value)) map.set('1uppercase', { value: '' });
      if (!this.lowercaseRegex.test(control.value)) map.set('1lowercase', { value: '' });
      if (!this.digitRegex.test(control.value)) map.set('1digit', { value: '' });
      if (!this.specialCharacterRegex.test(control.value)) map.set('1special', { value: '' });

      if (map.size === 0) return null;
      const result = Object.fromEntries(map);
      return result;
    };
  }

  confirmedValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = this.userForm === undefined ? 'na' : this.userForm.get('password')!.value;
      const result = password !== control.value;
      return result ? { doNotMatch: { value: '' } } : null;
    };
  }

  onFirstNamePencilClicked() {
    this.isFirstNameEdit = true;
    this.cdr.detectChanges();
    this.firstNameInput.nativeElement.focus();
    if (this.isLastNameValid()) this.isLastNameEdit = false;
  }

  onFirstNameCheckmarkClicked() {
    if (this.isFirstNameValid()) this.isFirstNameEdit = false;
  }

  onLastNamePencilClicked() {
    this.isLastNameEdit = true;
    this.cdr.detectChanges();
    this.lastNameInput.nativeElement.focus();
    if (this.isFirstNameValid()) this.isFirstNameEdit = false;
  }

  onLastNameCheckmarkClicked() {
    if (this.isLastNameValid()) this.isLastNameEdit = false;
  }

  tryCloseFirstName() {
    this.firstNameValue = this.userForm.get('firstName')!.value;
    if (this.isFirstNameValid()) this.isFirstNameEdit = false;
  }

  isUserNameValid() {
    if (this.userForm.controls['userName'].pristine) return true;
    if (this.userForm.controls['userName'].dirty && this.userForm.get('userName')!.value === '')
      return false;

    return this.userForm.controls['userName'].valid;
  }
  isFirstNameValid() {
    return (
      this.userForm.controls['firstName'].pristine || this.userForm.controls['firstName'].valid
    );
  }

  tryCloseLastName() {
    this.lastNameValue = this.userForm.get('lastName')!.value;
    if (this.isLastNameValid()) this.isLastNameEdit = false;
  }

  isLastNameValid() {
    return this.userForm.controls['lastName'].pristine || this.userForm.controls['lastName'].valid;
  }

  isEmailValid() {
    return this.userForm.controls['email'].pristine || this.userForm.controls['email'].valid;
  }
  isPhoneValid() {
    return this.userForm.controls['phone'].valid;
  }
  isPasswordValid() {
    return this.passwordControl.pristine || this.passwordControl.valid;
  }
  isRepeatPasswordValid() {
    return this.userForm.controls['repeatPassword'].valid;
  }

  p1Show = true;
  p1InputType;
  onPasswordEyeClicked() {
    this.p1Show = !this.p1Show;
    this.p1InputType = this.p1Show ? 'password' : 'text';
  }

  hasFormChanged(): boolean {
    return this.initialFormValueJson !== JSON.stringify(this.userForm.value);
  }

  isApplyDisabled(): boolean {
    if (this.userForm.pristine) return true;
    if (!this.userForm.valid) return true;

    if (this.isInCreationMode || this.adminProfileComplete) {
      return (
        this.userForm.get('userName')!.value === '' || this.userForm.get('password')!.value === ''
      );
    } else {
      return !this.hasFormChanged();
    }
  }

  onApplyClicked() {
    if (this.userForm.dirty) {
      if (this.isInCreationMode) {
        const patch = this.collectToCreate();
        this.store.dispatch(UsersActions.createUser({ patch: patch }));
      } else {
        const patch = this.collectToUpdate();
        this.store.dispatch(
          UsersActions.updateUser({
            userId: this.userInWork.id,
            patch: patch,
            outsidePageCall: this.outsidePageCall
          })
        );
      }
    }

    this.dialogRef.close();
  }

  collectToCreate(): ApplicationUserPatch {
    const patch = new ApplicationUserPatch();
    patch.userName = this.userForm.get('userName')!.value;
    patch.firstName = this.firstNameValue ? '' : this.firstNameValue;
    patch.lastName = this.lastNameValue ? '' : this.lastNameValue;
    patch.role = this.userForm.get('role')!.value;
    patch.jobTitle = this.userForm.get('jobTitle')!.value;
    patch.email = this.userForm.get('email')!.value;
    patch.phoneNumber = this.userForm.get('phone')!.value;
    patch.password = this.userForm.get('password')!.value;
    return patch;
  }

  collectToUpdate(): ApplicationUserPatch {
    const patch = new ApplicationUserPatch();
    if (this.userInWork.firstName !== this.firstNameValue) patch.firstName = this.firstNameValue;
    if (this.userInWork.lastName !== this.lastNameValue) patch.lastName = this.lastNameValue;

    const newRole = this.userForm.get('role')!.value;
    if (newRole != this.userInWork.role) {
      patch.role = newRole;
    }

    const newJobTitle = this.userForm.get('jobTitle')!.value;
    if (newJobTitle !== this.userInWork.jobTitle) {
      patch.jobTitle = newJobTitle;
    }

    const newEmail = this.userForm.get('email')!.value;
    if (newEmail !== this.userInWork.email) {
      patch.email = newEmail;
    }

    const newPhone = this.userForm.get('phone')!.value;
    if (newPhone !== this.userInWork.phoneNumber) {
      patch.phoneNumber = newPhone;
    }

    const newPassword = this.userForm.get('password')!.value;
    if (newPassword !== '') {
      patch.password = newPassword;
    }
    return patch;
  }

  onDiscardClicked() {
    this.dialogRef.close();
  }

  OnDeleteClicked() {
    this.store.dispatch(UsersActions.deleteUser({ userId: this.userInWork.id }));
    this.dialogRef.close();
  }

  seedSchedule() {
    this.isScheduleOn = true;
    this.week = [];
    for (let index = 0; index < 7; index++) {
      const date = new Date(2023, 6, 3 + index); // from monday
      const day = new OneDayWorkHours(
        index < 5,
        this.dateNamePipe.transform(date),
        new Date(0, 0, 0, 8, 30),
        new Date(0, 0, 0, 17, 30)
      );
      this.week.push(day);
    }
  }
}
