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
import { TraceComponentSelectorComponent } from './forms/trace-component-selector/trace-component-selector.component';
import { EquipmentEditComponent } from './forms/trace-component-selector/equipment-edit/equipment-edit.component';
import { AcceptTraceDialogComponent } from './forms/accept-trace-dialog/accept-trace-dialog.component';
import { NodeInfoDialogComponent } from './forms/node-info-dialog/node-info-dialog.component';
import { SectionWithNodesComponent } from './forms/section-with-nodes/section-with-nodes.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AddRtuDialogComponent } from './forms/add-rtu-dialog/add-rtu-dialog.component';
import { RtuInfoComponent } from './forms/add-rtu-dialog/rtu-info/rtu-info.component';

@NgModule({
  imports: [GisRoutingModule, SharedModule, DragDropModule],
  exports: [GisComponent, GisMapComponent],
  declarations: [
    GisComponent,
    GisMapComponent,
    TraceDefineComponent,
    EditEquipmentDialogComponent,
    EquipmentTypeSelectorComponent,
    SelectTracesDialogComponent,
    NextStepSelectorComponent,
    TraceComponentSelectorComponent,
    EquipmentEditComponent,
    AcceptTraceDialogComponent,
    NodeInfoDialogComponent,
    SectionWithNodesComponent,
    AddRtuDialogComponent,
    RtuInfoComponent
  ],
  providers: []
})
export class GisModule {}
