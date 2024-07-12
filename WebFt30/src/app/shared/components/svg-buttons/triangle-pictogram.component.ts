import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'rtu-triangle-pictogram',
  template: `
    <div>
      <svg viewBox="0 0 40 40">
        <polygon [attr.fill]="fillColor" points="0,0 40,40 40,0	" />
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
export class TrianglePictogramComponent {
  @Input() fillColor!: string;

  //  [attr.stroke]="fillColor" [attr.fill]="fillColor"
}
