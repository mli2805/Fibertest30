import { Component, Input } from '@angular/core';

@Component({
    selector: 'rtu-tab-header',
    templateUrl: './tab-header.component.html',
    standalone: false
})
export class TabHeaderComponent {
  @Input() isSelected = false;
  @Input() content = '';
}
