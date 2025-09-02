import { Component, Input } from '@angular/core';
import { FiberState } from 'src/app/core/store/models/ft30/ft-enums';

@Component({
    selector: 'rtu-fiber-state-pictogram',
    templateUrl: './fiber-state-pictogram.component.html',
    standalone: false
})
export class FiberStatePictogramComponent {
  fiberState = FiberState;

  @Input() state!: FiberState;
}
