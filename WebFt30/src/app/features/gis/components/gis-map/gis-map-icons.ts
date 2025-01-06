import * as L from 'leaflet';
import { GisMapLayer } from '../../models/gis-map-layer';
import { FiberState } from 'src/app/core/store/models/ft30/ft-enums';
import { GisMapUtils } from './gis-map.utils';
import { OpticalEvent } from 'src/app/core/store/models/ft30/optical-event';

export interface GisIconWithZIndex {
  icon?: L.DivIcon;
  zIndex?: number;
}

export class GisMapIcons {
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

  private initMapIcons(): void {
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
