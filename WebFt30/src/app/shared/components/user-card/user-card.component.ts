import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { User } from 'src/app/core/store/models/user';

@Component({
  selector: 'rtu-user-card',
  templateUrl: './user-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserCardComponent {
  @Input() user!: User;
}
