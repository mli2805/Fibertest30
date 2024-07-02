import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SystemEvent } from 'src/app/core/store/models';

@Component({
  selector: 'rtu-default-system-event-viewer',
  template: `{{ systemEvent.type }}`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefaultSystemEventViewerComponent {
  @Input() systemEvent!: SystemEvent;
}
