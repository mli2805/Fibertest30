import { Component, Input } from '@angular/core';
import { FormGroup, ValidationErrors } from '@angular/forms';
import { ThresholdParameter } from 'src/app/core/store/models/threshold';

@Component({
  selector: 'rtu-threshold-edit',
  templateUrl: './threshold-edit.component.html'
})
export class ThresholdEditComponent {
  @Input() form!: FormGroup;
  @Input() parameter!: ThresholdParameter;

  isMinorOff(): boolean {
    return !this.form.controls['isMinorOn'].value;
  }

  isMajorOff(): boolean {
    return !this.form.controls['isMajorOn'].value;
  }

  isCriticalOff(): boolean {
    return !this.form.controls['isCriticalOn'].value;
  }

  isMinorValid(): boolean {
    const minor = this.form.controls['minorValue'];
    const major = this.form.controls['majorValue'];
    const critical = this.form.controls['criticalValue'];

    if (!minor.pristine && !minor.valid) return false;
    if (this.form.valid) return true;

    if (!minor.value) return true;

    return !(
      (major.value && minor.value > major.value) ||
      (critical.value && minor.value > critical.value)
    );
  }

  isMajorValid(): boolean {
    const minor = this.form.controls['minorValue'];
    const major = this.form.controls['majorValue'];
    const critical = this.form.controls['criticalValue'];

    if (!major.pristine && !major.valid) return false;
    if (this.form.valid) return true;

    if (!major.value) return true;

    return !(
      (minor.value && minor.value > major.value) ||
      (critical.value && major.value > critical.value)
    );
  }

  isCriticalValid(): boolean {
    const minor = this.form.controls['minorValue'];
    const major = this.form.controls['majorValue'];
    const critical = this.form.controls['criticalValue'];

    if (!critical.pristine && !critical.valid) return false;
    if (this.form.valid) return true;

    if (!critical.value) return true;

    return !(
      (minor.value && minor.value > critical.value) ||
      (major.value && major.value > critical.value)
    );
  }

  getValidationErrorsFor(inputControlName: string): ValidationErrors | null {
    const controlErrors = this.form.controls[inputControlName].errors;
    if (!controlErrors) return this.form.errors;

    if (!this.form.errors) return controlErrors;

    // both
    const merge = controlErrors;
    for (const key of Object.keys(this.form.errors)) {
      merge[key] = { value: '' };
    }
    return merge;
  }

  onIsMinorOnChanged() {
    if (this.form.controls['minorValue'].value === null)
      this.form.controls['minorValue'].setValue(0);
  }

  onIsMajorOnChanged() {
    if (this.form.controls['majorValue'].value === null)
      this.form.controls['majorValue'].setValue(0);
  }

  onIsCriticalOnChanged() {
    if (this.form.controls['criticalValue'].value === null)
      this.form.controls['criticalValue'].setValue(0);
  }
}
