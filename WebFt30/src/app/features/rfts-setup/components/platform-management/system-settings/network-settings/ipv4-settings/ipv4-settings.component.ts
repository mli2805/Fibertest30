import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core';
import { NetworkSettings } from 'src/app/core/store/models/network-settings';

@Component({
  selector: 'rtu-ipv4-settings',
  templateUrl: './ipv4-settings.component.html',
  styleUrls: ['./ipv4-settings.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Ipv4SettingsComponent implements OnInit {
  @Input() networkSettings!: NetworkSettings;

  form!: FormGroup;
  public store: Store<AppState> = inject(Store);

  ngOnInit(): void {
    this.form = new FormGroup({
      localIpAddress: new FormControl(this.networkSettings.localIpAddress, [
        this.ipv4AddressValidator()
      ]),
      localSubnetMask: new FormControl(this.networkSettings.localSubnetMask, [
        this.ipv4AddressValidator()
      ]),
      localGatewayIp: new FormControl(this.networkSettings.localGatewayIp, [
        this.ipv4AddressValidator()
      ]),
      primaryDnsServer: new FormControl(this.networkSettings.primaryDnsServer, [
        this.ipv4AddressValidator()
      ]),
      secondaryDnsServer: new FormControl(this.networkSettings.secondaryDnsServer, [
        this.ipv4AddressValidator()
      ])
    });
  }

  isLocalIpAddressValid(): boolean {
    return this.form.controls['localIpAddress'].valid;
  }
  isLocalSubnetMaskValid(): boolean {
    return this.form.controls['localSubnetMask'].valid;
  }
  isLocalGatewayIpValid(): boolean {
    return this.form.controls['localGatewayIp'].valid;
  }

  isPrimaryDnsServerValid(): boolean {
    if (
      this.form.controls['primaryDnsServer'].value === '' &&
      (this.form.controls['secondaryDnsServer'].value === '' ||
        this.form.controls['secondaryDnsServer'].value === null)
    )
      return true;
    return this.form.controls['primaryDnsServer'].valid;
  }
  isSecondaryDnsServerValid(): boolean {
    if (this.form.controls['secondaryDnsServer'].value === '') return true;
    return this.form.controls['secondaryDnsServer'].valid;
  }

  ipv4AddressValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.pristine) return null;
      if (!/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/.test(control.value))
        return { invalidIp: { value: '' } };
      return null;
    };
  }

  isSomethingChanged(): boolean {
    return !this.form.pristine;
  }

  isAllFormControlsValid(): boolean {
    return (
      this.isLocalIpAddressValid() &&
      this.isLocalSubnetMaskValid() &&
      this.isLocalGatewayIpValid() &&
      this.isPrimaryDnsServerValid() &&
      this.isSecondaryDnsServerValid()
    );
  }

  isChangedAndValid(): boolean {
    return !this.form.pristine && this.isAllFormControlsValid();
  }

  buildSettings(): NetworkSettings {
    const result = new NetworkSettings();
    result.networkMode = 'IPV4';
    result.localIpAddress = this.form.controls['localIpAddress'].value;
    result.localSubnetMask = this.form.controls['localSubnetMask'].value;
    result.localGatewayIp = this.form.controls['localGatewayIp'].value;
    result.primaryDnsServer = this.form.controls['primaryDnsServer'].value;
    result.secondaryDnsServer = this.form.controls['secondaryDnsServer'].value;
    return result;
  }
}
