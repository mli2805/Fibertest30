import { Component, inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, AuthSelectors, RtuTreeSelectors } from 'src/app/core';
import { CoreUtils } from 'src/app/core/core.utils';
import { InitializeRtuDto } from 'src/app/core/store/models/ft30/initialize-rtu-dto';
import { Rtu } from 'src/app/core/store/models/ft30/rtu';
import { RtuMgmtActions } from 'src/app/core/store/rtu-mgmt/rtu-mgmt.actions';
import { RtuMgmtSelectors } from 'src/app/core/store/rtu-mgmt/rtu-mgmt.selectors';
import { DoubleAddress } from 'src/app/core/store/models/ft30/double-address';
import { MainChannelTestComponent } from './main-channel-test/main-channel-test.component';
import { Observable, Subscription } from 'rxjs';
import { WindowService } from 'src/app/app/pages/start-page/components/window.service';

@Component({
  selector: 'rtu-rtu-initialization',
  templateUrl: './rtu-initialization.component.html',
  standalone: false
})
export class RtuInitializationComponent implements OnInit, OnDestroy {
  @Input() rtuId!: string;
  @Input() zIndex!: number;
  rtu$!: Observable<Rtu | null>;
  subscription!: Subscription;

  @ViewChild('mainChannel') mainChannel!: MainChannelTestComponent;

  public store: Store<AppState> = inject(Store);
  initializing$ = this.store.select(RtuMgmtSelectors.selectInitializing);
  rtuInitializationResult$ = this.store.select(RtuMgmtSelectors.selectRtuInitializationResult);
  hasInitializePermission!: boolean;
  hasTestPermission!: boolean;
  hasChangeRtuAddressPermission!: boolean;
  otherThanMainAddress!: string[];
  otherThanReserveAddress!: string[];

  constructor(private windowService: WindowService) {}

  ngOnInit(): void {
    this.rtu$ = this.store.select(RtuTreeSelectors.selectRtu(this.rtuId));

    this.hasInitializePermission = CoreUtils.getCurrentState(
      this.store,
      AuthSelectors.selectHasInitializeRtuPermission
    );
    this.hasTestPermission = CoreUtils.getCurrentState(
      this.store,
      AuthSelectors.selectHasTestRtuPermission
    );
    this.hasChangeRtuAddressPermission = CoreUtils.getCurrentState(
      this.store,
      AuthSelectors.selectHasChangeRtuAddressPermission
    );

    const rtu = CoreUtils.getCurrentState(this.store, RtuTreeSelectors.selectRtu(this.rtuId));
    const allRtuAddresses = CoreUtils.getCurrentState(
      this.store,
      RtuTreeSelectors.selectAddresses()
    )!;

    this.otherThanMainAddress = [...allRtuAddresses];
    const idx = this.otherThanMainAddress.findIndex((a) => a === rtu?.mainChannel.ip4Address);
    if (idx !== -1) this.otherThanMainAddress.splice(idx, 1);

    this.otherThanReserveAddress = [...allRtuAddresses];
    const idx2 = this.otherThanReserveAddress.findIndex(
      (a) => a === rtu?.reserveChannel.ip4Address
    );
    if (idx2 !== -1) this.otherThanReserveAddress.splice(idx2, 1);
  }

  onInitializeClicked(isSynchronizationRequired: boolean) {
    const dto = new InitializeRtuDto();
    dto.rtuId = this.rtuId;
    dto.isSynchronizationRequired = isSynchronizationRequired;
    const da = new DoubleAddress();
    da.main = this.mainChannel.composeInputs();
    da.hasReserveAddress = false;
    dto.rtuAddresses = da;
    this.store.dispatch(RtuMgmtActions.initializeRtu({ dto }));
  }

  ngOnDestroy(): void {
    this.store.dispatch(RtuMgmtActions.reset());
  }

  close() {
    this.windowService.unregisterWindow(this.rtuId, 'NetworkSettings');
  }
}
