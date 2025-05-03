import { Component, Input } from '@angular/core';

@Component({
  selector: 'rtu-accident-scheme',
  templateUrl: './accident-scheme.component.html'
})
export class AccidentSchemeComponent {
  @Input() scheme!: string;
}
