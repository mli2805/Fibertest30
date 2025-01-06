import { ChangeDetectionStrategy, Component, HostBinding, Input, OnInit } from '@angular/core';
import { AvailableActionBase } from './available-action-base';

@Component({
  selector: 'rtu-graph-sor-avaiable-action',
  template: ` <ng-container *ngIf="!isGraphMode">
      <rtu-graph-icon class="h-8 w-8" />
      <div class="my-auto text-center text-xs">
        {{ 'i18n.ft.switch-to-graph' | translate }}
      </div>
    </ng-container>
    <ng-container *ngIf="isGraphMode">
      <rtu-sor-icon class="h-8 w-8" />
      <div class="my-auto text-center text-xs">
        {{ 'i18n.ft.switch-to-sor' | translate }}
      </div>
    </ng-container>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GraphSorAvailableActionComponent extends AvailableActionBase {
  @Input() isGraphMode!: boolean;
}
