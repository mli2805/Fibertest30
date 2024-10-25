import { Injectable } from '@angular/core';
import { AnyTypeEvent } from '../store/models/ft30/any-type-event';

export interface EventTypeIdsArrayPair {
  eventType: string;
  ids: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  alarmAudio: any;
  okAudio: any;

  alarmObjIds: EventTypeIdsArrayPair[] = [];

  isPlayingNow = false;

  constructor() {
    this.alarmAudio = new Audio('../../../../../assets/sounds/accident.mp3');
    this.alarmAudio.loop = true;
    this.okAudio = new Audio('../../../../../assets/sounds/ok.mp3');

    this.alarmObjIds.push({ eventType: 'OpticalEvent', ids: [] });
    this.alarmObjIds.push({ eventType: 'NetworkEvent', ids: [] });
    this.alarmObjIds.push({ eventType: 'BopNetworkEvent', ids: [] });
    this.alarmObjIds.push({ eventType: 'RtuAccident', ids: [] });
  }

  play(anyTypeEvent: AnyTypeEvent) {
    this.updateIdArrays(anyTypeEvent);

    if (anyTypeEvent.isOk) {
      // если была сирена и мы удалили последний аларм - выключить
      if (this.isPlayingNow && !this.hasAnyAlarm()) {
        this.stopAlarm();
      }
      // сыграть ок
      this.okAudio.play();
    } else {
      // запустить сирену, проверка флага внутри
      this.playAlarm();
    }
  }

  // нажата кнопка
  stopAll() {
    if (this.isPlayingNow) {
      this.stopAlarm();
    }
  }

  private playAlarm() {
    if (this.isPlayingNow) return;
    this.alarmAudio.play();
    this.isPlayingNow = true;
  }

  private stopAlarm() {
    this.alarmAudio.pause();
    this.isPlayingNow = false;
  }

  private updateIdArrays(anyTypeEvent: AnyTypeEvent) {
    const pair = this.alarmObjIds.find((el) => el.eventType === anyTypeEvent.eventType);
    this.updateAlarmIdsArray(pair!.ids, anyTypeEvent.objId, anyTypeEvent.isOk);
  }

  private updateAlarmIdsArray(ids: string[], id: string, isOk: boolean) {
    const ind = ids.indexOf(id);
    if (ind > -1) {
      ids.splice(ind, 1);
    }
    if (!isOk) {
      ids.push(id);
    }
  }

  private hasAnyAlarm() {
    return this.alarmObjIds.find((el) => el.ids.length > 0) !== undefined;
  }
}
