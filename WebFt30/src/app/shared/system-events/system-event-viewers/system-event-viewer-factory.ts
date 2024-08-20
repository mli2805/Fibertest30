import { EventEmitter, Injectable, ViewContainerRef } from '@angular/core';
import { SystemEvent } from 'src/app/core/store/models';
import {
  DefaultSystemEventViewerComponent,
  UserChangedSystemEventViewerComponent,
  UserCreatedSystemEventViewerComponent,
  UserDeletedSystemEventViewerComponent,
  NotificationSettingsUpdatedSystemEventViewerComponent
} from '.';

@Injectable({ providedIn: 'root' })
export class SystemEventViewerFactory {
  public createComponent(
    systemEvent: SystemEvent,
    viewContainerRef: ViewContainerRef,
    navigatedToEvent: EventEmitter<any>
  ) {
    let component;

    switch (systemEvent.type) {
      case 'UserChanged':
        component = UserChangedSystemEventViewerComponent;
        break;
      case 'UserCreated':
        component = UserCreatedSystemEventViewerComponent;
        break;
      case 'UserDeleted':
        component = UserDeletedSystemEventViewerComponent;
        break;

      case 'NotificationSettingsUpdated':
        component = NotificationSettingsUpdatedSystemEventViewerComponent;
        break;
      default:
        component = DefaultSystemEventViewerComponent;
    }

    const componentRef = viewContainerRef.createComponent(component);
    const instance = componentRef.instance as any;
    instance.systemEvent = systemEvent;

    if (instance.navigatedToEvent && instance.navigatedToEvent instanceof EventEmitter) {
      const subscribeToNavigatedToEvent = instance.navigatedToEvent.subscribe((eventData: any) => {
        navigatedToEvent.emit(eventData);
      });

      componentRef.onDestroy(() => {
        subscribeToNavigatedToEvent.unsubscribe();
      });
    }

    componentRef.changeDetectorRef.detectChanges();
  }
}
