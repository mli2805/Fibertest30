import { Component, HostListener, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EquipmentType } from 'src/grpc-generated';
import { GisMapService } from '../../gis-map.service';
import { GraphService } from 'src/app/core/grpc';
import { GeoEquipment, TraceNode } from 'src/app/core/store/models/ft30/geo-data';
import { MapLayersActions } from '../../components/gis-actions/map-layers-actions';
import { GisMapLayer } from '../../components/shared/gis-map-layer';
import { RtuInfoMode } from './rtu-info/rtu-info.component';
import { WindowService } from 'src/app/app/pages/start-page/components/window.service';
@Component({
  selector: 'rtu-add-rtu-dialog',
  templateUrl: './add-rtu-dialog.component.html'
})
export class AddRtuDialogComponent implements OnInit {
  @Input() nodeId!: string;
  @Input() zIndex!: number;

  rtuInfoMode = RtuInfoMode;
  @Input() payload!: any;
  rtuId!: string;

  rtuInfoData!: any;

  spinning = new BehaviorSubject<boolean>(false);
  spinning$ = this.spinning.asObservable();

  constructor(
    private graphService: GraphService,
    private gisMapService: GisMapService,
    private windowService: WindowService
  ) {}

  ngOnInit(): void {
    console.log(this.payload);
    const rtu = this.gisMapService.getGeoData().equipments.find((e) => e.nodeId === this.nodeId);
    const rtuId =
      this.payload.mode === RtuInfoMode.AddRtu
        ? crypto.randomUUID()
        : this.gisMapService.getGeoData().equipments.find((e) => e.nodeId === this.nodeId)!.id;
    this.rtuInfoData = {
      hasPermission: this.payload.hasPermission,
      mode: this.payload.mode,
      rtuId: rtuId,
      rtuNode: this.payload.node,
      rtu: rtu // underfined если создание нового
    };
  }

  // кнопка нажата в rtu-info
  async onCloseEvent(node: TraceNode | null) {
    if (node === null) {
      this.close();
      return;
    }

    this.payload.mode === RtuInfoMode.AddRtu
      ? await this.onCloseAddRtu(node)
      : await this.onCloseUpdateRtu(node);

    this.close();
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
    this.spinning.next(true);
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
    this.spinning.next(false);
  }

  close() {
    this.windowService.unregisterWindow(this.nodeId, 'RtuInfo');
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape() {
    this.close();
  }
}
