import {
  Component,
  ViewChild,
  ViewContainerRef,
  Input,
  Output,
  ChangeDetectionStrategy,
  AfterViewInit,
  EventEmitter
} from '@angular/core';
import { SystemEventViewerFactory } from '../system-event-viewer-factory';
import { SystemEvent } from 'src/app/core/store/models';

@Component({
  selector: 'rtu-system-event-viewer',
  template: `<ng-container #systemEventContainer></ng-container>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemEventViewerComponent implements AfterViewInit {
  @ViewChild('systemEventContainer', { read: ViewContainerRef })
  systemEventContainer!: ViewContainerRef;

  @Input() systemEvent!: SystemEvent;
  @Output() navigatedToEvent = new EventEmitter<any>();

  constructor(private systemEventViewerFactory: SystemEventViewerFactory) {}

  ngAfterViewInit(): void {
    this.loadComponent();
  }

  loadComponent(): void {
    if (this.systemEvent && this.systemEventContainer) {
      this.systemEventViewerFactory.createComponent(
        this.systemEvent,
        this.systemEventContainer,
        this.navigatedToEvent
      );
    }
  }
}
