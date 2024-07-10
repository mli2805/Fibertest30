import { Component, Input } from '@angular/core';
import { TceLinkState } from 'src/app/core/store/models/ft30/ft-enums';

@Component({
  selector: 'rtu-tce-link-pictogram',
  templateUrl: './tce-link-pictogram.component.html'
})
export class TceLinkPictogramComponent {
  tceLinkState = TceLinkState;

  @Input() state!: TceLinkState;
}
