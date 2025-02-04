import { NgModule } from '@angular/core';

import { GisComponent } from './gis/gis.component';
import { GisRoutingModule } from './gis-routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { GisMapComponent } from './components/gis-map/gis-map.component';
import { GisMapService } from './gis-map.service';
import { GisTraceViewerComponent } from './components/gis-trace-viewer/gis-trace-viewer.component';
import { TraceDefineComponent } from './components/trace-define/trace-define.component';

@NgModule({
  imports: [GisRoutingModule, SharedModule],
  exports: [GisComponent, GisMapComponent, GisTraceViewerComponent],
  declarations: [GisComponent, GisMapComponent, GisTraceViewerComponent, TraceDefineComponent],
  providers: [GisMapService]
})
export class GisModule {}
