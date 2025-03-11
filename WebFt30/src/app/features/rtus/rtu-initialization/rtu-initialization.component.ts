import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState, AuthSelectors, DeviceSelectors, RtuTreeSelectors } from 'src/app/core';
import { CoreUtils } from 'src/app/core/core.utils';
import { InitializeRtuDto } from 'src/app/core/store/models/ft30/initialize-rtu-dto';
import { Rtu } from 'src/app/core/store/models/ft30/rtu';
import { RtuMgmtActions } from 'src/app/core/store/rtu-mgmt/rtu-mgmt.actions';
import { RtuMgmtSelectors } from 'src/app/core/store/rtu-mgmt/rtu-mgmt.selectors';
import { ReserveChannelTestComponent } from './reserve-channel-test/reserve-channel-test.component';
import { DoubleAddress } from 'src/app/core/store/models/ft30/double-address';

@Component({
  selector: 'rtu-rtu-initialization',
  templateUrl: './rtu-initialization.component.html'
})
export class RtuInitializationComponent implements OnInit, OnDestroy {
  rtuId!: string;
  rtu!: Rtu;

  @ViewChild('mainChannel') mainChannel!: ReserveChannelTestComponent;

  public store: Store<AppState> = inject(Store);
  initializing$ = this.store.select(RtuMgmtSelectors.selectInitializing);
  rtuInitializationResult$ = this.store.select(RtuMgmtSelectors.selectRtuInitializationResult);
  hasInitializePermission!: boolean;
  hasTestPermission!: boolean;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.rtuId = this.route.snapshot.paramMap.get('id')!;

    this.rtu = CoreUtils.getCurrentState(this.store, RtuTreeSelectors.selectRtu(this.rtuId))!;
    this.hasInitializePermission = CoreUtils.getCurrentState(
      this.store,
      AuthSelectors.selectHasInitializeRtuPermission
    );
    this.hasTestPermission = CoreUtils.getCurrentState(
      this.store,
      AuthSelectors.selectHasTestRtuPermission
    );
  }

  isDisabled() {
    return !this.hasInitializePermission;
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

  ngOnDestroy(): void {
    this.store.dispatch(RtuMgmtActions.reset());
  }
}
