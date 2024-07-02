import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Threshold, ThresholdParameter } from 'src/app/core/store/models/threshold';
import { ThresholdLimits } from 'src/app/shared/utils/threshold-limits';
import { ValidationUtils } from 'src/app/shared/utils/validation-utils';

export class ThresholdFormFactory {
  static create(thresholdInWork: Threshold) {
    const validators = this.getOneValueValidators(thresholdInWork.parameter);

    const formGroup = new FormGroup({
      isMinorOn: new FormControl(thresholdInWork.isMinorOn),
      isMajorOn: new FormControl(thresholdInWork.isMajorOn),
      isCriticalOn: new FormControl(thresholdInWork.isCriticalOn),

      minorValue: new FormControl(thresholdInWork.minor, validators),
      majorValue: new FormControl(thresholdInWork.major, validators),
      criticalValue: new FormControl(thresholdInWork.critical, validators)
    });
    formGroup.setValidators(this.levelOrderValidator);
    return formGroup;
  }

  static getOneValueValidators(thresholdParameter: ThresholdParameter): ValidatorFn[] {
    const validators: ValidatorFn[] = [
      Validators.required,
      Validators.min(ThresholdLimits.Get(thresholdParameter)!.Min),
      Validators.max(ThresholdLimits.Get(thresholdParameter)!.Max),
      this.createPrecisionLimitValidator(thresholdParameter)
    ];

    return validators;
  }

  static createPrecisionLimitValidator(thresholdParameter: ThresholdParameter): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === '') return null;
      if (Number.isNaN(Number(control.value))) return { nan: { value: '' } };

      const patternForDecials = ValidationUtils.DecimalsNoMoreThan(
        ThresholdLimits.Get(thresholdParameter)!.Precision
      );

      const regex = new RegExp(patternForDecials);
      return regex.test(control.value) ? null : { precision: { value: '' } };
    };
  }

  static levelOrderValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const minor = control.get('minorValue');
    const major = control.get('majorValue');
    const critical = control.get('criticalValue');
    const isMinorOn = control.get('isMinorOn');
    const isMajorOn = control.get('isMajorOn');
    const isCriticalOn = control.get('isCriticalOn');

    if (!minor) return null; // component is not ready

    const result =
      (isMinorOn!.value === true &&
        isMajorOn!.value === true &&
        minor.value !== '' &&
        major!.value !== '' &&
        minor.value > major!.value) ||
      (isMinorOn!.value === true &&
        isCriticalOn!.value === true &&
        minor.value !== '' &&
        critical!.value !== '' &&
        minor.value > critical!.value) ||
      (isMajorOn!.value === true &&
        isCriticalOn!.value === true &&
        major!.value !== '' &&
        critical!.value !== '' &&
        major!.value > critical!.value)
        ? { incorrectLevelOrder: { value: '' } }
        : null;

    return result;
  };
}
