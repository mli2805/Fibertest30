import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, RtuTreeSelectors } from 'src/app/core';
import { RtuMgmtSelectors } from 'src/app/core/store/rtu-mgmt/rtu-mgmt.selectors';

@Component({
  selector: 'rtu-rtu-tree',
  templateUrl: './rtu-tree.component.html'
})
export class RtuTreeComponent {
  rtus$ = this.store.select(RtuTreeSelectors.selectRtuArray);
  inProgress$ = this.store.select(RtuMgmtSelectors.selectRtuOperationInProgress);

  constructor(private store: Store<AppState>) {}
}
