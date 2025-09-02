import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'rtu-demo',
    templateUrl: 'demo.component.html',
    styles: [
        `
      :host {
        width: 100%;
        height: 100%;
      }
    `
    ],
    standalone: false
})
export class DemoComponent {}
