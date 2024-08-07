import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'rtu-description-label',
  templateUrl: 'description-label.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DescriptionLabelComponent {
  @Input() description!: string;
  @Input() label!: string;
}
