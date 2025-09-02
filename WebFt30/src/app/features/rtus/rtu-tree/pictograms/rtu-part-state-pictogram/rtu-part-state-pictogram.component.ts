import { Component, Input } from '@angular/core';
import { RtuPartState } from 'src/app/core/store/models/ft30/ft-enums';

@Component({
    selector: 'rtu-rtu-part-state-pictogram',
    templateUrl: './rtu-part-state-pictogram.component.html',
    standalone: false
})
export class RtuPartStatePictogramComponent {
  rtuPartState = RtuPartState;

  @Input() state!: RtuPartState;
}
