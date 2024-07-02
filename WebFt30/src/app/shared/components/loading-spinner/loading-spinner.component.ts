import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'rtu-loading-spinner',
  templateUrl: 'loading-spinner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [':host { display: block; }']
})
export class LoadingSpinnerComponent {}
