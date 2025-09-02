import { Component, Input } from '@angular/core';

@Component({
    selector: 'rtu-group-box',
    templateUrl: './group-box.component.html',
    styleUrls: ['./group-box.component.scss'],
    standalone: false
})
export class GroupBoxComponent {
  @Input() header!: string;
}
