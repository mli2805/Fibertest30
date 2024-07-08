import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'rtu-collapse-branch',
  template: `
    <div class="cursor-pointer ">
      <!-- prettier-ignore -->
      <svg fill="currentcolor" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" xml:space="preserve">
        <style type="text/css">
        	.st0{fill:none;}
        </style>
        <path d="M6.5,8.5l6,7l6-7H6.5z"/>
        <rect class="st0" width="24" height="24"/>
        <rect class="st0" width="24" height="24"/>
      </svg>
    </div>
  `,
  styles: [
    `
      :host {
        display: inline-block;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollapseBranchComponent {}
