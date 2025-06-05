import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { AfterViewInit, Component, Inject, inject, OnInit, ViewChild } from '@angular/core';
import { EquipmentType } from 'src/grpc-generated';
import { GeoEquipment, GeoTrace, TraceNode } from 'src/app/core/store/models/ft30/geo-data';
import { GisMapService } from '../../gis-map.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GraphService } from 'src/app/core/grpc';
import { firstValueFrom } from 'rxjs';
import { GisMapUtils } from '../../components/shared/gis-map.utils';
import { MapLayersActions } from '../../components/gis-actions/map-layers-actions';
import { MapEquipmentActions } from '../../components/gis-actions/map-equipment-actions';
import { Store } from '@ngrx/store';
import { AppState, AuthSelectors } from 'src/app/core';
import { CoreUtils } from 'src/app/core/core.utils';
import { CdkDrag, CdkDragMove, CdkDragStart } from '@angular/cdk/drag-drop';

interface EquipElement {
  isSelected: boolean;
  equipment: GeoEquipment;
  removeDisabled: boolean;
}

interface TraceElement {
  isSelected: boolean;
  equipId: string | null; // id того оборудов которое вкл в эту трассу, или null если ничего не включено
  trace: GeoTrace;
}

@Component({
  selector: 'rtu-node-info-dialog',
  templateUrl: './node-info-dialog.component.html',
  styleUrls: ['./node-info-dialog.component.css']
})
export class NodeInfoDialogComponent implements OnInit, AfterViewInit {
  @ViewChild(CdkDrag) dragRef!: CdkDrag;

  public store: Store<AppState> = inject(Store);
  hasEditGraphPermission = CoreUtils.getCurrentState(
    this.store,
    AuthSelectors.selectHasEditGraphPermission
  );

  form!: FormGroup;
  nodeId!: string;
  fromLandmarks!: boolean;
  nodeInWork!: TraceNode;

  equipTable!: EquipElement[];
  traceTable!: TraceElement[];

  constructor(private gisMapService: GisMapService, private graphService: GraphService) {}
  ngOnInit(): void {
    this.nodeId = this.gisMapService.showNodeInfoDialog.value!;
    this.fromLandmarks = this.gisMapService.showNodeInfoFromLandmarks;
    this.nodeInWork = this.gisMapService.getNode(this.nodeId);
    this.form = new FormGroup({
      title: new FormControl(this.nodeInWork.title, Validators.required),
      comment: new FormControl(this.nodeInWork.comment)
    });

    this.updateTablesEquipmentAndTraces();
  }

  ngAfterViewInit() {
    // Установка начальной позиции через CDK
    this.dragRef.setFreeDragPosition({ x: 290, y: 75 });
  }

  updateTablesEquipmentAndTraces() {
    const equipments = this.gisMapService
      .getGeoData()
      .equipments.filter((e) => e.nodeId === this.nodeId && e.type !== EquipmentType.EmptyNode);

    this.equipTable = equipments.map((e) => {
      // в этом месте еще не знаем про трассы
      return {
        isSelected: false,
        equipment: e,
        removeDisabled: false
      };
    });

    if (equipments.length > 0) {
      this.equipTable[0].isSelected = true;
    }

    const tracesInNode = this.gisMapService
      .getGeoData()
      .traces.filter((t) => t.nodeIds.indexOf(this.nodeId) !== -1);

    this.traceTable = tracesInNode.map((t) => {
      return this.createTraceLine(t, equipments);
    });

    // помечаем то оборудование, которое используется трассами, для которых заданы базовые
    for (let i = 0; i < tracesInNode.length; i++) {
      const trace = tracesInNode[i];
      if (trace.hasAnyBaseRef || trace.nodeIds.at(-1) === this.nodeId) {
        const equipId = this.traceTable.find((t) => t.trace.id === trace.id)!.equipId;
        if (equipId !== null) {
          this.equipTable.find((e) => e.equipment.id === equipId)!.removeDisabled = true;
        }
      }
    }
  }

  createTraceLine(t: GeoTrace, equipments: GeoEquipment[]): TraceElement {
    for (let i = 0; i < equipments.length; i++) {
      const e = equipments[i];
      const eqId = t.equipmentIds.find((id) => id === e.id);
      if (eqId !== undefined) {
        return { isSelected: e.id === equipments[0].id, equipId: eqId, trace: t };
      }
    }
    return { isSelected: false, equipId: null, trace: t };
  }

  isTitleValid(): boolean {
    return this.form.controls['title'].pristine || this.form.controls['title'].valid;
  }

  isApplyDisabled(): boolean {
    if (this.form.pristine) return true;
    if (!this.form.valid) return true;

    return this.form.get('title')!.value === '';
  }

