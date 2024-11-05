import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectorRef, Component, Inject, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState, RtuTreeActions } from 'src/app/core';
import { AttachOtauDto } from 'src/app/core/store/models/ft30/attach-otau-dto';
import { NetAddress } from 'src/app/core/store/models/ft30/net-address';
import { PortOfOtau } from 'src/app/core/store/models/ft30/port-of-otau';

@Component({
  selector: 'rtu-bop-attach',
  templateUrl: './bop-attach.component.html',
  styles: [
    `
      :host {
        display: flex;
        width: 100%;
        height: 100%;
      }
    `
  ]
})
export class BopAttachComponent implements OnInit {
  public dialogRef: DialogRef<boolean> = inject(DialogRef<boolean>);
  public store: Store<AppState> = inject(Store);
  portOfOtau!: PortOfOtau;

  form!: FormGroup;

  constructor(@Inject(DIALOG_DATA) private data: any, private cdr: ChangeDetectorRef) {
    this.portOfOtau = data.portOfOtau;
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      ipAddress: new FormControl('192.168.96.57', [this.ipv4AddressValidator()])
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

  onAttachClicked() {
    const dto = new AttachOtauDto();
    dto.opticalPort = this.portOfOtau.opticalPort;
    dto.netAddress = this.composeInputs();
    dto.rtuId = this.portOfOtau.rtuId!;
    console.log(dto);

    this.store.dispatch(RtuTreeActions.attachOtau({ dto }));

    this.dialogRef.close();
  }

  composeInputs(): NetAddress {
    const address = new NetAddress();
    address.ip4Address = this.form.controls['ipAddress'].value;
    address.hostName = '';
    address.port = 11834;
    return address;
  }

  onCancelClicked() {
    this.dialogRef.close();
  }
}
