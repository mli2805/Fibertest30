import { NgModule } from '@angular/core';

import { GisComponent } from './gis/gis.component';
import { GisRoutingModule } from './gis-routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { GisMapComponent } from './components/gis-map/gis-map.component';
import { GisMapService } from './gis-map.service';
import { GisTraceViewerComponent } from './components/gis-trace-viewer/gis-trace-viewer.component';
import { GisViewerComponent } from './components/gis-viewer/gis-viewer.component';

@NgModule({
  imports: [GisRoutingModule, SharedModule],
  exports: [GisMapComponent, GisTraceViewerComponent, GisViewerComponent],
  declarations: [GisComponent, GisMapComponent, GisTraceViewerComponent, GisViewerComponent],
  providers: [GisMapService]
})
export class GisModule {}
