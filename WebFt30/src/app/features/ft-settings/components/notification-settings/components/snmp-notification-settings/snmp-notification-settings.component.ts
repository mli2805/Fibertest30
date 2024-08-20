import { Component, Input, OnInit, ViewChild, inject } from '@angular/core';
import {
  NotificationSettings,
  TrapReceiver
} from '../../../../../../core/store/models/notification-settings';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState, FileSaverService } from 'src/app/core';
import { NotificationSettingsActions } from 'src/app/core/store/notification-settings/notification-settings.action';
import { InputPasswordWithEyeComponent } from 'src/app/shared/components/input-password-with-eye/input-password-with-eye.component';
import { TranslateService } from '@ngx-translate/core';
import { NotificationSettingsSelectors } from 'src/app/core/store/notification-settings/notification-settings.selectors';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'rtu-snmp-notification-settings',
  templateUrl: './snmp-notification-settings.component.html',
  styleUrls: ['./snmp-notification-settings.component.css']
})
export class SnmpNotificationSettingsComponent implements OnInit {
  @Input() trapReceiver!: TrapReceiver;
  @Input() hasPermission!: boolean;

  @ViewChild('pswAuthentication') pswAuthenticationCmpt!: InputPasswordWithEyeComponent;
  @ViewChild('pswPrivacy') pswPrivacyCmpt!: InputPasswordWithEyeComponent;

  public store: Store<AppState> = inject(Store);
  testingTrapReceiver$ = this.store.select(NotificationSettingsSelectors.selectTestingTrapReceiver);
  testSuccess$ = this.store.select(NotificationSettingsSelectors.selectTestTrapReceiverSuccess);
  testFailureId$ = this.store.select(
    NotificationSettingsSelectors.selectTestingTrapReceiverFailureId
  );

  form!: FormGroup;
  snmpVersions: string[] = ['v1', 'v3'];
  authenticationProtocols: string[] = ['None', 'MD5', 'SHA', 'SHA256', 'SHA384', 'SHA512'];
  privacyProtocols: string[] = ['None', 'Des', 'TripleDes', 'Aes128', 'Aes192', 'Aes256'];
  isVersion1!: boolean;
  passwordPlaceholder = this.ts.instant('i18n.common.blank-to-leave-unchanged');

