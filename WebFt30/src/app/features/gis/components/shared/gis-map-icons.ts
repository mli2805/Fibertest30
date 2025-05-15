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

  closureOk!: GisIconWithZIndex;
  closureMinor!: GisIconWithZIndex;
  closureMajor!: GisIconWithZIndex;
  closureCritical!: GisIconWithZIndex;
  closureUser!: GisIconWithZIndex;

  emptyNodeOk!: GisIconWithZIndex;
  emptyNodeMinor!: GisIconWithZIndex;
  emptyNodeMajor!: GisIconWithZIndex;
  emptyNodeCritical!: GisIconWithZIndex;
  emptyNodeUser!: GisIconWithZIndex;

  otherOk!: GisIconWithZIndex;
  otherMinor!: GisIconWithZIndex;
  otherMajor!: GisIconWithZIndex;
  otherCritical!: GisIconWithZIndex;
  otherUser!: GisIconWithZIndex;

  cableReserveOk!: GisIconWithZIndex;
  cableReserveMinor!: GisIconWithZIndex;
  cableReserveMajor!: GisIconWithZIndex;
  cableReserveCritical!: GisIconWithZIndex;
  cableReserveUser!: GisIconWithZIndex;

  crossOk!: GisIconWithZIndex;
  crossMinor!: GisIconWithZIndex;
  crossMajor!: GisIconWithZIndex;
  crossCritical!: GisIconWithZIndex;
  crossUser!: GisIconWithZIndex;

  well!: GisIconWithZIndex;

  terminalOk!: GisIconWithZIndex;
  terminalMinor!: GisIconWithZIndex;
  terminalMajor!: GisIconWithZIndex;
  terminalCritical!: GisIconWithZIndex;
  terminalUser!: GisIconWithZIndex;

  rtu!: GisIconWithZIndex;

  minorAccidentPlace!: GisIconWithZIndex;
  majorAccidentPlace!: GisIconWithZIndex;
  criticalAccidentPlace!: GisIconWithZIndex;
  userAccidentPlace!: GisIconWithZIndex;

  highlightRtu!: GisIconWithZIndex;
  highlightNode!: GisIconWithZIndex;

  constructor() {
    this.initMapIcons();
  }

  // узлы всех типов всегда черные, по цветам только AccidentPlace отличаются, но может когда-нибудь пригодится
  // prettier-ignore
  public getIcon(node: TraceNode) {
    switch (node.equipmentType) {
      case EquipmentType.Nothing: return this.well;
      case EquipmentType.AdjustmentPoint: return this.adjustmentPoint;
      case EquipmentType.EmptyNode:
       switch (node.state) {
          case FiberState.Ok: return this.emptyNodeOk
          case FiberState.Minor: return this.emptyNodeMinor;
          case FiberState.Major: return this.emptyNodeMajor;
          case FiberState.Critical:
          case FiberState.FiberBreak:
             return this.emptyNodeCritical;
          case FiberState.User: return this.emptyNodeUser;
        }; break;
      case EquipmentType.CableReserve:
         switch (node.state) {
          case FiberState.Ok: return this.cableReserveOk
          case FiberState.Minor: return this.cableReserveMinor;
          case FiberState.Major: return this.cableReserveMajor;
          case FiberState.Critical:
          case FiberState.FiberBreak:
             return this.cableReserveCritical;
          case FiberState.User: return this.cableReserveUser;
        }; break;
      case EquipmentType.Other: 
      switch (node.state) {
          case FiberState.Ok: return this.otherOk
          case FiberState.Minor: return this.otherMinor;
          case FiberState.Major: return this.otherMajor;
          case FiberState.Critical:
          case FiberState.FiberBreak:
             return this.otherCritical;
          case FiberState.User: return this.otherUser;
        }; break;
      case EquipmentType.Closure: 
        switch (node.state) {
          case FiberState.Ok: return this.closureOk
          case FiberState.Minor: return this.closureMinor;
          case FiberState.Major: return this.closureMajor;
          case FiberState.Critical:
          case FiberState.FiberBreak:
             return this.closureCritical;
          case FiberState.User: return this.closureUser;
        }; break;
      case EquipmentType.Cross:  
      switch (node.state) {
          case FiberState.Ok: return this.crossOk
          case FiberState.Minor: return this.crossMinor;
          case FiberState.Major: return this.crossMajor;
          case FiberState.Critical: 
          case FiberState.FiberBreak:
          return this.crossCritical;
          case FiberState.User: return this.crossUser;
        }; break;
      case EquipmentType.Well: return this.well;
      case EquipmentType.Terminal: 
       switch (node.state) {
          case FiberState.Ok: return this.terminalOk
          case FiberState.Minor: return this.terminalMinor;
          case FiberState.Major: return this.terminalMajor;
          case FiberState.Critical: 
          case FiberState.FiberBreak:
          return this.terminalCritical;
          case FiberState.User: return this.terminalUser;
        }; break;
      case EquipmentType.Rtu: return this.rtu;
      case EquipmentType.AccidentPlace:
        switch (node.state) {
          case FiberState.Minor: return this.minorAccidentPlace;
          case FiberState.Major: return this.majorAccidentPlace;
          case FiberState.Critical:
          case FiberState.FiberBreak:
             return this.criticalAccidentPlace;
          case FiberState.User: return this.userAccidentPlace;
        }
    }

    // чтобы не было ворнинга
    return this.well;
  }

  // prettier-ignore
  private initMapIcons(): void {
    // надо инитить каждый тип оборудования со всеми цветами, пока сделаем только черные
    const colorOk = ColorUtils.fiberStateToTextColor(FiberState.Ok);
    const colorMinor = ColorUtils.fiberStateToTextColor(FiberState.Minor);
    const colorMajor = ColorUtils.fiberStateToTextColor(FiberState.Major);
    const colorCritical = ColorUtils.fiberStateToTextColor(FiberState.Critical);
    const colorUser = ColorUtils.fiberStateToTextColor(FiberState.User);

    this.adjustmentPoint = { icon: this.createAdjustmentPointIcon(colorOk), zIndex: 38 };
    this.well = { icon: this.createEmptyNodeIcon(colorOk), zIndex: 35 }; // не используется?
    
    this.cableReserveOk = { icon: this.createCableReserveIcon(colorOk), zIndex: 28 };
    this.cableReserveMinor = { icon: this.createCableReserveIcon(colorMinor), zIndex: 28 };
    this.cableReserveMajor = { icon: this.createCableReserveIcon(colorMajor), zIndex: 28 };
    this.cableReserveCritical = { icon: this.createCableReserveIcon(colorCritical), zIndex: 28 };
    this.cableReserveUser = { icon: this.createCableReserveIcon(colorUser), zIndex: 28 };

    this.emptyNodeOk = { icon: this.createEmptyNodeIcon(colorOk), zIndex: 28 };
    this.emptyNodeMinor = { icon: this.createEmptyNodeIcon(colorMinor), zIndex: 28 };
    this.emptyNodeMajor = { icon: this.createEmptyNodeIcon(colorMajor), zIndex: 28 };
    this.emptyNodeCritical = { icon: this.createEmptyNodeIcon(colorCritical), zIndex: 28 };
    this.emptyNodeUser = { icon: this.createEmptyNodeIcon(colorUser), zIndex: 28 };

    this.otherOk = { icon: this.createOtherIcon(colorOk), zIndex: 28 };
    this.otherMinor = { icon: this.createOtherIcon(colorMinor), zIndex: 28 };
    this.otherMajor = { icon: this.createOtherIcon(colorMajor), zIndex: 28 };
    this.otherCritical = { icon: this.createOtherIcon(colorCritical), zIndex: 28 };
    this.otherUser = { icon: this.createOtherIcon(colorUser), zIndex: 28 };

    this.closureOk = { icon: this.createClosureIcon(colorOk), zIndex: 28 };
    this.closureMinor = { icon: this.createClosureIcon(colorMinor), zIndex: 28 };
    this.closureMajor = { icon: this.createClosureIcon(colorMajor), zIndex: 28 };
    this.closureCritical = { icon: this.createClosureIcon(colorCritical), zIndex: 28 };
    this.closureUser = { icon: this.createClosureIcon(colorUser), zIndex: 28 };

    this.crossOk = { icon: this.createCrossIcon(colorOk), zIndex: 28 };
    this.crossMinor = { icon: this.createCrossIcon(colorMinor), zIndex: 28 };
    this.crossMajor = { icon: this.createCrossIcon(colorMajor), zIndex: 28 };
    this.crossCritical = { icon: this.createCrossIcon(colorCritical), zIndex: 28 };
    this.crossUser = { icon: this.createCrossIcon(colorUser), zIndex: 28 };

    this.terminalOk = { icon: this.createTerminalIcon(colorOk), zIndex: 28 };
    this.terminalMinor = { icon: this.createTerminalIcon(colorMinor), zIndex: 28 };
    this.terminalMajor = { icon: this.createTerminalIcon(colorMajor), zIndex: 28 };
    this.terminalCritical = { icon: this.createTerminalIcon(colorCritical), zIndex: 28 };
    this.terminalUser = { icon: this.createTerminalIcon(colorUser), zIndex: 28 };

    
    this.rtu = { icon: this.createRtuIcon(colorOk), zIndex: 20 };

    this.minorAccidentPlace = { icon: this.createAccidentPlaceIcon(ColorUtils.fiberStateToTextColor(FiberState.Minor)), zIndex: 15 };
    this.majorAccidentPlace = { icon: this.createAccidentPlaceIcon(ColorUtils.fiberStateToTextColor(FiberState.Major)), zIndex: 15 };
    this.criticalAccidentPlace = { icon: this.createAccidentPlaceIcon(ColorUtils.fiberStateToTextColor(FiberState.Critical)), zIndex: 15 };
    this.userAccidentPlace = { icon: this.createAccidentPlaceIcon(ColorUtils.fiberStateToTextColor(FiberState.User)), zIndex: 15 };

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
    const width = 36;
    const height = 36;

    return L.divIcon({
      className: 'map-marker-wrapper',
      html: `
              <div class="${colorClass}" style="width: ${width}px; height: ${height}px">
                <svg  viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" stroke-width="4"/>
                  <line x1="4" y1="20" x2="20" y2="4" stroke="currentColor" stroke-width="4"/>
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
    const size = 31;

    return L.divIcon({
      className: 'map-marker-wrapper',
      html: `
              <div class="${colorClass}" style="width: ${size}px; height: ${size}px">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 27 27">
                  <circle fill="none" stroke="currentColor" stroke-width="3" cx="13" cy="13" r="11"/>
                </svg>
              </div>
        `,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2]
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
