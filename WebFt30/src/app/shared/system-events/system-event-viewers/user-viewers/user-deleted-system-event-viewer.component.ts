import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core';
import { SystemEvent } from 'src/app/core/store/models';
import { UserDeletedData } from '../../system-event-data';

@Component({
    template: `<div>{{ 'i18n.system-events-viewer.user-deleted' | translate }}</div> `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class UserDeletedSystemEventViewerComponent {
  public data!: UserDeletedData;

  @Input() set systemEvent(value: SystemEvent) {
    this.data = <UserDeletedData>JSON.parse(value.jsonData);
  }

  constructor(private store: Store<AppState>) {}
}
