import { ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { WindowService } from 'src/app/app/pages/start-page/components/window.service';
import { AppState, RtuTreeActions, RtuTreeSelectors } from 'src/app/core';
import { CoreUtils } from 'src/app/core/core.utils';
import { AttachOtauDto } from 'src/app/core/store/models/ft30/attach-otau-dto';
import { NetAddress } from 'src/app/core/store/models/ft30/net-address';
import { PortOfOtau } from 'src/app/core/store/models/ft30/port-of-otau';
import { Rtu } from 'src/grpc-generated/rtu_tree';

@Component({
  selector: 'rtu-bop-attach',
  templateUrl: './bop-attach.component.html',
  standalone: false
})
export class BopAttachComponent implements OnInit {
  @Input() windowId!: string;
  @Input() zIndex!: number;
  @Input() payload!: any;

  public store: Store<AppState> = inject(Store);
  portOfOtau!: PortOfOtau;
  rtu!: Rtu;
  existingAddresses!: string[];

  form!: FormGroup;

  constructor(private windowService: WindowService) {}

  ngOnInit(): void {
    this.portOfOtau = this.payload.portOfOtau;
    this.rtu = this.payload.rtu;
    this.existingAddresses = CoreUtils.getCurrentState(
      this.store,
      RtuTreeSelectors.selectBopIps()
    )!;

    const initializeAddress = this.existingAddresses.includes('192.168.96.57')
      ? '192.168.96.'
      : '192.168.96.57';

    this.form = new FormGroup({
      ipAddress: new FormControl(initializeAddress, [this.ipv4AddressValidator()])
    });
  }

  ipv4AddressValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/.test(control.value))
        return { invalidIp: { value: '' } };
      return null;
    };
  }

  isBopAddressValid() {
    if (this.existingAddresses.includes(this.form.controls['ipAddress'].value)) return false;
    return this.form.controls['ipAddress'].valid;
  }

  isAttachDisabled() {
    return !this.isBopAddressValid();
  }

  onAttachClicked() {
    const dto = new AttachOtauDto();
    dto.opticalPort = this.portOfOtau.opticalPort;
    dto.netAddress = this.composeInputs();
    dto.rtuId = this.portOfOtau.rtuId!;

    this.store.dispatch(RtuTreeActions.attachOtau({ dto }));

    this.close();
  }

  composeInputs(): NetAddress {
    const address = new NetAddress();
    address.ip4Address = this.form.controls['ipAddress'].value;
    address.hostName = '';
    address.port = 11834;
    return address;
  }

  onCancelClicked() {
    this.close();
  }

  close() {
    this.windowService.unregisterWindow(this.windowId, 'BopAttach');
  }
}
