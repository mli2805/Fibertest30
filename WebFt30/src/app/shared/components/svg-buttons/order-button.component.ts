import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'rtu-order-button',
  template: `
    <div class="h-5 w-5 cursor-pointer">
      <!-- prettier-ignore -->
      <svg *ngIf="orderDescending" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" >
                    <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>

      <!-- prettier-ignore -->
      <svg *ngIf="!orderDescending" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
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
export class OrderButtonComponent {
  @Input() orderDescending!: boolean;
}
