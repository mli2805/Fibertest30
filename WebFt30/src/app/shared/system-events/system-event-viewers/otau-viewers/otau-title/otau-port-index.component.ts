import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { OtauPort } from 'src/app/core/store/models';

@Component({
  selector: 'rtu-otau-port-index',
  template: `
    <ng-container *ngIf="otauPort">
      <div
        class="font-bold text-blue-600 dark:text-blue-400"
        [ngClass]="{
          'text-blue-600 dark:text-blue-400': !otauPort.unavailable && !forceUnavailable,
          'text-red-600 dark:text-red-400': otauPort.unavailable || forceUnavailable
        }"
      >
        {{ otauPort.portIndex }}
      </div>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OtauPortIndexComponent {
  @Input() otauPort!: OtauPort;
  @Input() forceUnavailable = false;
}
