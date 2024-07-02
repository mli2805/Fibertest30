import { ChangeDetectionStrategy, Component, EventEmitter, Output, inject } from '@angular/core';
import { MeasurementSettignsService } from '../../../shared/measurement/components/measurement-settings/measurement-settings.service';
import { AppState, OnDemandActions, OnDemandSelectors, OtausSelectors } from 'src/app/core';
import { Store } from '@ngrx/store';
import { CoreUtils } from 'src/app/core/core.utils';
import { OtauPortPath } from 'src/app/core/store/models';

@Component({
  selector: 'rtu-on-demand-test-settings',
  templateUrl: 'on-demand-test-settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OnDemandTestSettingsComponent {
  store: Store<AppState> = inject(Store);
  allOnlinePorts$ = this.store.select(OtausSelectors.selectAllOnlinePorts);
  otauPortPath$ = this.store.select(OnDemandSelectors.selectOtauPortPath);

  constructor(public settingsService: MeasurementSettignsService) {
    const allPorts = CoreUtils.getCurrentState(this.store, OtausSelectors.selectAllOnlinePorts);
    const otauPortPath = CoreUtils.getCurrentState(
      this.store,
      OnDemandSelectors.selectOtauPortPath
    );
    if (otauPortPath == null && allPorts.length > 0) {
      this.store.dispatch(OnDemandActions.setOtauPortPath({ otauPortPath: allPorts[0] }));
    }
  }

  setTestPort(otauPortPath: OtauPortPath) {
    this.store.dispatch(OnDemandActions.setOtauPortPath({ otauPortPath }));
  }
}
