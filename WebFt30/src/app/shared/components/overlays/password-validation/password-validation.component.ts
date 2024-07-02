import { Component, Input, ChangeDetectionStrategy, ElementRef } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { OverlayBase } from '../overlay-base';

@Component({
  selector: 'rtu-password-validation',
  templateUrl: './password-validation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PasswordValidationComponent extends OverlayBase {
  @Input() errors: ValidationErrors | null = null;

  constructor(elementRef: ElementRef) {
    super(elementRef);
  }

  get isLength(): boolean {
    return this.errors !== null && !this.errors['8characters'];
  }

  get isUpper(): boolean {
    return this.errors !== null && !this.errors['1uppercase'];
  }

  get isLower(): boolean {
    return this.errors !== null && !this.errors['1lowercase'];
  }

  get isDigit(): boolean {
    return this.errors !== null && !this.errors['1digit'];
  }
  get isSpecial(): boolean {
    return this.errors !== null && !this.errors['1special'];
  }
}
