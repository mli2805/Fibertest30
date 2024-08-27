import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'rtu-no-data-or-load-more',
  templateUrl: 'no-data-or-load-more.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoDataOrLoadMoreComponent {
  @Input() pageSize = 250;
  @Input() array$!: Observable<any[] | null>;
  @Output() loadMore = new EventEmitter<any>();

  onLoadMore(lastLoaded: any) {
    this.loadMore.emit(lastLoaded);
  }
}
