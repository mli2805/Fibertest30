import { EventEmitter, Injectable, ViewContainerRef } from '@angular/core';
import { SystemEvent } from 'src/app/core/store/models';
import {
  DefaultSystemEventViewerComponent,
  BaselineCompletedSystemEventViewerComponent,
  BaselineFailedSystemEventViewerComponent,
  UserChangedSystemEventViewerComponent,
  UserCreatedSystemEventViewerComponent,
  UserDeletedSystemEventViewerComponent,
  OtauConnectionStatusChangedSystemEventViewerComponent,
  OtauChangedSystemEventViewerComponent,
  OtauRemovedEventViewerComponent,
  OtauAddedEventViewerComponent,
  OtauInformationChangedSystemEventViewerComponent,
  MonitoringPortStatusChangedSystemEventViewerComponent,
  MonitoringPortScheduleChangedSystemEventViewerComponent,
  NotificationSettingsUpdatedSystemEventViewerComponent,
  UnsupportedOsmModuleEventViewerComponent
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
      case 'BaselineFailed':
        component = BaselineFailedSystemEventViewerComponent;
        break;
      case 'BaselineCompleted':
        component = BaselineCompletedSystemEventViewerComponent;
        break;
      case 'UserChanged':
        component = UserChangedSystemEventViewerComponent;
        break;
      case 'UserCreated':
        component = UserCreatedSystemEventViewerComponent;
        break;
      case 'UserDeleted':
        component = UserDeletedSystemEventViewerComponent;
        break;
      case 'OtauConnectionStatusChanged':
        component = OtauConnectionStatusChangedSystemEventViewerComponent;
        break;
      case 'OtauChanged':
        component = OtauChangedSystemEventViewerComponent;
        break;
      case 'OtauInformationChanged':
        component = OtauInformationChangedSystemEventViewerComponent;
        break;
      case 'OtauRemoved':
        component = OtauRemovedEventViewerComponent;
        break;
      case 'OtauAdded':
        component = OtauAddedEventViewerComponent;
        break;
      case 'UnsupportedOsmModuleConnected':
        component = UnsupportedOsmModuleEventViewerComponent;
        break;
      case 'MonitoringPortStatusChanged':
        component = MonitoringPortStatusChangedSystemEventViewerComponent;
        break;
      case 'MonitoringPortScheduleChanged':
        component = MonitoringPortScheduleChangedSystemEventViewerComponent;
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
