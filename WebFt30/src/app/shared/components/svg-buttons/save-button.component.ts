import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'rtu-save-button',
    template: `
    <div class="cursor-pointer ">
      <!-- prettier-ignore -->
      <svg  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 40 40" 
                    enable-background="new 0 0 40 40" xml:space="preserve">
                    <path fill="currentColor" d="M32,0H4C1.792,0,0,1.792,0,4v32c0,2.209,1.791,4,4,4h32c2.209,0,4-1.791,4-4V8L32,0z M11.5,2H21v10h-9.5V2z
                       M23,2h5.5v10H23V2z M31,38H9V25h22V38z M38,36c0,1.104-0.898,2-2,2h-3V25c0-1.104-0.896-2-2-2H9c-1.104,0-2,0.896-2,2v13H4
                      c-1.103,0-2-0.896-2-2V4c0-1.103,0.897-2,2-2h5.5v10c0,1.104,0.896,2,2,2h17c1.104,0,2-0.896,2-2V2h0.672L38,8.829V36z"/>
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
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class SaveButtonComponent {}
