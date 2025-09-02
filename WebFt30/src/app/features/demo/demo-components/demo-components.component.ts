import { Component } from '@angular/core';

@Component({
    selector: 'rtu-demo-components',
    templateUrl: 'demo-components.component.html',
    standalone: false
})
export class DemoComponentsComponent {
  checked: boolean[] = [true, false, false, true];
}
