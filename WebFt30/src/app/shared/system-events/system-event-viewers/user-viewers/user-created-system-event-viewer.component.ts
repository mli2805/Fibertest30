import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, UsersSelectors } from 'src/app/core';
import { CoreUtils } from 'src/app/core/core.utils';
import { SystemEvent, User } from 'src/app/core/store/models';
import { UserCreatedData } from '../../system-event-data';

@Component({
    template: `<div>
    {{ 'i18n.system-events-viewer.user-created' | translate }}:
    <span class="text-data-highlight" *ngIf="user">{{ user.fullName }}</span>
  </div> `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class UserCreatedSystemEventViewerComponent {
  public data!: UserCreatedData;
  public user: User | null = null;

  @Input() set systemEvent(value: SystemEvent) {
    this.data = <UserCreatedData>JSON.parse(value.jsonData);

    // User can be null if it was deleted
    this.user =
      CoreUtils.getCurrentState(this.store, UsersSelectors.selectUserById(this.data.UserId)) ??
      null;
  }

  constructor(private store: Store<AppState>) {}
}
