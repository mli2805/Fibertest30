import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/core/store/models';

@Component({
    selector: 'rtu-user-avatar',
    templateUrl: 'user-avatar.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [
        `
      :host {
        display: flex;
      }
    `
    ],
    standalone: false
})
export class UserAvatarComponent {
  @Input() size: 'small' | 'normal' = 'normal';
  @Input() firstName: string | null = null;
  @Input() lastName: string | null = null;
}
