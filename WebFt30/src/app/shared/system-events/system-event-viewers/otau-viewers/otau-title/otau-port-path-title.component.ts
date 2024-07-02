import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { OtauPortPath } from 'src/app/core/store/models';

@Component({
  selector: 'rtu-otau-port-path-title',
  template: `
    <ng-container *ngIf="otauPortPath">
      <span class="font-bold text-blue-600 dark:text-blue-400">
        {{ otauPortPath.ocmPort.portIndex }}</span
      >
      <ng-container *ngIf="otauPortPath.cascadePort">
        <span class="mx-1">/</span>
        <span>{{ otauPortPath.cascadePort.portIndex }}</span>
      </ng-container>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OtauPortPathTitleComponent {
  @Input() otauPortPath!: OtauPortPath;
}
