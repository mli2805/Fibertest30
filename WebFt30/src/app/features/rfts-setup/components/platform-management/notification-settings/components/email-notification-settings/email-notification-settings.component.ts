import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewChild,
  inject
} from '@angular/core';
import {
  EmailServer,
  NotificationSettings
} from '../../../../../../../core/store/models/notification-settings';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core';
import { NotificationSettingsActions } from 'src/app/core/store/notification-settings/notification-settings.action';
import { InputPasswordWithEyeComponent } from 'src/app/shared/components/input-password-with-eye/input-password-with-eye.component';
import { NotificationSettingsSelectors } from 'src/app/core/store/notification-settings/notification-settings.selectors';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'rtu-email-notification-settings',
  templateUrl: './email-notification-settings.component.html',
  styleUrls: ['./email-notification-settings.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailNotificationSettingsComponent implements OnInit {
  @Input() emailServer!: EmailServer;
  @Input() hasPermission!: boolean;

  @ViewChild('psw') passwordCmpt!: InputPasswordWithEyeComponent;

  public store: Store<AppState> = inject(Store);
  testingEmailServer$ = this.store.select(NotificationSettingsSelectors.selectTestingEmailServer);
  testSuccess$ = this.store.select(NotificationSettingsSelectors.selectTestEmailServerSuccess);
  testFailureId$ = this.store.select(
    NotificationSettingsSelectors.selectTestingEmailServerFailureId
  );

  portsMap = new Map(Object.entries({ '587 STARTTLS': 587, '465 TLS': 465, '25 STARTTLS': 25 }));
  ports: string[] = ['587 STARTTLS', '465 TLS', '25 STARTTLS'];
  selectedPort!: string;
  form!: FormGroup;
  passwordPlaceholder = this.ts.instant('i18n.common.blank-to-leave-unchanged');
  isAuthenticationOn!: boolean;

  constructor(private ts: TranslateService) {}

  ngOnInit(): void {
    this.selectedPort = this.getByNumber(this.emailServer.smtpServerPort);

    this.form = new FormGroup({
      enabled: new FormControl(this.emailServer.enabled),
      smtpServerAddress: new FormControl(this.emailServer.smtpServerAddress, [Validators.required]),
      smtpServerPort: new FormControl(this.selectedPort),
      outgoingAddress: new FormControl(this.emailServer.outgoingAddress, [
        Validators.required,
        Validators.email
      ]),
      isAuthenticationOn: new FormControl(this.emailServer.isAuthenticationOn),
      serverUserName: new FormControl(this.emailServer.serverUserName),
      verifyCertificate: new FormControl(this.emailServer.verifyCertificate),
      floodingPolicy: new FormControl(this.emailServer.floodingPolicy),
      smsOverSmtp: new FormControl(this.emailServer.smsOverSmtp)
    });

    this.isAuthenticationOn = this.emailServer.isAuthenticationOn;
  }

  getByNumber(n: number): string {
    const dd = [...this.portsMap.entries()].filter(({ 1: v }) => v === n).map(([k]) => k);
    return dd[0];
  }

  onIsAuthenticationOnChanged() {
    this.isAuthenticationOn = !this.isAuthenticationOn;
  }

  isSettingsOff() {
    return !this.form.controls['enabled'].value;
  }

  isSlidersDisabled() {
    return !this.hasPermission || this.isSettingsOff();
  }

  isServerAddressValid() {
    return (
      this.form.controls['smtpServerAddress'].pristine ||
      this.form.controls['smtpServerAddress'].valid
    );
  }

  isEmailValid() {
    return (
      this.form.controls['outgoingAddress'].pristine || this.form.controls['outgoingAddress'].valid
    );
  }

  isUserNameValid() {
    return (
      this.form.controls['serverUserName'].pristine || this.form.controls['serverUserName'].valid
    );
  }

  composeEmailServerInputs(): EmailServer {
    const emailServer = new EmailServer();
    emailServer.enabled = this.form.controls['enabled'].value;
    emailServer.smtpServerAddress = this.form.controls['smtpServerAddress'].value;
    emailServer.smtpServerPort = this.portsMap.get(this.form.controls['smtpServerPort'].value)!;
    emailServer.outgoingAddress = this.form.controls['outgoingAddress'].value;

    const isAuthenticationOn = this.form.controls['isAuthenticationOn'].value;
    emailServer.isAuthenticationOn = isAuthenticationOn;
    if (isAuthenticationOn) {
      emailServer.serverUserName = this.form.controls['serverUserName'].value;
      emailServer.serverPassword = this.password;
    } else {
      emailServer.serverUserName = '';
      emailServer.serverPassword = '';
    }
    emailServer.isPasswordSet = false; // does not matter as long as it is not undefined

    emailServer.verifyCertificate = this.form.controls['verifyCertificate'].value;
    emailServer.floodingPolicy = this.form.controls['floodingPolicy'].value;
    emailServer.smsOverSmtp = this.form.controls['smsOverSmtp'].value;
    return emailServer;
  }

  composeInputs(): NotificationSettings {
    const settings = new NotificationSettings();
    settings.id = 1;
    settings.emailServer = this.composeEmailServerInputs();
    return settings;
  }

  passwordChanged = false;
  password = '';
  onPasswordChanged(event: string) {
    this.passwordChanged = true;
    this.password = event;
  }

  formValid(): boolean {
    if (
      this.form.controls['isAuthenticationOn'].value &&
      (this.form.controls['serverUserName'].value === '' ||
        (!this.emailServer.isPasswordSet && this.password === ''))
    )
      return false;
    return this.form.valid;
  }

  // for Test button
  formValidAndEmailsEnabled(): boolean {
    if (this.form.controls['enabled'].value === false) return false;
    return this.formValid();
  }

  isApplyEnabled(): boolean {
    if (
      this.form.controls['isAuthenticationOn'].value === true &&
      !this.emailServer.isPasswordSet &&
      this.password === ''
    )
      return false;

    return (!this.form.pristine || this.passwordChanged) && this.formValid();
  }

  onTestSmtpClicked() {
    this.store.dispatch(
      NotificationSettingsActions.testEmailServerSettings({
        emailServer: this.composeEmailServerInputs()
      })
    );
  }

  onApplyClicked() {
    this.store.dispatch(
      NotificationSettingsActions.updateNotificationSettings({
        settings: this.composeInputs()
      })
    );
    this.form.markAsPristine();
  }
}
