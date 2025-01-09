import * as L from 'leaflet';
import { GisMapLayer } from '../../models/gis-map-layer';
import { FiberState } from 'src/app/core/store/models/ft30/ft-enums';
import { GisMapUtils } from './gis-map.utils';
import { OpticalEvent } from 'src/app/core/store/models/ft30/optical-event';
import { ColorUtils } from 'src/app/shared/utils/color-utils';
import { TraceNode } from 'src/app/core/store/models/ft30/geo-data';
import { EquipmentType, GeoCoordinate } from 'src/grpc-generated';

export interface GisIconWithZIndex {
  icon?: L.DivIcon;
  zIndex?: number;
}

export class GisMapIcons {
  adjustmentPoint!: GisIconWithZIndex;
  emptyNode!: GisIconWithZIndex;
  cableReserve!: GisIconWithZIndex;
  other!: GisIconWithZIndex;
  closure!: GisIconWithZIndex;
  cross!: GisIconWithZIndex;
  well!: GisIconWithZIndex;
  terminal!: GisIconWithZIndex;
  rtu!: GisIconWithZIndex;
  accidentPlace!: GisIconWithZIndex;

  traceMarker!: GisIconWithZIndex;
  alarmFiberBreak!: GisIconWithZIndex;
  alarmFiberBreakResolved!: GisIconWithZIndex;
  alarmCritical!: GisIconWithZIndex;
  alarmMajor!: GisIconWithZIndex;
  alarmMinor!: GisIconWithZIndex;
  alarmResolved!: GisIconWithZIndex;
  routeStart!: GisIconWithZIndex;
  routeFinish!: GisIconWithZIndex;
  slack!: GisIconWithZIndex;
  location!: GisIconWithZIndex;
  unknownLocations!: GisIconWithZIndex;
  unknownSlacks!: GisIconWithZIndex;

  constructor() {
    this.initMapIcons();
  }

  // prettier-ignore
  public getIcon(node: TraceNode) {
    switch (node.equipmentType) {
      case EquipmentType.Nothing: return this.emptyNode;
      case EquipmentType.AdjustmentPoint: return this.adjustmentPoint;
      case EquipmentType.EmptyNode: return this.emptyNode;
      case EquipmentType.CableReserve: return this.cableReserve;
      case EquipmentType.Other: return this.other;
      case EquipmentType.Closure: return this.closure;
      case EquipmentType.Cross: return this.cross;
      case EquipmentType.Well: return this.well;
      case EquipmentType.Terminal: return this.terminal;
      case EquipmentType.Rtu: return this.rtu;
      case EquipmentType.AccidentPlace: return this.accidentPlace;
    }
  }

  private initMapIcons(): void {
    // надо инитить каждый тип оборудования со всеми цветами, пока сделаем только черные
    const colorClass = ColorUtils.fiberStateToTextColor(FiberState.Ok);

    this.adjustmentPoint = { icon: this.createAdjustmentPointIcon(colorClass), zIndex: 38 };
    this.emptyNode = { icon: this.createEmptyNodeIcon(colorClass), zIndex: 35 };
    this.well = { icon: this.createEmptyNodeIcon(colorClass), zIndex: 35 }; // не используется?
    this.cableReserve = { icon: this.createCableReserveIcon(colorClass), zIndex: 32 };
    this.closure = { icon: this.createClosureIcon(colorClass), zIndex: 28 };
    this.cross = { icon: this.createCrossIcon(colorClass), zIndex: 28 };
    this.other = { icon: this.createOtherIcon(colorClass), zIndex: 28 };
    this.terminal = { icon: this.createTerminalIcon(colorClass), zIndex: 28 };
    this.rtu = { icon: this.createRtuIcon(colorClass), zIndex: 20 };

    this.traceMarker = { zIndex: 22 };
    this.alarmFiberBreak = { icon: this.createFiberBreakIcon(false), zIndex: 20 };
    this.alarmCritical = { icon: this.createAlarmIcon(FiberState.Critical), zIndex: 18 };
    this.alarmMajor = { icon: this.createAlarmIcon(FiberState.Major), zIndex: 16 };
    this.alarmMinor = { icon: this.createAlarmIcon(FiberState.Minor), zIndex: 14 };
    this.alarmFiberBreakResolved = { icon: this.createFiberBreakIcon(true), zIndex: 13 };
    this.alarmResolved = { icon: this.createResolvedAlarmIcon(), zIndex: 13 };
    this.routeStart = {
      icon: GisMapIcons.createLetterIcon('S', true, GisMapIcons.getColorClass(GisMapLayer.Route)),
      zIndex: 12
    };
    this.routeFinish = {
      icon: GisMapIcons.createLetterIcon('F', true, GisMapIcons.getColorClass(GisMapLayer.Route)),
      zIndex: 10
    };

    this.location = {
      icon: GisMapIcons.createLetterIcon(
        '&nbsp;',
        false,
        GisMapIcons.getColorClass(GisMapLayer.Locations)
      )
    };
  }

