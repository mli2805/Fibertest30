import { Component, Input } from '@angular/core';
import { RftsLevel } from 'src/app/core/store/models/ft30/rfts-events-dto';

@Component({
    selector: 'rtu-rfts-events-level',
    templateUrl: './rfts-events-level.component.html',
    styleUrls: ['./rfts-events-level.component.scss'],
    standalone: false
})
export class RftsEventsLevelComponent {
  @Input() level!: RftsLevel;
}
