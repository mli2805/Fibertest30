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
import { GraphService } from 'src/app/core/grpc';
import { NetAddress } from 'src/app/core/store/models/ft30/net-address';
import { RtuMgmtActions } from 'src/app/core/store/rtu-mgmt/rtu-mgmt.actions';
import { RtuMgmtSelectors } from 'src/app/core/store/rtu-mgmt/rtu-mgmt.selectors';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'rtu-main-channel-test',
  templateUrl: './main-channel-test.component.html',
  standalone: false
})
export class MainChannelTestComponent implements OnInit {
  @Input() networkAddress!: NetAddress;
  @Input() otherAddresses!: string[];
  @Input() hasChangeRtuAddressPermission!: boolean;
  @Input() hasTestPermission!: boolean;
  @Input() rtuId!: string;

  public store: Store<AppState> = inject(Store);
  testInProgress$ = this.store.select(RtuMgmtSelectors.selectMainChannelTesting);
  testSuccess$ = this.store.select(RtuMgmtSelectors.selectMainChannelSuccess);
  testFailure$ = this.store.select(RtuMgmtSelectors.selectMainChannelErrorId);

  form!: FormGroup;

  showClearButton = false;

  constructor(private graphService: GraphService) {
    if (!environment.production) {
      this.showClearButton = true;
    }
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.form = new FormGroup({
      ipAddress: new FormControl(this.networkAddress.ip4Address, [this.ipv4AddressValidator()])
    });
  }

  ipv4AddressValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
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
    this.store.dispatch(RtuMgmtActions.testMainChannel({ netAddress: this.composeInputs() }));
  }

  async onResetClicked() {
    const command = { RtuId: this.rtuId, IsMainAddress: true };
    const json = JSON.stringify(command);
    const response = await this.graphService.sendCommandAsync(json, 'ClearRtuAddress');
    if (response.success) {
      this.networkAddress = new NetAddress();
      this.networkAddress.ip4Address = '';
      this.networkAddress.port = -1;
      this.createForm();
    }
  }
}
