import { Component } from '@angular/core';

@Component({
  selector: 'rtu-eof-threshold-help',
  templateUrl: './eof-threshold-help.component.html'
})
export class EofThresholdHelpComponent {
  closeClicked() {
    close();
  }
}
