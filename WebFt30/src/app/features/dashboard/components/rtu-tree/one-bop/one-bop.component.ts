import { Component, Input } from '@angular/core';
import { Bop } from 'src/app/core/store/models/ft30/bop';

@Component({
  selector: 'rtu-one-bop',
  templateUrl: './one-bop.component.html',
  styleUrls: ['./one-bop.component.scss']
})
export class OneBopComponent {
  @Input() bop!: Bop;
}
