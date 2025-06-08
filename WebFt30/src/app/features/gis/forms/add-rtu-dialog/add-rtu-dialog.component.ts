import { AfterViewInit, Component, HostListener, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EquipmentType } from 'src/grpc-generated';
import { GisMapService } from '../../gis-map.service';
import { GraphService } from 'src/app/core/grpc';
import { GeoEquipment, TraceNode } from 'src/app/core/store/models/ft30/geo-data';
import { MapLayersActions } from '../../components/gis-actions/map-layers-actions';
import { GisMapLayer } from '../../components/shared/gis-map-layer';
import { RtuInfoMode } from './rtu-info/rtu-info.component';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { DragWatcher } from 'src/app/shared/utils/drag-watcher';

@Component({
  selector: 'rtu-add-rtu-dialog',
  templateUrl: './add-rtu-dialog.component.html'
})
export class AddRtuDialogComponent implements AfterViewInit {
  @ViewChild(CdkDrag) dragRef!: CdkDrag;
  dragWatcher = DragWatcher;

  rtuInfoMode = RtuInfoMode;
  mode!: RtuInfoMode;
  rtuInfoData!: any;

  spinning = new BehaviorSubject<boolean>(false);
  spinning$ = this.spinning.asObservable();

  constructor(private graphService: GraphService, private gisMapService: GisMapService) {
    this.mode = gisMapService.showRtuDialogMode;
    const rtuId =
      this.mode === RtuInfoMode.AddRtu
        ? crypto.randomUUID()
        : gisMapService
            .getGeoData()
            .equipments.find((e) => e.nodeId === gisMapService.rtuNodeToShowDialog.id)!.id;
    this.rtuInfoData = {
      hasPermission: true,
      mode: this.mode,
      rtuId: rtuId,
      rtuNode: gisMapService.rtuNodeToShowDialog
    };
  }

  ngAfterViewInit() {
    this.dragRef.setFreeDragPosition({ x: 290, y: 75 });
  }

  // кнопка нажата в rtu-info
  async onCloseEvent(node: TraceNode | null) {
    if (node === null) {
      this.gisMapService.showRtuAddOrEditDialog.next(false);
      return;
    }

    this.mode === RtuInfoMode.AddRtu
      ? await this.onCloseAddRtu(node)
      : await this.onCloseUpdateRtu(node);

    this.gisMapService.showRtuAddOrEditDialog.next(false);
  }

  async onCloseAddRtu(node: TraceNode) {
    const command = {
      Id: this.rtuInfoData.rtuId,
      NodeId: node.id,
      Latitude: node.coors.lat,
      Longitude: node.coors.lng,
      Title: node.title,
      Comment: node.comment
    };
    const json = JSON.stringify(command);
    const response = await this.graphService.sendCommandAsync(json, 'AddRtuAtGpsLocation');
    if (response.success) {
      const geoData = this.gisMapService.getGeoData();
      geoData.nodes.push(node);
      MapLayersActions.addNodeToLayer(node);
      geoData.equipments.push(
        new GeoEquipment(
          this.rtuInfoData.rtuId,
          node.title,
          node.id,
          EquipmentType.Rtu,
          0,
          0,
          node.comment
        )
      );
    }
  }

  async onCloseUpdateRtu(node: TraceNode) {
    const command = {
      RtuId: this.rtuInfoData.rtuId,
      Title: node.title,
      Position: { lat: node.coors.lat, lng: node.coors.lng },
      Comment: node.comment
    };
    const json = JSON.stringify(command);
    const response = await this.graphService.sendCommandAsync(json, 'UpdateRtu');
    if (response.success) {
      const layerType = GisMapLayer.Route;
      const group = this.gisMapService.getLayerGroups().get(layerType)!;
      const marker = group.getLayers().find((m) => (<any>m).id === node.id);
      group.removeLayer(marker!);
      MapLayersActions.addNodeToLayer(node);
    }
  }

  close() {
    this.gisMapService.showRtuAddOrEditDialog.next(false);
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape() {
    this.gisMapService.showRtuAddOrEditDialog.next(false);
  }
}
