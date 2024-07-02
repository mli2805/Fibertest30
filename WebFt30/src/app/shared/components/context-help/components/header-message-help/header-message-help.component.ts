import { Component, Input } from '@angular/core';

export interface HeaderMessageTooltip {
  header?: string;
  message: string;
}

@Component({
  selector: 'rtu-front-panel-check-help',
  template: `
    <div class="help-tooltip flex w-48 flex-col p-2">
      <div *ngIf="header" class=" mb-3 text-sm">{{ header | translate }}</div>
      <div class="">
        {{ message | translate }}
      </div>
    </div>
  `
})
export class HeaderMessageHelpComponent implements HeaderMessageTooltip {
  @Input() header?: string;
  @Input() message!: string;
}
