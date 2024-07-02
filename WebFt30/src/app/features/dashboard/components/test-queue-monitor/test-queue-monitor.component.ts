import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, OtausSelectors, TestQueueSelectors, UsersSelectors } from 'src/app/core';
import { ConvertUtils } from 'src/app/core/convert.utils';
import { CoreUtils } from 'src/app/core/core.utils';

@Component({
  selector: 'rtu-test-queue-monitor',
  templateUrl: 'test-queue-monitor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestQueueMonitorComponent {
  convertUtils = ConvertUtils;

  last$ = this.store.select(TestQueueSelectors.selectLast);
  current$ = this.store.select(TestQueueSelectors.selectCurrent);

  constructor(public store: Store<AppState>) {}

  getOtauPortPathByMonitoringPortId(monitoringPortId: number) {
    return CoreUtils.getCurrentState(
      this.store,
      OtausSelectors.selectOtauPathByMonitoringPortId(monitoringPortId)
    );
  }

  getUserById(userId: string) {
    return CoreUtils.getCurrentState(this.store, UsersSelectors.selectUserById(userId));
  }
}
