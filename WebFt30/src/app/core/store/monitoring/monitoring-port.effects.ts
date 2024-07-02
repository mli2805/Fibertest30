import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';

import { MapUtils } from '../../map.utils';
import { CoreService } from '../../grpc/services/core.service';
import { GlobalUiActions } from '../global-ui/global-ui.actions';
import { MonitoringPortActions } from './monitoring-port.actions';
import { MeasurementService } from '../../grpc';
import { OtausActions } from '../otaus/otaus.actions';

@Injectable()
export class MonitoringPortEffects {
  constructor(private actions$: Actions, private measurementService: MeasurementService) {}

  setPortStatus = createEffect(() =>
    this.actions$.pipe(
      ofType(MonitoringPortActions.setPortStatus),
      switchMap(({ monitoringPortId, status }) => {
        return this.measurementService.setPortStatus(monitoringPortId, status).pipe(
          map((response) => {
            return GlobalUiActions.dummyAction();
          }),
          catchError((error) => {
            const errorMessageId = 'i18n.error.cant-set-port-status';
            return of(MonitoringPortActions.setPortStatusFailure({ errorMessageId }));
          })
        );
      })
    )
  );

  setPortStatusSuccess = createEffect(() =>
    this.actions$.pipe(
      ofType(MonitoringPortActions.setPortStatusSuccess),
      mergeMap(({ monitoringPortId }) => {
        return of(MonitoringPortActions.updatePortGetPort({ monitoringPortId }));
      })
    )
  );

  updatePortGetPort = createEffect(() =>
    this.actions$.pipe(
      ofType(MonitoringPortActions.updatePortGetPort),
      switchMap(({ monitoringPortId }) => {
        return this.measurementService.getMonitoringPort(monitoringPortId).pipe(
          map((response) => {
            return MonitoringPortActions.updatePortGetPortSuccess({
              monitoringPort: MapUtils.toMonitoringPort(response.monitoringPort!)
            });
          }),
          catchError((error) => {
            return of(
              MonitoringPortActions.updatePortGetPortFailure({
                errorMessageId: 'i18n.error.cant-refresh-monitoring-port'
              })
            );
          })
        );
      })
    )
  );

  addOtauSuccess = createEffect(() =>
    this.actions$.pipe(
      ofType(OtausActions.addOtauSuccess),
      mergeMap(({ otauId }) => {
        return of(MonitoringPortActions.refreshOtauMonitoringPorts({ otauId }));
      })
    )
  );

  refreshOtauMonitoringPorts = createEffect(() =>
    this.actions$.pipe(
      ofType(MonitoringPortActions.refreshOtauMonitoringPorts),
      switchMap(({ otauId }) => {
        return this.measurementService.getOtauMonitoringPorts(otauId).pipe(
          map((response) => {
            return MonitoringPortActions.refreshOtauMonitoringPortsSuccess({
              monitoringPorts: response.monitoringPorts.map((x) => MapUtils.toMonitoringPort(x))
            });
          }),
          catchError((error) => {
            return of(
              MonitoringPortActions.refreshOtauMonitoringPortsFailure({
                errorMessageId: 'i18n.error.cant-refresh-otau-monitoring-ports'
              })
            );
          })
        );
      })
    )
  );

  setPortSchedule = createEffect(() =>
    this.actions$.pipe(
      ofType(MonitoringPortActions.setPortSchedule),
      switchMap(({ monitoringPortId, schedule }) => {
        const grpcSchedule = MapUtils.toGrpcMonitoringSchedule(schedule);
        return this.measurementService.setPortSchedule(monitoringPortId, grpcSchedule).pipe(
          map((response) => {
            return GlobalUiActions.dummyAction();
          }),
          catchError((error) => {
            // console.log(error);
            const errorMessageId = 'i18n.error.cant-set-port-schedule';
            return of(MonitoringPortActions.setPortStatusFailure({ errorMessageId }));
          })
        );
      })
    )
  );

  setPortScheduleSuccess = createEffect(() =>
    this.actions$.pipe(
      ofType(MonitoringPortActions.setPortScheduleSuccess),
      mergeMap(({ monitoringPortId }) => {
        return of(MonitoringPortActions.updatePortGetPort({ monitoringPortId }));
      })
    )
  );

  setPortAlarmProfile = createEffect(() =>
    this.actions$.pipe(
      ofType(MonitoringPortActions.setPortAlarmProfile),
      switchMap(({ monitoringPortId, alarmProfileId }) => {
        return this.measurementService.setPortAlarmProfile(monitoringPortId, alarmProfileId).pipe(
          map((response) => {
            return GlobalUiActions.dummyAction();
          }),
          catchError((error) => {
            console.log(error);
            const errorMessageId = 'i18n.error.cant-set-port-alarm-profile';
            return of(MonitoringPortActions.setPortAlarmProfileFailure({ errorMessageId }));
          })
        );
      })
    )
  );

  setPortAlarmProfileSuccess = createEffect(() =>
    this.actions$.pipe(
      ofType(MonitoringPortActions.setPortAlarmProfileSuccess),
      mergeMap(({ monitoringPortId }) => {
        return of(MonitoringPortActions.updatePortGetPort({ monitoringPortId }));
      })
    )
  );
}
