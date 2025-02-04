import { NgModule } from '@angular/core';

import { GisComponent } from './gis/gis.component';
import { GisRoutingModule } from './gis-routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { GisMapComponent } from './components/gis-map/gis-map.component';
import { GisMapService } from './gis-map.service';
import { GisTraceViewerComponent } from './components/gis-trace-viewer/gis-trace-viewer.component';
import { GisViewerComponent } from './components/gis-viewer/gis-viewer.component';
import { GisEditorMapComponent } from './components/gis-editor-map/gis-editor-map.component';
import { GisEditorComponent } from './components/gis-editor/gis-editor.component';
import { TraceDefineComponent } from './components/trace-define/trace-define.component';

@NgModule({
  imports: [GisRoutingModule, SharedModule],
  exports: [
    GisComponent,
    GisMapComponent,
    GisEditorMapComponent,
    GisTraceViewerComponent,
    GisViewerComponent,
    GisEditorComponent
  ],
  declarations: [
    GisComponent,
    GisMapComponent,
    GisTraceViewerComponent,
    GisViewerComponent,
    GisEditorMapComponent,
    GisEditorComponent,
    TraceDefineComponent
  ],
  providers: [GisMapService]
})
export class GisModule {}
