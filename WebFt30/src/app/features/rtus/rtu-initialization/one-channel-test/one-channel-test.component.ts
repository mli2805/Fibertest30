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
  selector: 'rtu-one-channel-test',
  templateUrl: './one-channel-test.component.html'
})
export class OneChannelTestComponent implements OnInit {
  @Input() networkAddress!: NetAddress;
  @Input() isMain!: boolean;
  @Input() isOn!: boolean; // for reserve address

  public store: Store<AppState> = inject(Store);
  testInProgress$ = this.store.select(RtuMgmtSelectors.selectInProgress);
  testSuccess$ = this.store.select(RtuMgmtSelectors.selectIsTestSuccessful);
  testFailure$ = this.store.select(RtuMgmtSelectors.selectErrorMessageId);

  form!: FormGroup;

  ngOnInit(): void {
    this.form = new FormGroup({
      ipAddress: new FormControl(this.networkAddress.ip4Address, [this.ipv4AddressValidator()])
    });
  }

  ipv4AddressValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.pristine) return null;
      if (!/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/.test(control.value))
        return { invalidIp: { value: '' } };
      return null;
    };
  }

  isServerAddressValid() {
    return this.form.controls['ipAddress'].valid;
  }

  isSlidersDisabled() {
    return false;
  }

  isSettingsOff() {
    return !this.isOn;
  }

  composeInputs(): NetAddress {
    const address = new NetAddress();
    address.ip4Address = this.form.controls['ipAddress'].value;
    address.hostName = '';
    address.port = this.networkAddress.port;
    return address;
  }

  onTestClicked() {
    this.store.dispatch(RtuMgmtActions.testRtuConnection({ netAddress: this.composeInputs() }));
  }
}
