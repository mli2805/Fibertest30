import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { OtdrTaskProgress } from 'src/app/core';
import { ConvertUtils } from 'src/app/core/convert.utils';

@Component({
  selector: 'rtu-task-status',
  templateUrl: 'task-status.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskStatusComponent {
  @Input() titleMessageId: string | null = null;
  @Input() progress!: OtdrTaskProgress | null;
  @Input() cancelling!: boolean;
  @Input() cancelled!: boolean;
  @Input() errorMessageId!: string | null;

  getRunningStringId(stepName: string | null) {
    const stepNameId = ConvertUtils.getStepNameId(stepName);
    return stepNameId || 'i18n.otdr-task-status.running';
  }
}