  createRtuIcon(colorClass: string): L.DivIcon {
    const width = 64;
    const height = 64;

    return L.divIcon({
      className: 'map-marker-wrapper',
      html: `
              <div class="${colorClass}" style="width: ${width}px; height: ${height}px">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path fill="currentColor" 
                  fill-rule="evenodd" 
                  d="M9 12v1h1v-1H9zm-2 0v1h1v-1H7zm-2 0v1h1v-1H5zm4-4v1h1V8H9zM7 8v1h1V8H7zM5 8v1h1V8H5zm4-4v1h1V4H9zM7 5h1V4H7v1zM5 5h1V4H5v1zm4 3v1h1V8H9zM7 9h1V8H7v1zM5 9h1V8H5v1zm4 3v1h1v-1H9zm-2 1h1v-1H7v1zm-2 0h1v-1H5v1zm17 2V2H2v13h13v3h-2v1H4v1h9v1h5v-1h2v-1h-2v-1h-2v-3h6zM3 3h18v3H3V3zm0 4h18v3H3V7zm14 12v1h-3v-1h3zM3 14v-3h18v3H3zm6-1h1v-1H9v1zm0-4h1V8H9v1zm0-4h1V4H9v1zm-2 8h1v-1H7v1zm0-4h1V8H7v1zm0-4h1V4H7v1zm-2 8h1v-1H5v1zm0-4h1V8H5v1zm0-4h1V4H5v1zm4-1v1h1V4H9zM7 4v1h1V4H7zM5 4v1h1V4H5z"
                  clip-rule="evenodd" />
                </svg>
              </div>
        `,
      iconSize: [width, height],
      iconAnchor: [39, 54]
    });
  }

  createClosureIcon(colorClass: string): L.DivIcon {
    const width = 12;
    const height = 12;

    return L.divIcon({
      className: 'map-marker-wrapper',
      html: `
              <div class="${colorClass}" style="width: ${width}px; height: ${height}px">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12">
                  <circle fill="currentColor" cx="6" cy="6" r="6"/>
                </svg>
              </div>
        `,
      iconSize: [width, height],
      iconAnchor: [width / 2, height / 2]
    });
  }

  createTerminalIcon(colorClass: string): L.DivIcon {
    const width = 15;
    const height = 15;

    return L.divIcon({
      className: 'map-marker-wrapper',
      html: `
              <div class="${colorClass}" style="width: ${width}px; height: ${height}px">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 0 L24 12 L12 24 L0 12 z"/>
                </svg>
              </div>
        `,
      iconSize: [width, height],
      iconAnchor: [width / 2, height / 2]
    });
  }

  createCrossIcon(colorClass: string): L.DivIcon {
    const width = 13;
    const height = 13;

    return L.divIcon({
      className: 'map-marker-wrapper',
      html: `
              <div class="${colorClass}" style="width: ${width}px; height: ${height}px">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M0 24 L12 0 L24 24 z"/>
                </svg>
              </div>
        `,
      iconSize: [width, height],
      iconAnchor: [width / 2, height / 2]
    });
  }

  createOtherIcon(colorClass: string): L.DivIcon {
    const width = 13;
    const height = 13;

    return L.divIcon({
      className: 'map-marker-wrapper',
      html: `
              <div class="${colorClass}" style="width: ${width}px; height: ${height}px">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M0 0 h24 v24 h-24 z"/>
                </svg>
              </div>
        `,
      iconSize: [width, height],
      iconAnchor: [width / 2, height / 2]
    });
  }

