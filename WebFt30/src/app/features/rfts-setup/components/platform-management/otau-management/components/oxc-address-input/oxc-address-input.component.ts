import { Component, Output, EventEmitter, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState, OtausSelectors } from 'src/app/core';
import { CoreUtils } from 'src/app/core/core.utils';
import { MapUtils } from 'src/app/core/map.utils';

@Component({
  selector: 'rtu-oxc-address-input',
  templateUrl: './oxc-address-input.component.html',
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
export class OxcAddressInputComponent {
  store: Store<AppState> = inject(Store<AppState>);
  @Output() changedValueEvent = new EventEmitter();

  allOxcsParams;
  form!: FormGroup;
  ip = '';
  port = 4001;

  constructor() {
    this.allOxcsParams = CoreUtils.getCurrentState(this.store, OtausSelectors.selectOtausOtaus)
      .filter((o) => o.type.toUpperCase() === 'OXC')
      .map((x) => MapUtils.toOxcOtauParameters(x.jsonParameters));

    this.form = new FormGroup({
      ipAddress: new FormControl(this.ip, [this.ipAddressValidator()]),
      port: new FormControl(this.port, [this.portValidator()])
    });
  }

  ipAddressValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.pristine) return null;
      if (!/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/.test(control.value))
        return { invalidIp: { value: '' } };
      return this.allOxcsParams.some((p) => p.Ip === control.value)
        ? { theSameIp: { value: '' } }
        : null;
    };
  }

  portValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const port = +control.value;
      return Number.isInteger(port) && port > 0 && port < 65536
        ? null
        : { invalidPort: { value: '' } };
    };
  }

  showIpInvalidBorder(): boolean {
    if (this.form.controls['ipAddress'].pristine) return false;
    return !this.form.controls['ipAddress'].valid;
  }

  showPortInvalidBorder(): boolean {
    return !this.form.controls['port'].valid;
  }

  public isFullIpAddressValid() {
    return !this.form.controls['ipAddress'].pristine && this.form.valid;
  }

  public getAddress() {
    return {
      ipAddress: this.form.controls['ipAddress'].value,
      port: +this.form.controls['port'].value
    };
  }

  public onAnyChange() {
    this.changedValueEvent.emit();
  }

  ipExists(ipAddress: string): boolean {
    const otaus = CoreUtils.getCurrentState(this.store, OtausSelectors.selectOtausOtaus);
    const oxcs = otaus.filter((o) => o.type.toUpperCase() === 'OXC');
    const oxcParams = oxcs.map((x) => MapUtils.toOxcOtauParameters(x.jsonParameters));
    const item = oxcParams.find((p) => p.Ip === ipAddress);
    return item !== undefined;
  }
}