  constructor(private ts: TranslateService, private fs: FileSaverService, private hc: HttpClient) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      enabled: new FormControl(this.trapReceiver.enabled),
      snmpVersion: new FormControl(this.trapReceiver.snmpVersion),
      useVeexOid: new FormControl(this.trapReceiver.useVeexOid),
      customOid: new FormControl(this.trapReceiver.customOid, [this.oidValidator()]),
      community: new FormControl(this.trapReceiver.community),
      authoritativeEngineId: new FormControl(this.trapReceiver.authoritativeEngineId, [
        this.engineIdValidator()
      ]),
      userName: new FormControl(this.trapReceiver.userName),
      authenticationProtocol: new FormControl(this.trapReceiver.authenticationProtocol),
      privacyProtocol: new FormControl(this.trapReceiver.privacyProtocol),
      trapReceiverAddress: new FormControl(this.trapReceiver.trapReceiverAddress, [
        this.trapReceiverAddressValidator()
      ]),
      trapReceiverPort: new FormControl(this.trapReceiver.trapReceiverPort, [
        this.trapReceiverPortValidator()
      ])
    });

    this.isVersion1 = this.trapReceiver.snmpVersion === 'v1';
    this.customOidInputEnabled = !this.trapReceiver.useVeexOid;
  }

  oidValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.pristine) return null;
      if (/^([1])((\.0)|(\.[1-9][0-9]*))*$/.test(control.value)) return null;
      return { wrongOid: { value: '' } };
    };
  }

  engineIdValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.pristine) return null;
      if (control.value.length === 0 || control.value.length % 2 === 1)
        return { wrongLengthEngineId: { value: '' } };
      if (/^[0-9A-Fa-f]+$/.test(control.value)) return null;
      return { wrongSymbolEngineId: { value: '' } };
    };
  }

  trapReceiverAddressValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.pristine) return null;
      if (!/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/.test(control.value))
        return { invalidIp: { value: '' } };
      return null;
    };
  }

  trapReceiverPortValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.pristine) return null;
      if (!/^[0-9]+$/.test(control.value)) return { invalidIp: { value: '' } };
      return null;
    };
  }

  isAuthoritativeEngineIdValid() {
    if (this.form.controls['authoritativeEngineId'].pristine) return true;
    return this.form.controls['authoritativeEngineId'].valid;
  }

  isCustomOidValid() {
    if (this.form.controls['customOid'].pristine) return true;
    if (this.form.controls['useVeexOid'].value === true) return true;
    return this.form.controls['customOid'].valid;
  }

  isTrapReceiverAddressValid() {
    if (this.form.controls['trapReceiverAddress'].pristine) return true;
    return this.form.controls['trapReceiverAddress'].valid;
  }

  isTrapReceiverPortValid() {
    if (this.form.controls['trapReceiverPort'].pristine) return true;
    return this.form.controls['trapReceiverPort'].valid;
  }

  isCommunityValid() {
    if (this.form.controls['community'].pristine) return true;

    return (
      this.form.controls['snmpVersion'].value === 'v3' ||
      !this.isNullOrEmpty(this.form.controls['community'].value)
    );
  }

  isSettingsOff() {
    return !this.form.controls['enabled'].value;
  }

  isSlidersDisabled() {
    return !this.hasPermission || this.isSettingsOff();
  }

  onVersionChanged(value: string) {
    this.isVersion1 = value === 'v1';
  }

  customOidInputEnabled!: boolean;
  onUseVeexOidChanged() {
    this.customOidInputEnabled = !this.customOidInputEnabled;
  }

  authenticationPassword = '';
  authenticationPasswordChanged = false;
  onAuthenticationPasswordChanged(event: string) {
    this.authenticationPassword = event;
    this.authenticationPasswordChanged = true;
  }

  privacyPassword = '';
  privacyPasswordChanged = false;
  onPrivacyPasswordChanged(event: string) {
    this.privacyPassword = event;
    this.privacyPasswordChanged = true;
  }

  composeTrapReceiverInputs(): TrapReceiver {
    const receiver = new TrapReceiver();
    receiver.enabled = this.form.controls['enabled'].value;
    receiver.snmpVersion = this.form.controls['snmpVersion'].value;
    receiver.useVeexOid = this.form.controls['useVeexOid'].value;
    receiver.customOid = this.form.controls['customOid'].value;

    if (this.form.controls['snmpVersion'].value === 'v1') {
      receiver.community = this.form.controls['community'].value;
    } else {
      receiver.authoritativeEngineId = this.form.controls['authoritativeEngineId'].value;
      receiver.userName = this.form.controls['userName'].value;
      receiver.authenticationPassword = this.authenticationPassword;
      receiver.authenticationProtocol = this.form.controls['authenticationProtocol'].value;
      receiver.privacyPassword = this.privacyPassword;
      receiver.privacyProtocol = this.form.controls['privacyProtocol'].value;
    }
    receiver.trapReceiverAddress = this.form.controls['trapReceiverAddress'].value;
    receiver.trapReceiverPort = +this.form.controls['trapReceiverPort'].value;

    return receiver;
  }

  composeInputs(): NotificationSettings {
    const settings = new NotificationSettings();
    settings.id = 1;
    settings.trapReceiver = this.composeTrapReceiverInputs();
    return settings;
  }

  isCommonFieldsValid(): boolean {
    if (
      this.form.controls['useVeexOid'].value === false &&
      this.isNullOrEmpty(this.form.controls['customOid'].value)
    )
      return false;

    if (this.isNullOrEmpty(this.form.controls['trapReceiverAddress'].value)) return false;
    return true;
  }

  isV1Valid(): boolean {
    if (this.isNullOrEmpty(this.form.controls['community'].value)) return false;
    return true;
  }

  isV3Valid(): boolean {
    if (!this.form.controls['authoritativeEngineId'].valid) return false;
    if (this.isNullOrEmpty(this.form.controls['userName'].value)) return false;
    if (this.isNullOrEmpty(this.form.controls['authenticationProtocol'].value)) return false;
    if (this.isNullOrEmpty(this.form.controls['privacyProtocol'].value)) return false;
    return true;
  }

  isAllValid(): boolean {
    if (!this.isCommonFieldsValid()) return false;
    if (this.form.controls['snmpVersion'].value === 'v1') return this.isV1Valid();
    else return this.isV3Valid();
  }

  isNullOrEmpty(str: string): boolean {
    return str === null || str.length === 0;
  }

  isTestEnabled(): boolean {
    if (this.form.controls['enabled'].value === false) return false;
    return this.isAllValid();
  }

  isApplyEnabled(): boolean {
    return (
      (!this.form.pristine || this.authenticationPasswordChanged || this.privacyPasswordChanged) &&
      this.isAllValid()
    );
  }

  onTestSnmpClicked() {
    this.store.dispatch(
      NotificationSettingsActions.testTrapReceiverSettings({
        trapReceiver: this.composeTrapReceiverInputs()
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

  saveMib() {
    this.hc.get('assets/snmp/Rfts400.mib', { responseType: 'text' }).subscribe((data) => {
      this.fs.saveAs(new TextEncoder().encode(data), 'Rfts400.mib');
    });
  }
}
