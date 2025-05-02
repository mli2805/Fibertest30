import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AudioEventsActions, AudioEventsSelectors, AppState } from 'src/app/core';
import { CoreUtils } from 'src/app/core/core.utils';
import { AudioService } from 'src/app/core/services/audio.service';
import { HowShowTablesService } from 'src/app/core/services/how-show-tables.service';
import { AudioEvent } from 'src/app/core/store/models/ft30/audio-event';
import { BaseRefType } from 'src/app/core/store/models/ft30/ft-enums';

@Component({
  selector: 'rtu-new-events-table',
  templateUrl: './new-events-table.component.html'
})
export class NewEventsTableComponent {
  baseRefType = BaseRefType;
  private store: Store<AppState> = inject(Store<AppState>);

  newEvents$ = this.store.select(AudioEventsSelectors.selectOrderedEvents);

  constructor(
    private audioService: AudioService,
    private ns: HowShowTablesService,
    private router: Router
  ) {}

  navigateEvent(evnt: AudioEvent) {
    // раз новое событие, его еще может не быть в соотв табл - перечитать ????????

    // в сервис отдать как нужно установить перекл Текущие/Все и ID события
    // orderDescending передаем true - нужно показать свежее событие, поэтому сортируем от новых к старым
    this.ns.setOne(evnt.eventType, !evnt.isOk, true, evnt.eventId);
    // теперь компонент соотв таблицы при открытии вычитает нужные данные

    // перейти в нужн табл
    switch (evnt.eventType) {
      case 'OpticalEvent':
        this.router.navigate([`op-evnts/optical-events/`, evnt.eventId]);
        break;

      case 'NetworkEvent':
        this.router.navigate([`net-evnts/network-events/`]);
        break;

      case 'BopNetworkEvent':
        this.router.navigate([`bop-net-evnts/network-events-bop/`]);
        break;

      case 'RtuAccident':
        this.router.navigate([`sts-evnts/status-events/`]);
        break;
    }

    // если новые соб были открыты, звучит сирена и пользователь жмет переход - надо выкл сирену
    if (!evnt.isOk) this.audioService.dismissEvent(evnt);
    // удалить из новых событий строку
    this.store.dispatch(AudioEventsActions.removeEvent({ removeEvent: evnt }));
  }

  getEventTypeName(evntType: string) {
    switch (evntType) {
      case 'OpticalEvent':
        return 'i18n.ft.optical-event';

      case 'NetworkEvent':
        return 'i18n.ft.network-event';

      case 'BopNetworkEvent':
        return 'i18n.ft.bop-network-event';

      case 'RtuAccident':
        return 'i18n.ft.rtu-status-event';
    }

    return 'i18n.ft.unknown';
  }

  dismissEvent(evnt: AudioEvent) {
    this.store.dispatch(AudioEventsActions.removeEvent({ removeEvent: evnt }));
    if (!evnt.isOk) this.audioService.dismissEvent(evnt);
  }

  cleanAll() {
    const all = CoreUtils.getCurrentState(this.store, AudioEventsSelectors.selectAudioEvents);
    all.forEach((e) => this.dismissEvent(e));
  }
}