  createAdjustmentPointIcon(colorClass: string): L.DivIcon {
    const width = 12;
    const height = 12;

    return L.divIcon({
      className: 'map-marker-wrapper',
      html: `
              <div class="${colorClass}" style="width: ${width}px; height: ${height}px">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path fill="none" stroke="currentColor" stroke-width="2" d="M12 0 L12 24 M0 12 L24 12 M3 3 L21 21 M21 3 L3 21"/>
                </svg>
              </div>
        `,
      iconSize: [width, height],
      iconAnchor: [width / 2, height / 2]
    });
  }

  createEmptyNodeIcon(colorClass: string): L.DivIcon {
    const width = 11;
    const height = 11;

    return L.divIcon({
      className: 'map-marker-wrapper',
      html: `
              <div class="${colorClass}" style="width: ${width}px; height: ${height}px">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13 13">
                  <circle fill="none" stroke="currentColor" stroke-width="2" cx="6" cy="6" r="5"/>
                </svg>
              </div>
        `,
      iconSize: [width, height],
      iconAnchor: [width / 2, height / 2]
    });
  }

  createCableReserveIcon(colorClass: string): L.DivIcon {
    const width = 11;
    const height = 11;

    return L.divIcon({
      className: 'map-marker-wrapper',
      html: `
              <div class="${colorClass}" style="width: ${width}px; height: ${height}px">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13 13">
                  <circle fill="none" stroke="currentColor" stroke-width="2" cx="0" cy="6" r="5"/>
                  <circle fill="none" stroke="currentColor" stroke-width="2" cx="12" cy="6" r="5"/>
                </svg>
              </div>
        `,
      iconSize: [width, height],
      iconAnchor: [width / 2, height / 2]
    });
  }

  createFiberBreakIcon(resolved: boolean): L.DivIcon {
    const colorClass = resolved
      ? GisMapIcons.getResolvedColorClass()
      : GisMapUtils.fiberStateToColorClass(FiberState.Critical);
    const width = 50;
    const height = 50;

    return L.divIcon({
      className: 'map-marker-wrapper',
      html: `
              <div class="${colorClass}" style="width: ${width}px; height: ${height}px">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </div>
        `,
      iconSize: [width, height],
      iconAnchor: [width / 2, height / 2]
    });
  }

  createAlarmIcon(state: FiberState): L.DivIcon {
    const colorClass = GisMapUtils.fiberStateToColorClass(state);
    return this.createAlarmIconByColor(colorClass);
  }

  createResolvedAlarmIcon(): L.DivIcon {
    const colorClass = GisMapIcons.getResolvedColorClass();
    return this.createAlarmIconByColor(colorClass);
  }

  private createAlarmIconByColor(colorClass: string): L.DivIcon {
    const width = 20;
    const height = 20;

    return L.divIcon({
      className: 'map-marker-wrapper',
      html: `
               <div class="${colorClass}" style="width: ${width}px; height: ${height}px">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M0 0h24L12 24"/></svg>
              </div>
        `,
      iconSize: [width, height],
      iconAnchor: [width / 2, height]
    });
  }

  static createLetterIcon(
    letter: string,
    rounded: boolean,
    colorClass: string,
    bigger = false
  ): L.DivIcon {
    let size = rounded ? 22 : 12;
    if (bigger) {
      size = size * 2;
    }

    return L.divIcon({
      className: 'map-marker-wrapper',
      html: `<div class="map-letter-marker ${
        rounded ? 'rounded-full' : ''
      } ${colorClass}">${letter}</div>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
      popupAnchor: [0, -size / 2]
    });
  }

  static getResolvedColorClass(): string {
    return 'alarm-resolved';
  }

  static getColorClass(layerType: GisMapLayer): string {
    return 'bg-blue-700';
  }

  public getIconByAlarmLevel(opticalEvent: OpticalEvent): GisIconWithZIndex {
    switch (opticalEvent.traceState) {
      case FiberState.NoFiber:
      case FiberState.FiberBreak:
      case FiberState.Critical:
        return this.alarmCritical;
      case FiberState.Major:
        return this.alarmMajor;
      case FiberState.Minor:
        return this.alarmMinor;
      default:
        throw new Error('Unknown alarm level');
    }
  }
}
