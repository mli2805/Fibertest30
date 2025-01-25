import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'rtu-square-pictogram',
  template: `
    <div style="width:12px; height:12px">
      <div *ngIf="fillColor === 'none'">
        <svg viewBox="0 0 40 40">
          <path
            [attr.stroke]="'currentColor'"
            [attr.fill]="'none'"
            d="M37,3v34H3V3H37 M40,0H0v40h40V0L40,0z"
          />
        </svg>
      </div>
      <div *ngIf="fillColor !== 'none'">
        <!-- prettier-ignore -->
        <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" >
        <path stroke="currentColor" d="M3 4.281v16.437A1.282 1.282 0 0 0 4.281 22h16.437A1.282 1.282 0 0 0 22 20.718V4.281A1.281 1.281 0 0 0 20.719 3H4.28A1.281 1.281 0 0 0 3 4.281zM20.719 4a.281.281 0 0 1 .281.281V20.72a.281.281 0 0 1-.281.281H4.28a.281.281 0 0 1-.28-.282V4.28A.281.281 0 0 1 4.281 4z"/>
        <path [attr.fill]="fillColor"  d="M0 0h24v24H0z"/>
      </svg>
      </div>
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
export class SquarePictogramComponent {
  @Input() fillColor!: string;
}
