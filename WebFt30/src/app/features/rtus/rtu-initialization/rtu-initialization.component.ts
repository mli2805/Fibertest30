import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState, DeviceSelectors, RtuTreeSelectors } from 'src/app/core';
import { CoreUtils } from 'src/app/core/core.utils';
import { InitializeRtuDto } from 'src/app/core/store/models/ft30/initialize-rtu-dto';
import { Rtu } from 'src/app/core/store/models/ft30/rtu';
import { RtuMgmtActions } from 'src/app/core/store/rtu-mgmt/rtu-mgmt.actions';
import { RtuMgmtSelectors } from 'src/app/core/store/rtu-mgmt/rtu-mgmt.selectors';
import { OneChannelTestComponent } from './one-channel-test/one-channel-test.component';
import { DoubleAddress } from 'src/app/core/store/models/ft30/double-address';

@Component({
  selector: 'rtu-rtu-initialization',
  templateUrl: './rtu-initialization.component.html'
})
export class RtuInitializationComponent implements OnInit {
  rtuId!: string;
  rtu!: Rtu;

  @ViewChild('mainChannel') mainChannel!: OneChannelTestComponent;

  public store: Store<AppState> = inject(Store);
  initializing$ = this.store.select(RtuMgmtSelectors.selectInitializing);
  rtuInitializationResult$ = this.store.select(RtuMgmtSelectors.selectRtuInitializationResult);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.rtuId = this.route.snapshot.paramMap.get('id')!;

    this.rtu = CoreUtils.getCurrentState(this.store, RtuTreeSelectors.selectRtu(this.rtuId))!;
  }

  onInitializeClicked() {
    const dto = new InitializeRtuDto();
    dto.rtuId = this.rtu.rtuId;
    const da = new DoubleAddress();
    da.main = this.mainChannel.composeInputs();
    da.hasReserveAddress = false;
    dto.rtuAddresses = da;
    this.store.dispatch(RtuMgmtActions.initializeRtu({ dto }));
  }
}
