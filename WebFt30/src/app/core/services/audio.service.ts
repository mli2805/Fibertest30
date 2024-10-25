import { Injectable } from '@angular/core';
import { AnyTypeEvent } from '../store/models/ft30/any-type-event';

// храним только события плохие - OK здесь не нужны
// и если "просмотрено", то isOn = false
export interface SoundAlarm {
  objId: string;
  isOn: boolean;
}

// например { OpticalEvents, массив плохих оптических событий }
export interface TypedSoundAlarms {
  eventType: string;
  alarms: SoundAlarm[];
}

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private alarmMp3: any;
  private okMp3: any;

  private allAlarms: TypedSoundAlarms[] = [];

  private isPlayingNow = false;

  constructor() {
    this.alarmMp3 = new Audio('../../../../../assets/sounds/accident.mp3');
    this.alarmMp3.loop = true;
    this.okMp3 = new Audio('../../../../../assets/sounds/ok.mp3');

    this.allAlarms.push({ eventType: 'OpticalEvent', alarms: [] });
    this.allAlarms.push({ eventType: 'NetworkEvent', alarms: [] });
    this.allAlarms.push({ eventType: 'BopNetworkEvent', alarms: [] });
    this.allAlarms.push({ eventType: 'RtuAccident', alarms: [] });
  }

  play(anyTypeEvent: AnyTypeEvent) {
    this.updateAllAlarms(anyTypeEvent);

    if (anyTypeEvent.isOk) {
      // если была сирена и мы удалили последний аларм - выключить
      if (this.isPlayingNow && !this.hasAnyAlarmOn()) {
        this.stopAlarm();
      }
      // сыграть ок
      this.okMp3.play();
    } else {
      // запустить сирену, проверка флага внутри
      this.playAlarm();
    }
  }

  // нажата кнопка NewEvents
  stopAll() {
    if (this.isPlayingNow) {
      this.stopAlarm();
    }

    for (let i = 0; i < this.allAlarms.length; i++) {
      for (let j = 0; j < this.allAlarms[i].alarms.length; j++) {
        this.allAlarms[i].alarms[j].isOn = false;
      }
    }
  }

  // dismissEvent (убрали из таблицы новых 1 ивент)
  dismissEvent(anyTypeEvent: AnyTypeEvent) {
    this.removeOldIfExists(anyTypeEvent);

    // если была сирена и пользователь удалил последний аларм - выключить
    if (this.isPlayingNow && !this.hasAnyAlarmOn()) {
      this.stopAlarm();
    }
  }

  private playAlarm() {
    if (this.isPlayingNow) return;
    this.alarmMp3.play();
    this.isPlayingNow = true;
  }

  private stopAlarm() {
    this.alarmMp3.pause();
    this.isPlayingNow = false;
  }

  // пришёл новый ивент
  private updateAllAlarms(anyTypeEvent: AnyTypeEvent) {
    const pair = this.allAlarms.find((el) => el.eventType === anyTypeEvent.eventType);
    this.updateOneTypeArray(pair!.alarms, anyTypeEvent);
  }

  // обновить подмассив нужного типа событий
  private updateOneTypeArray(alarms: SoundAlarm[], anyTypeEvent: AnyTypeEvent) {
    this.removeOldIfExists(anyTypeEvent);

    if (!anyTypeEvent.isOk) {
      alarms.push({ objId: anyTypeEvent.objId, isOn: true });
    }
  }

  private removeOldIfExists(anyTypeEvent: AnyTypeEvent) {
    const pair = this.allAlarms.find((el) => el.eventType === anyTypeEvent.eventType);
    const idx = pair!.alarms.findIndex((el) => el.objId === anyTypeEvent.objId);
    if (idx > -1) {
      // ok вообще нету,ну и на всякий случай
      pair!.alarms.splice(idx, 1);
    }
  }

  private hasAnyAlarmOn() {
    return (
      this.allAlarms
        .map((a) => a.alarms)
        .flat()
        .filter((s) => s.isOn).length > 0
    );
  }
}
