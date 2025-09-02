import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, UsersSelectors } from 'src/app/core';
import { CoreUtils } from 'src/app/core/core.utils';
import { SystemEvent, User } from 'src/app/core/store/models';
import { UserChangedData } from '../../system-event-data';

//
@Component({
    template: `<div>
    {{ 'i18n.system-events-viewer.user-changed' | translate }}:
    <span class="text-data-highlight" *ngIf="user">{{ user.fullName }}</span>
    <div>
      {{ 'i18n.system-events-viewer.affected-properties' | translate }}:
      <span
        class="text-data-highlight"
        *ngFor="let prop of data.ChangedProperties; let isLast = last"
      >
        {{ getStringId(prop) | translate }}<ng-container *ngIf="!isLast">, </ng-container>
      </span>
    </div>
  </div> `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class UserChangedSystemEventViewerComponent {
  public data!: UserChangedData;
  public user: User | null = null;

  @Input() set systemEvent(value: SystemEvent) {
    this.data = <UserChangedData>JSON.parse(value.jsonData);

    // User can be null if it was deleted
    this.user =
      CoreUtils.getCurrentState(this.store, UsersSelectors.selectUserById(this.data.UserId)) ??
      null;
  }

  getStringId(prop: string) {
    // corresponding type is ApplicationUserPatch
    switch (prop) {
      case 'UserName':
        return 'i18n.user.username';
      case 'FirstName':
        return 'i18n.common.name';
      case 'LastName':
        return 'i18n.common.surname';
      case 'Email':
        return 'i18n.common.email';
      case 'PhoneNumber':
        return 'i18n.common.phone';
      case 'JobTitle':
        return 'i18n.common.job-title';
      case 'Role':
        return 'i18n.common.user-group';
      case 'Password':
        return 'i18n.common.password';
      default:
        return 'i18n.common.uknwown';
    }
  }

  constructor(private store: Store<AppState>) {}
}
