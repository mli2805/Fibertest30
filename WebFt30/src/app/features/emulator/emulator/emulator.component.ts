import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { BehaviorSubject, Observable, Subject, catchError, finalize, of, tap } from 'rxjs';
import { GrpcUtils } from 'src/app/core/grpc/grpc.utils';
import { OtauEmulatorPortChangesMap } from '../port-changes/otau-emulator-port-changes';
import { OtauEmulatorConfig } from './otau-emulator-config';

interface OtauControllerSseEvent {
  Type: string;
  Action: string;
  EmulatedOtauId: string;
  Port: string;
}

interface OtdrMeasureProgressSse {
  Progress: number;
  Laser: string;
  DistanceRange: string;
  Pulse: string;
  Resolution: string;
  AveragingTime: string;
}

interface OtdrControllerSseEvent {
  Type: string;
  Action: string;
  Parameters: OtdrMeasureProgressSse;
}

interface LastAction {
  action: string;
  timer: any;
}

@Component({
  selector: 'rtu-emulator-component',
  templateUrl: 'emulator.component.html',
  styles: [
    `
      :host {
        display: flex;
        width: 100%;
        height: 100%;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmulatorComponent implements OnInit, OnDestroy {
  // The blink time must be syncronized with the blink time in the real OTAU (and the UI)
  private BlinkTimeMs = 15000;

  private LastActionTimeMs = 1500;

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  private errorMessageIdSubject = new BehaviorSubject<string | null>(null);
  errorMessageId$: Observable<string | null> = this.errorMessageIdSubject.asObservable();

  public otauConfigUrl = GrpcUtils.getApiUrl() + '/emulator/otau';
  public sseConfigUrl = GrpcUtils.getApiUrl() + '/emulator/sse';
  public otauPortChangesConfigUrl = GrpcUtils.getApiUrl() + '/emulator/otau-port-changes';

  otauConfig: OtauEmulatorConfig | null = null;
  portChanges: OtauEmulatorPortChangesMap | null = null;

  private eventSource: EventSource | null = null;
  private updatesSubject = new Subject<string>();

  private blinkSet: Set<string> = new Set<string>();
  private lastOtauActionMap: Dictionary<LastAction> = {};
  private lastOtauSetPortMap: Dictionary<string> = {};
  public lastOtdrEvent: OtdrControllerSseEvent | null = null;
  public lastOtdrEventTimer: any | null = null;

  public sseMessages: string[] = [];

  exceptionExpanded = false;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnDestroy(): void {
    this.closeSse();
  }

  ngOnInit(): void {
    this.http.get<OtauEmulatorConfig>(this.otauConfigUrl).subscribe({
      next: (data) => {
        this.otauConfig = data;
      },
      error: (error) => {
        this.errorMessageIdSubject.next("Can't get OTAU configuration.");
      }
    });

    this.http.get<OtauEmulatorPortChangesMap>(this.otauPortChangesConfigUrl).subscribe({
      next: (data) => {
        this.portChanges = data;
      },
      error: (error) => {
        this.errorMessageIdSubject.next("Can't get OTAU Port Changes configuration.");
      }
    });

    this.initializeSse().subscribe({
      next: (text) => {
        this.sseMessages.push(text);
        const obj = JSON.parse(text);
        if (obj.Type === 'OtauController') {
          this.processOtauControllerType(obj);
        }
        if (obj.Type === 'Otdr') {
          this.processOtdrType(obj);
        }

        this.cdr.markForCheck();
      },
      error: (error) => {
        this.errorMessageIdSubject.next(
          "Can't establish or lost SSE connection. Please refresh the page."
        );
      }
    });
  }

  lastOtauAction(emulatedOtauId: string): string {
    return this.lastOtauActionMap[emulatedOtauId]?.action || '';
  }

  lastOtauSetPort(emulatedOtauId: string): string {
    return this.lastOtauSetPortMap[emulatedOtauId] || '';
  }

  blinking(emulatedOtauId: string): boolean {
    return this.blinkSet.has(emulatedOtauId);
  }

  processOtauControllerType(sseEvent: OtauControllerSseEvent) {
    this.setLastOtauAction(sseEvent);

    if (sseEvent.Action === 'Blink') {
      this.blinkOtau(sseEvent.EmulatedOtauId);
    }
  }

  processOtdrType(sseEvent: OtdrControllerSseEvent) {
    this.setLastOtdrAction(sseEvent);
  }

  setLastOtauAction(sseEvent: OtauControllerSseEvent) {
    if (sseEvent.Action === 'Ping') {
      // do not show annoying constant ping actions
      return;
    }

    let action = sseEvent.Action;
    if (sseEvent.Action === 'SetPort') {
      action = action + ' ' + sseEvent.Port;
      this.lastOtauSetPortMap[sseEvent.EmulatedOtauId] = sseEvent.Port;
    }

    if (this.lastOtauActionMap[sseEvent.EmulatedOtauId]) {
      clearTimeout(this.lastOtauActionMap[sseEvent.EmulatedOtauId]!.timer);
    }

    this.lastOtauActionMap[sseEvent.EmulatedOtauId] = {
      action,
      timer: setTimeout(() => {
        delete this.lastOtauActionMap[sseEvent.EmulatedOtauId];
      }, this.LastActionTimeMs)
    };
  }

  setLastOtdrAction(sseEvent: OtdrControllerSseEvent) {
    if (this.lastOtdrEventTimer != null) {
      clearTimeout(this.lastOtdrEventTimer);
    }

    if (
      (sseEvent.Action === 'MeasureProgress' && sseEvent.Parameters.Progress === 1) ||
      sseEvent.Action === 'MeasureCancelled'
    ) {
      this.lastOtauSetPortMap = {};
    }

    this.lastOtdrEvent = sseEvent;
    this.lastOtdrEventTimer = setTimeout(() => {
      this.lastOtdrEvent = null;
      this.lastOtdrEventTimer = null;
    }, this.LastActionTimeMs);
  }

  blinkOtau(emulatedOtauId: string) {
    this.blinkSet.add(emulatedOtauId);
    setTimeout(() => {
      this.blinkSet.delete(emulatedOtauId);
    }, this.BlinkTimeMs);
  }

  // findOtau(emulatedOtauId: string): OtauEmulatorSetting | null {
  //   if (this.otauConfig!.Ocm.EmulatedOtauId === emulatedOtauId) {
  //     return this.otauConfig!.Ocm;
  //   }

  //   const osmOtau = this.otauConfig!.Osm.find((x) => x.EmulatedOtauId === emulatedOtauId);
  //   if (osmOtau) {
  //     return osmOtau;
  //   }

  //   const oxcOtau = this.otauConfig!.Oxc.find((x) => x.EmulatedOtauId === emulatedOtauId);
  //   if (oxcOtau) {
  //     return oxcOtau;
  //   }

  //   return null;
  // }

  getOtauConfig(): Observable<any> {
    return this.http.get<OtauEmulatorConfig>(this.otauConfigUrl);
  }

  saveOtauConfig() {
    this.loadingSubject.next(true);
    this.errorMessageIdSubject.next(null);

    this.http
      .post(this.otauConfigUrl, this.otauConfig)
      .pipe(
        catchError((error) => {
          this.errorMessageIdSubject.next("Can't save OTAU configuration.");
          return of(error);
        }),
        finalize(() => {
          this.loadingSubject.next(false);
        })
      )
      .subscribe();
  }

  saveOtauPortChangesConfig(config: OtauEmulatorPortChangesMap) {
    this.loadingSubject.next(true);
    this.errorMessageIdSubject.next(null);

    const filteredConfig = this.filterChangesAfterFiberBreakAndSort(config);

    this.http
      .post(this.otauPortChangesConfigUrl, filteredConfig)
      .pipe(
        catchError((error) => {
          this.errorMessageIdSubject.next("Can't save OTAU Port Changes configuration.");
          return of(error);
        }),
        finalize(() => {
          this.loadingSubject.next(false);
        })
      )
      .subscribe();
  }

  filterChangesAfterFiberBreakAndSort(
    config: OtauEmulatorPortChangesMap
  ): OtauEmulatorPortChangesMap {
    const filteredConfig: OtauEmulatorPortChangesMap = {};

    for (const emulatedOtauId in config) {
      filteredConfig[emulatedOtauId] = {};
      for (const portIndex in config[emulatedOtauId]) {
        const portChanges = config[emulatedOtauId][portIndex];
        const fiberBreakChange = portChanges.Changes.find((change) => change.Type === 'FiberBreak');

        if (fiberBreakChange) {
          const filteredChanges = portChanges.Changes.filter(
            (change) => change.DistanceMeters! <= fiberBreakChange.DistanceMeters!
          ).sort((a, b) => a.DistanceMeters! - b.DistanceMeters!);

          filteredConfig[emulatedOtauId][portIndex] = {
            Enabled: portChanges.Enabled,
            Changes: filteredChanges
          };
        } else {
          const sortedChanges = portChanges.Changes.sort(
            (a, b) => a.DistanceMeters! - b.DistanceMeters!
          );

          filteredConfig[emulatedOtauId][portIndex] = {
            Enabled: portChanges.Enabled,
            Changes: sortedChanges
          };
        }
      }
    }

    return filteredConfig;
  }

  initializeSse(): Observable<string> {
    if (!this.eventSource) {
      this.eventSource = new EventSource(this.sseConfigUrl);
      this.eventSource.addEventListener('message', (event) => {
        this.updatesSubject.next(event.data);
      });
      this.eventSource.addEventListener('error', (error) => {
        if (this.eventSource) {
          this.eventSource.close();
        }
        this.eventSource = null;
        this.updatesSubject.error(error);
      });
    }
    return this.updatesSubject.asObservable();
  }

  closeSse() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}
