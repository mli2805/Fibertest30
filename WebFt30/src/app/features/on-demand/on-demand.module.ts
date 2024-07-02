import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { OnDemandComponent } from './on-demand/on-demand.component';
import { OnDemandRoutingModule } from './on-demand-routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { OnDemandAvailableActionsComponent } from './components/available-actions/on-demand-available-actions.component';
import { OnDemandTestSettingsComponent } from './components/test-settings/on-demand-test-settings.component';
import { FiberizerCoreModule } from '../fiberizer-core/fiberizer-core.module';
import { MeasurementModule } from '../shared/measurement/measurement.module';

@NgModule({
  imports: [
    FiberizerCoreModule,
    OnDemandRoutingModule,
    MeasurementModule,
    SharedModule,
    TranslateModule.forChild()
  ],
  exports: [],
  declarations: [
    OnDemandComponent,
    OnDemandAvailableActionsComponent,
    OnDemandTestSettingsComponent
  ],
  providers: []
})
export class OnDemandModule {}
