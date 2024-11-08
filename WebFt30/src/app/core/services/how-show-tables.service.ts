import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HowShowTablesService {
  opticalShowCurrent = true;
  opticalOrderDescending = true;
  networkShowCurrent = true;
  networkOrderDescending = true;
  bopNetworkShowCurrent = true;
  bopNetworkOrderDescending = true;
  rtuAccidentsShowCurrent = true;
  rtuAccidentsOrderDescending = true;

  opticalEventId = -1;
  networkEventId = -1;
  bopNetworkEventId = -1;
  rtuAccidentId = -1;

  setOne(eventType: string, showCurrent: boolean, orderDescending: boolean, eventId: number) {
    switch (eventType) {
      case 'OpticalEvent':
        this.opticalShowCurrent = showCurrent;
        this.opticalOrderDescending = orderDescending;
        this.opticalEventId = eventId;
        break;

      case 'NetworkEvent':
        this.networkShowCurrent = showCurrent;
        this.networkOrderDescending = orderDescending;
        this.networkEventId = eventId;
        break;

      case 'BopNetworkEvent':
        this.bopNetworkShowCurrent = showCurrent;
        this.bopNetworkOrderDescending = orderDescending;
        this.bopNetworkEventId = eventId;
        break;

      case 'RtuAccident':
        this.rtuAccidentsShowCurrent = showCurrent;
        this.rtuAccidentsOrderDescending = orderDescending;
        this.rtuAccidentId = eventId;
        break;
    }
  }
}
