import { Component, inject, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core';
import { NetAddress } from 'src/app/core/store/models/ft30/net-address';
import { RtuMgmtActions } from 'src/app/core/store/rtu-mgmt/rtu-mgmt.actions';
import { RtuMgmtSelectors } from 'src/app/core/store/rtu-mgmt/rtu-mgmt.selectors';

@Component({
  selector: 'rtu-reserve-channel-test',
  templateUrl: './reserve-channel-test.component.html'
})
export class ReserveChannelTestComponent implements OnInit {
  @Input() networkAddress!: NetAddress;
  @Input() otherAddresses!: string[];
  @Input() isOn!: boolean; // задан ли резервный канал
  @Input() hasChangeRtuAddressPermission!: boolean;
  @Input() hasTestPermission!: boolean;

  public store: Store<AppState> = inject(Store);
  testInProgress$ = this.store.select(RtuMgmtSelectors.selectReserveChannelTesting);
  testSuccess$ = this.store.select(RtuMgmtSelectors.selectReserveChannelSuccess);
  testFailure$ = this.store.select(RtuMgmtSelectors.selectReserveChannelErrorId);

  form!: FormGroup;

  ngOnInit(): void {
    this.form = new FormGroup({
      ipAddress: new FormControl(this.networkAddress.ip4Address, [this.ipv4AddressValidator()])
    });
  }

  ipv4AddressValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.pristine) return null; // чтобы рамка не была красная у пустого адреса
      if (!/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/.test(control.value))
        return { invalidIp: { value: '' } };
      if (this.otherAddresses.findIndex((a) => a === control.value) !== -1)
        return { invalidIp: { value: 'must be unique' } };
      return null;
    };
  }

  isServerAddressValid() {
    return this.form.controls['ipAddress'].valid;
  }

  onSliderToggle() {
    this.isOn = !this.isOn;
  }

  isSettingsOff() {
    return !this.hasChangeRtuAddressPermission || !this.isOn;
  }

  composeInputs(): NetAddress {
    const address = new NetAddress();
    address.ip4Address = this.form.controls['ipAddress'].value;
    address.hostName = '';
    address.port = this.networkAddress.port;
    return address;
  }

  isTestDisabled(): boolean {
    return (
      this.form.controls['ipAddress'].value === '' ||
      !this.isServerAddressValid() ||
      !this.hasTestPermission
    );
  }

  onTestClicked() {
    this.store.dispatch(RtuMgmtActions.testReserveChannel({ netAddress: this.composeInputs() }));
  }
}
