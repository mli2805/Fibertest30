import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { SorTrace } from '@veex/sor';
import { LinkMapBase } from '@veex/link-map';
import {
  EMPTY,
  Observable,
  catchError,
  filter,
  forkJoin,
  map,
  mergeMap,
  of,
  switchMap,
  takeUntil
} from 'rxjs';
import {
  AppState,
  DeviceSelectors,
  OnDemandActions,
  OnDemandSelectors,
  OtdrTaskProgress
} from 'src/app/core';
import { OnDestroyBase } from 'src/app/shared/components/on-destroy-base/on-destroy-base';
import { MeasurementSettignsService } from '../../shared/measurement/components/measurement-settings/measurement-settings.service';
import { MeasurementService, ReportingService } from 'src/app/core/grpc';
import { ConvertUtils } from 'src/app/core/convert.utils';
import { exhaustMapWithTrailing } from 'src/app/core/rxjs.utils';

@Component({
  selector: 'rtu-on-demand',
  templateUrl: 'on-demand.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [':host { overflow-y: auto; display: flex; width: 100%; height: 100%; }'],
  providers: [MeasurementSettignsService]
})
export class OnDemandComponent extends OnDestroyBase {
  fullScreen = false;

  lastProgressSorTrace$: Observable<SorTrace | null>;
  
  completedSorTraceAndLinkmap$: Observable<{sor: SorTrace | null, lmap: LinkMapBase | null} | null>;

  onDemandProgress$ = this.store.select(OnDemandSelectors.selectProgress);
  supportedMeasurementParameters$ = this.store.select(
    DeviceSelectors.selectSupportedMeasurementParameters
  );

  constructor(
    private store: Store<AppState>,
    private cd: ChangeDetectorRef,
    private measurementService: MeasurementService,
    private reportingService: ReportingService,
    private measurementSettingsService: MeasurementSettignsService
  ) {
    super();

    this.supportedMeasurementParameters$
      .pipe(
        takeUntil(this.ngDestroyed$),
        filter((x) => x !== null)
      )
      .subscribe((supportedMeasurementParameters) => {
        this.measurementSettingsService.setSupportedMeasurementParameters(
          supportedMeasurementParameters!
        );
      });

    this.lastProgressSorTrace$ = this.onDemandProgress$.pipe(
      takeUntil(this.ngDestroyed$),
      // exhaustMapWithTrailing to handle the last progress which is completed/cancelled/failed
      // and set lastProgressSorTrace$ to null
      exhaustMapWithTrailing((progress: OtdrTaskProgress | null) => {
        if (progress === null || progress.status !== 'running') {
          return of(null);
        }

        return this.measurementService.getOnDemandProgressTrace(progress!.otdrTaskId).pipe(
          filter(({ sor }) => !!sor && sor.length > 0),
          map(({ sor }) => sor),
          catchError(() => {
            // don't care if there is an error getting progress trace
            // just keep showing the previous
            return EMPTY;
          })
        );
      }),
      switchMap((sor: Uint8Array | null) => {
        return ConvertUtils.buildSorTrace(sor);
      })
    );

    this.completedSorTraceAndLinkmap$ = this.onDemandProgress$.pipe(
      takeUntil(this.ngDestroyed$),
      switchMap((progress: OtdrTaskProgress | null) => {
        if (progress === null || progress.status !== 'completed') {
          return of(null);
        }
        return forkJoin({
          sor:  this.reportingService.getOnDemandTrace(progress!.otdrTaskId).pipe(
            mergeMap(async ({ sor }) => ConvertUtils.buildSorTrace(sor)),
            catchError((error) => {
              this.store.dispatch(OnDemandActions.getCompletedOnDemandTrace(error));
              return of(null);
            })
          ),
          lmap:  this.reportingService.getOnDemandLinkmap(progress!.otdrTaskId).pipe(
            mergeMap(async ({ lmap }) => ConvertUtils.buildLinkMap(lmap)),
            catchError((error) => {
              return of(null);
            })
          )
        });
      })
    );

    this.measurementSettingsService.measurementSettings$
      .pipe(
        takeUntil(this.ngDestroyed$),
        filter((x) => x !== null)
      )
      .subscribe((measurementSettings) => {
        this.store.dispatch(
          OnDemandActions.setMeasurementSettings({ measurementSettings: measurementSettings! })
        );
      });
  }

  onFullScreenChanged(value: boolean) {
    this.fullScreen = value;
  }
}
