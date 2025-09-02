import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AvailableActionBase } from './available-action-base';

@Component({
    selector: 'rtu-expand-minimize-avaiable-action',
    template: ` <ng-container *ngIf="!fullScreen">
      <!-- prettier-ignore -->
      <svg *ngIf="!fullScreen" class="h-8 w-8" viewBox="0 0 100 100">
        <path d="M10 40 V10 H40 M60 10 H90 V40 M 90 60 V90 H60 M 40 90 H10 V60" stroke="currentColor" fill="none" stroke-width="10" />
      </svg>
      <div class="my-auto text-center text-xs">
        {{ 'i18n.ft.expand' | translate }}
      </div>
    </ng-container>
    <ng-container *ngIf="fullScreen">
      <!-- prettier-ignore -->
      <svg *ngIf="fullScreen"  class="h-8 w-8" viewBox="0 0 100 100">
        <path d="M10 40 H40 V10 M60 10 V40 H90 M 90 60 H60 V90 M 40 90 V60 H10" stroke="currentColor" fill="none" stroke-width="10" />
       </svg>
      <div class="my-auto text-center text-xs">
        {{ 'i18n.ft.minimize' | translate }}
      </div>
    </ng-container>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ExpandMinimizeAvailableActionComponent extends AvailableActionBase {
  @Input() fullScreen!: boolean;
}
