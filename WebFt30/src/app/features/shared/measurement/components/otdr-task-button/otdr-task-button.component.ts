import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/core';

@Component({
  selector: 'rtu-otdr-task-button',
  templateUrl: 'otdr-task-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OtdrTaskButtonComponent {
  @Input() canStart = true;
  @Input() size: 'small' | 'normal' = 'normal';
  @Input() startButtonImage: 'no-circle' | 'normal' = 'normal';
  @Input() startButtonMessageId!: string;
  @Input() stopButtonMessageId!: string;
  @Input() startButtonMessageNoWrap = false;

  @Input() showStart$!: Observable<boolean>;
  @Input() starting$!: Observable<boolean>;
  @Input() started$!: Observable<boolean>;
  @Input() cancelling$!: Observable<boolean>;

  @Output() public startClicked = new EventEmitter<any>();
  @Output() public stopClicked = new EventEmitter<any>();

  constructor(public store: Store<AppState>) {}

  start() {
    this.startClicked.next(null);
  }

  stop() {
    this.stopClicked.next(null);
  }
}
