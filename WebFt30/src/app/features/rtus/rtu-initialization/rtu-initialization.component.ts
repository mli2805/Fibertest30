import {
  AfterViewInit,
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
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
import { CdkDrag } from '@angular/cdk/drag-drop';
import { DragWatcher } from 'src/app/shared/utils/drag-watcher';

@Component({
  selector: 'rtu-rtu-initialization',
  templateUrl: './rtu-initialization.component.html'
})
export class RtuInitializationComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(CdkDrag) dragRef!: CdkDrag;
  dragWatcher = DragWatcher;

  @Input() rtuId!: string;
  rtu$!: Observable<Rtu | null>;
  subscription!: Subscription;

  @ViewChild('mainChannel') mainChannel!: MainChannelTestComponent;

  public store: Store<AppState> = inject(Store);
  initializing$ = this.store.select(RtuMgmtSelectors.selectInitializing);
  rtuInitializationResult$ = this.store.select(RtuMgmtSelectors.selectRtuInitializationResult);
  hasInitializePermission!: boolean;
  hasTestPermission!: boolean;
  hasChangeRtuAddressPermission!: boolean;
  otherRtuAddresses!: string[];

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

    this.otherRtuAddresses = CoreUtils.getCurrentState(
      this.store,
      RtuTreeSelectors.selectAdresses()
    )!;
  }

  ngAfterViewInit() {
    this.dragRef.setFreeDragPosition({ x: 180, y: 50 });
  }

  onInitializeClicked() {
    const dto = new InitializeRtuDto();
    dto.rtuId = this.rtuId;
    const da = new DoubleAddress();
    da.main = this.mainChannel.composeInputs();
    da.hasReserveAddress = false;
    dto.rtuAddresses = da;
    this.store.dispatch(RtuMgmtActions.initializeRtu({ dto }));
  }

  ngOnDestroy(): void {
    this.store.dispatch(RtuMgmtActions.reset());
  }

  zIndex = 1;
  bringToFront() {
    this.windowService.bringToFront(this.rtuId, 'NetworkSettings');
    this.updateZIndex();
  }

  private updateZIndex() {
    const windowData = this.windowService.getWindows().find((w) => w.id === this.rtuId);
    // Обновляем только если значение изменилось
    if (windowData?.zIndex !== this.zIndex) {
      this.zIndex = windowData?.zIndex || 1;
    }
  }

  close() {
    this.windowService.unregisterWindow(this.rtuId, 'NetworkSettings');
  }
}
