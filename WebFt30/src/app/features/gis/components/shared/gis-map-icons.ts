import * as L from 'leaflet';
import { FiberState } from 'src/app/core/store/models/ft30/ft-enums';
import { ColorUtils } from 'src/app/shared/utils/color-utils';
import { TraceNode } from 'src/app/core/store/models/ft30/geo-data';
import { EquipmentType } from 'src/grpc-generated';

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
  highlightRtu!: GisIconWithZIndex;
  highlightNode!: GisIconWithZIndex;

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
    this.accidentPlace = { icon: this.createAccidentPlaceIcon(colorClass), zIndex: 15 };

    this.highlightRtu = { icon: this.createHighlightRtuIcon(), zIndex: 12 };
    this.highlightNode = { icon: this.createHighlightNodeIcon(), zIndex: 12 };
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

  createRtuIconSolid(colorClass: string): L.DivIcon {
    const width = 48;
    const height = 48;

    return L.divIcon({
      className: 'map-marker-wrapper',
      html: `
              <div class="${colorClass}" style="width: ${width}px; height: ${height}px">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 1.5C2.17363 1.5 0.5 2.9003 0.5 4.85714V14.1429C0.5 16.0997 2.17363 17.5 4 17.5H10.5V19.5H7.5C6.94772 19.5 6.5 19.9477 6.5 20.5V21.5C6.5 22.0523 6.94771 22.5 7.5 22.5H16.5C17.0523 22.5 17.5 22.0523 17.5 21.5V20.5C17.5 19.9477 17.0523 19.5 16.5 19.5H13.5V17.5H20C21.8264 17.5 23.5 16.0997 23.5 14.1429V4.85714C23.5 2.9003 21.8264 1.5 20 1.5H4Z" fill="#000000"/>
                </svg>
              </div>
        `,
      iconSize: [width, height],
      iconAnchor: [24, 44]
    });
  }

  createAccidentPlaceIcon(colorClass: string): L.DivIcon {
    const width = 64;
    const height = 64;

    return L.divIcon({
      className: 'map-marker-wrapper',
      html: `
              <div class="${colorClass}" style="width: ${width}px; height: ${height}px">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M512.481 421.906L850.682 84.621c25.023-24.964 65.545-24.917 90.51.105s24.917 65.545-.105 90.51L603.03 512.377 940.94 850c25.003 24.984 25.017 65.507.033 90.51s-65.507 25.017-90.51.033L512.397 602.764 174.215 940.03c-25.023 24.964-65.545 24.917-90.51-.105s-24.917-65.545.105-90.51l338.038-337.122L84.14 174.872c-25.003-24.984-25.017-65.507-.033-90.51s65.507-25.017 90.51-.033L512.48 421.906z"/>
                </svg>
              </div>
        `,
      iconSize: [width, height],
      iconAnchor: [39, 54]
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

  createClosureIcon(colorClass: string): L.DivIcon {
    const size = 12;

    return L.divIcon({
      className: 'map-marker-wrapper',
      html: `
              <div class="${colorClass}" style="width: ${size}px; height: ${size}px">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12">
                  <circle fill="currentColor" cx="6" cy="6" r="6"/>
                </svg>
              </div>
        `,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2]
    });
  }

  createHighlightRtuIcon(): L.DivIcon {
    const colorClass = 'text-green-500';
    const width = 86;
    const height = 86;

    return L.divIcon({
      className: 'map-marker-wrapper',
      html: `
              <div class="${colorClass}" style="width: ${width}px; height: ${height}px">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 103 103">
                  <circle fill="none" stroke="currentColor" stroke-width="3" cx="51" cy="51" r="50"/>
                </svg>
              </div>
        `,
      iconSize: [width, height],
      iconAnchor: [49, 66]
    });
  }

  createHighlightNodeIcon(): L.DivIcon {
    const colorClass = 'text-green-500';
    const width = 11;
    const height = 11;

    return L.divIcon({
      className: 'map-marker-wrapper',
      html: `
              <div class="${colorClass}" style="width: ${width}px; height: ${height}px">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13 13">
                  <circle fill="none" stroke="currentColor" stroke-width="1" cx="6" cy="6" r="5"/>
                </svg>
              </div>
        `,
      iconSize: [width, height],
      iconAnchor: [width / 2, height / 2]
    });
  }

  static createLetterIcon(letter: string): L.DivIcon {
    const size = 16 + letter.length * 4;
    const colorClass = 'text-[#347deb]';

    return L.divIcon({
      className: 'map-marker-wrapper',
      html: `
              <div class="relative ${colorClass}" style="width: ${size}px; height: ${size}px">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22">
                  <circle fill="currentColor" cx="11" cy="11" r="11"/>
                </svg>
                <div class="absolute top-0 left-0 text-black flex items-center justify-center " style="width: ${size}px; height: ${size}px">
                  <span >${letter}</span>
                </div>
              </div>
        `,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2]
    });
  }
}
