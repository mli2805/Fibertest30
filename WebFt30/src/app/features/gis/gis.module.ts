import { NgModule } from '@angular/core';

import { GisComponent } from './gis/gis.component';
import { GisRoutingModule } from './gis-routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { GisMapComponent } from './components/gis-map/gis-map.component';
import { GisMapService } from './gis-map.service';
import { GisTraceViewerComponent } from './components/gis-trace-viewer/gis-trace-viewer.component';
import { TraceDefineComponent } from './forms/trace-define/trace-define.component';
import { ShowNodeInfoComponent } from './forms/show-node-info/show-node-info.component';
import { EditEquipmentDialogComponent } from './forms/edit-equipment-dialog/edit-equipment-dialog.component';
import { EquipmentTypeSelectorComponent } from './forms/equipment-type-selector/equipment-type-selector.component';
import { SelectTracesDialogComponent } from './forms/select-traces-dialog/select-traces-dialog.component';
import { NextStepSelectorComponent } from './forms/next-step-selector/next-step-selector.component';

@NgModule({
  imports: [GisRoutingModule, SharedModule],
  exports: [GisComponent, GisMapComponent, GisTraceViewerComponent],
  declarations: [
    GisComponent,
    GisMapComponent,
    GisTraceViewerComponent,
    TraceDefineComponent,
    ShowNodeInfoComponent,
    EditEquipmentDialogComponent,
    EquipmentTypeSelectorComponent,
    SelectTracesDialogComponent,
    NextStepSelectorComponent
  ],
  providers: [GisMapService]
})
export class GisModule {}
