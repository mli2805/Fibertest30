import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RtuTreeComponent } from './rtu-tree/rtu-tree.component';
import { RtuInformationComponent } from './rtu-information/rtu-information.component';
import { RtuInitializationComponent } from './rtu-initialization/rtu-initialization.component';
import { RtusComponent } from './rtus/rtus.component';
import { MeasurementClientComponent } from './measurement-client/measurement-client.component';
import { RtuMonitoringSettingsComponent } from './rtu-monitoring-settings/rtu-monitoring-settings.component';
import { TraceAssignBaseComponent } from './trace-assign-base/trace-assign-base.component';
import { RtuStateComponent } from './rtu-state/rtu-state.component';
import { TraceInformationComponent } from './trace-information/trace-information.component';
import { RtuLandmarksComponent } from './rtu-landmarks/rtu-landmarks.component';
import { TraceLandmarksComponent } from './trace-landmarks/trace-landmarks.component';

export const routes: Routes = [
  {
    path: '',
    component: RtusComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'rtu-tree'
      },
      {
        path: 'rtu-tree',
        pathMatch: 'full',
        component: RtuTreeComponent
      },
      {
        path: 'information/:id',
        pathMatch: 'full',
        component: RtuInformationComponent,
        data: { navigateToParent: 2 }
      },
      {
        path: 'trace-information/:id',
        pathMatch: 'full',
        component: TraceInformationComponent,
        data: { navigateToParent: 2 }
      },
      {
        path: 'initialization/:id',
        pathMatch: 'full',
        component: RtuInitializationComponent,
        data: { navigateToParent: 2 }
      },
      {
        path: 'state/:id',
        pathMatch: 'full',
        component: RtuStateComponent,
        data: { navigateToParent: 2 }
      },
      {
        path: 'landmarks/:id',
        pathMatch: 'full',
        component: RtuLandmarksComponent,
        data: { navigateToParent: 2 }
      },
      {
        path: 'trace-landmarks/:id',
        pathMatch: 'full',
        component: TraceLandmarksComponent,
        data: { navigateToParent: 2 }
      },
      {
        path: 'monitoring-settings/:id',
        pathMatch: 'full',
        component: RtuMonitoringSettingsComponent,
        data: { navigateToParent: 2 }
      },
      {
        path: 'measurement-client/:rtuId/:portName',
        pathMatch: 'full',
        component: MeasurementClientComponent,
        data: { navigateToParent: 3 }
      },
      {
        path: 'assign-base/:rtuId/:traceId',
        pathMatch: 'full',
        component: TraceAssignBaseComponent,
        data: { navigateToParent: 3 }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RtusRoutingModule {}
