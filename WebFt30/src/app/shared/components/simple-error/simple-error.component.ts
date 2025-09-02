import { Component, Input } from '@angular/core';

@Component({
    selector: 'rtu-simple-error',
    templateUrl: 'simple-error.component.html',
    standalone: false
})
export class SimpleErrorComponent {
  @Input() error!: string;
}
