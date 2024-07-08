import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, RtuTreeSelectors } from 'src/app/core';
import { Rtu } from 'src/app/core/store/models/ft30/rtu';

@Component({
  selector: 'rtu-rtu-tree',
  templateUrl: './rtu-tree.component.html'
})
export class RtuTreeComponent {
  rtus$ = this.store.select(RtuTreeSelectors.selectRtuTree);

  expandedIds: string[] = [];

  constructor(private store: Store<AppState>) {
    //
  }

  flipBranch(rtu: Rtu) {
    const index = this.expandedIds.indexOf(rtu.rtuId);
    if (index === -1) {
      this.expandedIds.push(rtu.rtuId);
    } else {
      this.expandedIds.splice(index, 1);
    }
  }

  isExpanded(id: string) {
    return this.expandedIds.indexOf(id) !== -1;
  }
}
