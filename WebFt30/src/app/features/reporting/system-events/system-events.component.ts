import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, SystemEventsActions, SystemEventsSelectors } from 'src/app/core';
import { CoreUtils } from 'src/app/core/core.utils';
import { SystemEventLevel, SystemEventSource } from 'src/app/core/store/models';
import { OnDestroyBase } from 'src/app/shared/components/on-destroy-base/on-destroy-base';

@Component({
  selector: 'rtu-system-events',
  templateUrl: 'system-events.component.html',
  styles: [':host { overflow-y: auto; width: 100%; height: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemEventsComponent extends OnDestroyBase {
  systemEventsActions = SystemEventsActions;

  private store: Store<AppState> = inject(Store<AppState>);
  loading$ = this.store.select(SystemEventsSelectors.selectLoading);
  loadedTime$ = this.store.select(SystemEventsSelectors.selectLoadedTime);
  systemEvents$ = this.store.select(SystemEventsSelectors.selectEvents);
  errorMessageId$ = this.store.select(SystemEventsSelectors.selectErrorMessageId);

  levels = SystemEventLevel;

  constructor() {
    super();

    this.refresh(); // reload at start
  }

  refresh() {
    this.store.dispatch(SystemEventsActions.getSystemEvents());
  }

  getSource(source: SystemEventSource) {
    return CoreUtils.getSystemEventSource(this.store, source);
  }
}
