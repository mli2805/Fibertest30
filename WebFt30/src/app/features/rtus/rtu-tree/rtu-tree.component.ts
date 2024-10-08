import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, RtuTreeSelectors } from 'src/app/core';

@Component({
  selector: 'rtu-rtu-tree',
  templateUrl: './rtu-tree.component.html'
})
export class RtuTreeComponent {
  rtus$ = this.store.select(RtuTreeSelectors.selectRtuArray);

  constructor(private store: Store<AppState>) {}
}
