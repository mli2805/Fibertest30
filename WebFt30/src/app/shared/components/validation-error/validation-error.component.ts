import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Component({
  selector: 'rtu-validation-error',
  templateUrl: 'validation-error.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ValidationErrorComponent {
  @Input() errors: ValidationErrors | null = null;

  get showErrors(): boolean {
    // if (this.errors !== null) console.log(this.errors);
    return this.errors !== null;
  }
}
