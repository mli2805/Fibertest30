import { Pipe, PipeTransform } from '@angular/core';
import { ChannelEvent } from 'src/app/core/store/models/ft30/ft-enums';

@Pipe({ name: 'channelEventPipe' })
export class ChannelEventPipe implements PipeTransform {
  transform(value: ChannelEvent) {
    switch (value) {
      case ChannelEvent.Broken:
        return 'i18n.ft.broken';
      case ChannelEvent.Nothing:
        return '';
      case ChannelEvent.Repaired:
        return 'i18n.ft.repaired';
    }
  }
}
