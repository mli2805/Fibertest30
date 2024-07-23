import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState, DeviceSelectors, RtuTreeSelectors } from 'src/app/core';
import { CoreUtils } from 'src/app/core/core.utils';
import { Rtu } from 'src/app/core/store/models/ft30/rtu';
import { RtuMgmtActions } from 'src/app/core/store/rtu-mgmt/rtu-mgmt.actions';
import { RtuMgmtSelectors } from 'src/app/core/store/rtu-mgmt/rtu-mgmt.selectors';

@Component({
  selector: 'rtu-rtu-initialization',
  templateUrl: './rtu-initialization.component.html',
  styleUrls: ['./rtu-initialization.component.scss']
})
export class RtuInitializationComponent implements OnInit {
  rtuId!: string;
  rtu!: Rtu;

  public store: Store<AppState> = inject(Store);
  testInProgress$ = this.store.select(RtuMgmtSelectors.selectInProgress);
  testSuccess$ = this.store.select(RtuMgmtSelectors.selectIsTestSuccessful);
  testFailure$ = this.store.select(RtuMgmtSelectors.selectErrorMessageId);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.rtuId = this.route.snapshot.paramMap.get('id')!;

    this.rtu = CoreUtils.getCurrentState(this.store, RtuTreeSelectors.selectRtu(this.rtuId))!;
  }

  onTestClicked() {
    this.store.dispatch(RtuMgmtActions.testRtuConnection({ netAddress: this.rtu.mainChannel }));
  }
}
