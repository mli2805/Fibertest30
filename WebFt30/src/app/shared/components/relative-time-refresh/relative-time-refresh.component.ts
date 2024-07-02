import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject, Observable, filter, switchMap, takeUntil, tap } from 'rxjs';
import { OnDestroyBase } from '../on-destroy-base/on-destroy-base';
import { TimeAgoService } from 'src/app/core';

@Component({
  selector: 'rtu-relative-time-refresh',
  templateUrl: 'relative-time-refresh.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RelativeTimeRefreshComponent extends OnDestroyBase {
  private loadedTimeChanged = new BehaviorSubject<Date | null>(null);

  @Input()
  set loadedTime(value: Date | null) {
    this.loadedTimeChanged.next(value);
  }

  @Output() refresh = new EventEmitter<void>();
  relativeTime$: Observable<string>;

  constructor(private timeAgoService: TimeAgoService) {
    super();

    this.relativeTime$ = this.loadedTimeChanged.pipe(
      takeUntil(this.ngDestroyed$),
      filter((date) => date !== null),
      switchMap((date) => this.timeAgoService.getRelativeTime(date!))
    );
  }

  onRefresh() {
    this.refresh.next();
  }
}