  isDiscardDisabled(): boolean {
    if (this.form.pristine) return true;
    return false;
  }

  async onApplyClicked() {
    const command = {
      NodeId: this.nodeId,
      Title: this.form.controls['title'].value,
      Comment: this.form.controls['comment'].value
    };
    const cmd = JSON.stringify(command);
    const response = await firstValueFrom(this.graphService.sendCommand(cmd, 'UpdateNode'));
    if (response.success) {
      this.nodeInWork.title = this.form.controls['title'].value;
      this.nodeInWork.comment = this.form.controls['comment'].value;

      const layerType = GisMapUtils.equipmentTypeToGisMapLayer(this.nodeInWork.equipmentType);
      const group = this.gisMapService.getLayerGroups().get(layerType)!;
      const marker = group.getLayers().find((m) => (<any>m).id === this.nodeId);
      group.removeLayer(marker!);
      MapLayersActions.addNodeToLayer(this.nodeInWork);
    }

    this.gisMapService.setShowNodeInfoDialog(null);
  }

  onDiscardClicked() {
    this.gisMapService.setShowNodeInfoDialog(null);
  }

  close() {
    this.gisMapService.setShowNodeInfoDialog(null);
  }

  // если оборудование входит в трассу для которой заданы базовые, то МОЖНО редактировать
  async editEquipment(equipment: any) {
    const dialogRef = await MapEquipmentActions.openEditEquipmentDialog(
      this.nodeId,
      equipment,
      false,
      []
    );
    dialogRef.closed.subscribe(async (result) => {
      if (result !== null) {
        const res = await MapEquipmentActions.applyEditEquipmentResult(<string>result, false);
        if (res) {
          this.updateTablesEquipmentAndTraces();
        }
      }
    });
  }

  // если оборудование входит в трассу для которой заданы базовые,
  // или это оборудование в последнем узле, то НЕЛЬЗЯ удалять
  async removeEquipment(eqLine: EquipElement) {
    if (eqLine.removeDisabled) return;
    await MapEquipmentActions.removeEquipment(eqLine.equipment);
    this.updateTablesEquipmentAndTraces();
  }

  async addEquipment() {
    const forTraces = await MapEquipmentActions.openSelectTracesDialog(this.nodeId);
    if (forTraces === null) return;

    const dialogRef = await MapEquipmentActions.openEditEquipmentDialog(
      this.nodeId,
      null,
      true,
      forTraces
    );
    dialogRef.closed.subscribe(async (result) => {
      if (result !== null) {
        const res = await MapEquipmentActions.applyEditEquipmentResult(<string>result, true);
        if (res) {
          this.updateTablesEquipmentAndTraces();
        }
      }
    });
  }

  onEquipLineClick(line: EquipElement) {
    this.equipTable.forEach((l) => {
      l.isSelected = l.equipment.id === line.equipment.id;
    });

    this.traceTable.forEach((l) => {
      l.isSelected = l.equipId === line.equipment.id;
    });
  }

  ///////////////////////////////////////////
  private dragStartOffset = { x: 0, y: 0 };

  onDragStarted(event: CdkDragStart) {
    // Получаем позицию курсора и позицию элемента при начале перетаскивания
    const pointerPosition = this.getPointerPosition(event.event);
    const rect = event.source.element.nativeElement.getBoundingClientRect();

    // Рассчитываем смещение курсора внутри элемента
    this.dragStartOffset = {
      x: pointerPosition.x - rect.left,
      y: pointerPosition.y - rect.top
    };
  }

  private getPointerPosition(event: Event): { x: number; y: number } {
    if (event instanceof MouseEvent) {
      return { x: event.clientX, y: event.clientY };
    } else if (event instanceof TouchEvent) {
      return {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
      };
    }
    return { x: 0, y: 0 };
  }

  onDragMoved(event: CdkDragMove) {
    const el = event.source.element.nativeElement;
    const viewport = {
      w: window.innerWidth,
      h: window.innerHeight
    };
    const rect = el.getBoundingClientRect();
    const visibleWidth = 80; // Видимая часть 80px

    // Получаем текущую позицию курсора
    const pointerPosition = this.getPointerPosition(event.event);

    // Рассчитываем новую позицию элемента
    const newX = pointerPosition.x - this.dragStartOffset.x;
    const newY = pointerPosition.y - this.dragStartOffset.y;

    // Применяем ограничения
    event.source.setFreeDragPosition({
      x: Math.min(
        Math.max(
          -rect.width + visibleWidth, // Форма скрыта кроме 80px
          newX
        ),
        viewport.w - visibleWidth // Форма скрыта кроме 80px
      ),
      y: Math.min(Math.max(0, newY), viewport.h - 40)
    });
  }
}
