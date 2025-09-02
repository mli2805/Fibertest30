import { Component } from '@angular/core';

@Component({
    selector: 'rtu-eof-threshold-help',
    templateUrl: './eof-threshold-help.component.html',
    standalone: false
})
export class EofThresholdHelpComponent {
  closeClicked() {
    close();
  }
}
