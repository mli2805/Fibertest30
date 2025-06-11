import { Component, Input } from '@angular/core';

@Component({
  selector: 'rtu-group-box',
  templateUrl: './group-box.component.html',
  styleUrls: ['./group-box.component.scss']
})
export class GroupBoxComponent {
  @Input() header!: string;
}
