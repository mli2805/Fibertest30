import { Component, Input, inject } from '@angular/core';
import {
  filter,
  switchMap,
  takeUntil,
  pipe,
  Subject,
  Observable,
  tap,
  ReplaySubject,
  BehaviorSubject,
  map
} from 'rxjs';
import { MonitoringPortSelectors, OtausActions, TimeAgoService } from 'src/app/core';
import { ConvertUtils } from 'src/app/core/convert.utils';
import { MonitoringPort, Otau, OtauPort } from 'src/app/core/store/models';
import { OnDestroyBase } from 'src/app/shared/components/on-destroy-base/on-destroy-base';
import { OtauPatch } from './otau-patch';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core';
import { Dictionary } from '@ngrx/entity';
import { CombinedPort } from 'src/app/core/store/models/combined-port';
import { MonitoringPortStatus } from 'src/grpc-generated';

@Component({
  selector: 'rtu-otau-card',
  templateUrl: './otau-card.component.html',
  styleUrls: ['./otau-card.component.css']
})
export class OtauCardComponent extends OnDestroyBase {
  public store: Store<AppState> = inject(Store);
  private otauChanged = new ReplaySubject<Otau>();

  private _otau!: Otau;
  private _hasPermission!: boolean;

  combinedOtauPorts$!: Observable<CombinedPort[]>;
  calculateOtauPortsStatus$!: Observable<{
    active: number;
    maintenance: number;
    available: number;
  }>;

  relativeOnlineAt$: Observable<string>;
  relativeOfflineAt$: Observable<string>;
  converterUtils = ConvertUtils;

  @Input() monitoringPorts!: Dictionary<MonitoringPort>;

  @Input()
  set hasPermission(value: boolean | null) {
    if (value === null) return;
    this._hasPermission = value;
  }

  get hasPermission(): boolean {
    return this._hasPermission;
  }

  @Input()
  set otau(value: Otau) {
    this._otau = value;
    this.otauChanged.next(value);
  }

  get otau(): Otau {
    return this._otau;
  }

  constructor(private timeAgoService: TimeAgoService) {
    super();

    this.relativeOnlineAt$ = this.otauChanged.pipe(
      takeUntil(this.ngDestroyed$),
      filter((otau: Otau) => otau.onlineAt !== null),
      switchMap((otau: Otau) => this.timeAgoService.getRelativeTime(otau.onlineAt!, false, true))
    );

    this.relativeOfflineAt$ = this.otauChanged.pipe(
      takeUntil(this.ngDestroyed$),
      filter((otau: Otau) => otau.offlineAt !== null),
      switchMap((otau: Otau) => this.timeAgoService.getRelativeTime(otau.offlineAt!, false))
    );

    this.combinedOtauPorts$ = this.otauChanged.pipe(
      takeUntil(this.ngDestroyed$),
      switchMap((otau: Otau) => {
        return this.store.select(MonitoringPortSelectors.selectCombinedOtauPorts(otau));
      })
    );

    this.calculateOtauPortsStatus$ = this.combinedOtauPorts$.pipe(
      takeUntil(this.ngDestroyed$),
      map((ports: CombinedPort[]) => {
        return {
          active: this.getActivePortCount(ports),
          maintenance: this.getMaintenancePortCount(ports),
          available: this.getAvailablePortCount(ports)
        };
      })
    );
  }

  persist(patch: OtauPatch) {
    this.store.dispatch(OtausActions.updateOtau({ otauId: this._otau.id, patch }));
  }

  nameChanged(newValue: string) {
    if (newValue !== this._otau.name) {
      const patch = new OtauPatch();
      patch.name = newValue;
      this.persist(patch);
    }
  }

  locationChanged(newValue: string) {
    if (newValue !== this._otau.location) {
      const patch = new OtauPatch();
      patch.location = newValue;
      this.persist(patch);
    }
  }

  rackChanged(newValue: string) {
    if (newValue !== this._otau.rack) {
      const patch = new OtauPatch();
      patch.rack = newValue;
      this.persist(patch);
    }
  }

  shelfChanged(newValue: string) {
    if (newValue !== this._otau.shelf) {
      const patch = new OtauPatch();
      patch.shelf = newValue;
      this.persist(patch);
    }
  }

  noteChanged(newValue: string) {
    if (newValue !== this._otau.note) {
      const patch = new OtauPatch();
      patch.note = newValue;
      this.persist(patch);
    }
  }

  setRouterSelectedOtauId() {
    this.store.dispatch(
      OtausActions.setRouterSelectedOtauOcmPortIndex({ ocmPortIndex: this._otau.ocmPortIndex })
    );
  }

  getAvailablePortCount(ports: CombinedPort[]): number {
    return ports
      .filter((x) => x.otauPort.unavailable === false && x.cascadeOtau == null)
      .filter((x) => x.monitoringPort?.status === MonitoringPortStatus.Off).length;
  }

  getMaintenancePortCount(ports: CombinedPort[]): number {
    return ports
      .filter((x) => x.otauPort.unavailable === false && x.cascadeOtau == null)
      .filter((x) => x.monitoringPort?.status === MonitoringPortStatus.Maintenance).length;
  }

  getActivePortCount(ports: CombinedPort[]): number {
    return ports
      .filter((x) => x.otauPort.unavailable === false && x.cascadeOtau == null)
      .filter((x) => x.monitoringPort?.status === MonitoringPortStatus.On).length;
  }
}
