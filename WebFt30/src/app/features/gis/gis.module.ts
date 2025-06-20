import { NgModule } from '@angular/core';

import { GisComponent } from './gis/gis.component';
import { GisRoutingModule } from './gis-routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { GisMapComponent } from './components/gis-map/gis-map.component';
import { TraceDefineComponent } from './forms/trace-define/trace-define.component';
import { EditEquipmentDialogComponent } from './forms/edit-equipment-dialog/edit-equipment-dialog.component';
import { EquipmentTypeSelectorComponent } from './forms/equipment-type-selector/equipment-type-selector.component';
import { SelectTracesDialogComponent } from './forms/select-traces-dialog/select-traces-dialog.component';
import { NextStepSelectorComponent } from './forms/next-step-selector/next-step-selector.component';
import { EquipmentEditComponent } from './forms/trace-equipment-selector/equipment-edit/equipment-edit.component';
import { NodeInfoDialogComponent } from './forms/node-info-dialog/node-info-dialog.component';
import { SectionWithNodesComponent } from './forms/section-with-nodes/section-with-nodes.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AddRtuDialogComponent } from './forms/add-rtu-dialog/add-rtu-dialog.component';
import { RtuInfoComponent } from './forms/add-rtu-dialog/rtu-info/rtu-info.component';
import { TraceInfoDialogComponent } from './forms/trace-info-dialog/trace-info-dialog.component';
import { FiberInfoComponent } from './forms/fiber-info/fiber-info.component';
import { TraceEquipmentSelectorComponent } from './forms/trace-equipment-selector/trace-equipment-selector.component';
import { AcceptTraceDialogComponent } from './forms/trace-info-dialog/accept-trace-dialog/accept-trace-dialog.component';

@NgModule({
  imports: [GisRoutingModule, SharedModule, DragDropModule],
  exports: [
    GisComponent,
    GisMapComponent,
    NodeInfoDialogComponent,
    FiberInfoComponent,
    TraceInfoDialogComponent,
    TraceDefineComponent,
    AddRtuDialogComponent
  ],
  declarations: [
    GisComponent,
    GisMapComponent,
    TraceDefineComponent,
    EditEquipmentDialogComponent,
    EquipmentTypeSelectorComponent,
    SelectTracesDialogComponent,
    NextStepSelectorComponent,
    EquipmentEditComponent,
    NodeInfoDialogComponent,
    SectionWithNodesComponent,
    AddRtuDialogComponent,
    RtuInfoComponent,
    TraceInfoDialogComponent,
    FiberInfoComponent,
    TraceEquipmentSelectorComponent,
    AcceptTraceDialogComponent
  ],
  providers: []
})
export class GisModule {}
