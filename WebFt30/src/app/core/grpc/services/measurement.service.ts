import { Injectable, inject } from '@angular/core';
import { Observable, switchMap, throwError, timer } from 'rxjs';
import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';

import { AuthInterceptor } from '../auth.interceptor';
import { GrpcUtils } from '../grpc.utils';
import * as grpc from 'src/grpc-generated';
import { MeasurementSettings, OtauPortPath } from '../../store/models';
import { DefaultParameters } from 'src/app/shared/utils/default-parameters';
import { MapUtils } from '../../map.utils';
import { AlarmProfile } from '../../store/models/alarm-profile';

@Injectable({
  providedIn: 'root'
})
export class MeasurementService {
  private authInterceptor = inject(AuthInterceptor);
  private client: grpc.MeasurementClient;

  constructor() {
    const interceptors = [this.authInterceptor.toRpcInterceptor()];
    const options = GrpcUtils.getGrpcOptions(GrpcUtils.getApiUrl(), interceptors);
    const transport = new GrpcWebFetchTransport(options);
    this.client = new grpc.MeasurementClient(transport);
  }

  startOnDemand(
    monitoringPortId: number,
    measurementSettings: MeasurementSettings
  ): Observable<grpc.StartOnDemandResponse> {
    const gprcMeasurementSettings = MapUtils.toGrpcMeasurementSettings(measurementSettings);
    const request: grpc.StartOnDemandRequest = {
      monitoringPortId,
      measurementSettings: gprcMeasurementSettings
    };
    return GrpcUtils.unaryToObservable(this.client.startOnDemand.bind(this.client), request, {});
  }

  stopOnDemand(onDemandId: string): Observable<grpc.StopOnDemandResponse> {
    const request: grpc.StopOnDemandRequest = { onDemandId };
    return GrpcUtils.unaryToObservable(this.client.stopOnDemand.bind(this.client), request, {});
  }

  getOnDemandProgressTrace(onDemandId: string): Observable<grpc.GetOnDemandProgressTraceResponse> {
    const request: grpc.GetOnDemandProgressTraceRequest = { onDemandId };
    return GrpcUtils.unaryToObservable(
      this.client.getOnDemandProgressTrace.bind(this.client),
      request,
      {}
    );
  }

  setPortStatus(
    monitoringPortId: number,
    status: grpc.MonitoringPortStatus
  ): Observable<grpc.SetMonitoringPortStatusResponse> {
    // return timer(1000).pipe(switchMap(() => throwError(() => new Error('Simulated error'))));

    const request: grpc.SetMonitoringPortStatusRequest = { monitoringPortId, status };
    return GrpcUtils.unaryToObservable(
      this.client.setMonitoringPortStatus.bind(this.client),
      request,
      {}
    );
  }

  setPortAlarmProfile(
    monitoringPortId: number,
    alarmProfileId: number
  ): Observable<grpc.SetPortAlarmProfileResponse> {
    const request: grpc.SetPortAlarmProfileRequest = { monitoringPortId, alarmProfileId };
    return GrpcUtils.unaryToObservable(
      this.client.setPortAlarmProfile.bind(this.client),
      request,
      {}
    );
  }

  setPortNote(
    monitoringPortId: number,
    note: string
  ): Observable<grpc.SetMonitoringPortNoteResponse> {
    const request: grpc.SetMonitoringPortNoteRequest = { monitoringPortId, note };
    return GrpcUtils.unaryToObservable(
      this.client.setMonitoringPortNote.bind(this.client),
      request,
      {}
    );
  }

  setPortSchedule(
    monitoringPortId: number,
    schedule: grpc.MonitoringSchedule
  ): Observable<grpc.SetMonitoringPortScheduleResponse> {
    const request: grpc.SetMonitoringPortScheduleRequest = { monitoringPortId, schedule };
    return GrpcUtils.unaryToObservable(
      this.client.setMonitoringPortSchedule.bind(this.client),
      request,
      {}
    );
  }

  getMonitoringPort(monitoringPortId: number): Observable<grpc.GetMonitoringPortResponse> {
    const request: grpc.GetMonitoringPortRequest = { monitoringPortId };
    return GrpcUtils.unaryToObservable(
      this.client.getMonitoringPort.bind(this.client),
      request,
      {}
    );
  }

  getOtauMonitoringPorts(otauId: number): Observable<grpc.GetOtauMonitoringPortsResponse> {
    const request: grpc.GetOtauMonitoringPortsRequest = { otauId };
    return GrpcUtils.unaryToObservable(
      this.client.getOtauMonitoringPorts.bind(this.client),
      request,
      {}
    );
  }

  startBaselineSetup(
    monitoringPortId: number,
    fullAutoMode: boolean,
    measurementSettings: MeasurementSettings | null
  ): Observable<grpc.StartBaselineSetupResponse> {
    const gprcMeasurementSettings =
      measurementSettings != null ? MapUtils.toGrpcMeasurementSettings(measurementSettings) : null;
    const request: grpc.StartBaselineSetupRequest = {
      monitoringPortId,
      fullAutoMode: fullAutoMode,
      measurementSettings: gprcMeasurementSettings ?? undefined
    };
    return GrpcUtils.unaryToObservable(
      this.client.startBaselineSetup.bind(this.client),
      request,
      {}
    );
  }

  stopBaselineSetup(monitoringPortId: number): Observable<grpc.StopBaselineSetupResponse> {
    const request: grpc.StopBaselineSetupRequest = { monitoringPortId };
    return GrpcUtils.unaryToObservable(
      this.client.stopBaselineSetup.bind(this.client),
      request,
      {}
    );
  }

  getBaselineProgressTrace(taskId: string): Observable<grpc.GetBaselineProgressTraceResponse> {
    const request: grpc.GetBaselineProgressTraceRequest = { taskId };
    return GrpcUtils.unaryToObservable(
      this.client.getBaselineProgressTrace.bind(this.client),
      request,
      {}
    );
  }

  getAllAlarmProfiles(): Observable<grpc.GetAllAlarmProfilesResponse> {
    const request: grpc.GetAllAlarmProfilesRequest = {};
    return GrpcUtils.unaryToObservable(
      this.client.getAllAlarmProfiles.bind(this.client),
      request,
      {}
    );
  }

  updateAlarmProfile(
    grpcAlarmProfile: grpc.AlarmProfile
  ): Observable<grpc.UpdateAlarmProfileResponse> {
    const request: grpc.UpdateAlarmProfileRequest = {
      alarmProfile: grpcAlarmProfile
    };

    return GrpcUtils.unaryToObservable(
      this.client.updateAlarmProfile.bind(this.client),
      request,
      {}
    );
  }

  getAlarmProfile(alarmProfileId: number): Observable<grpc.GetAlarmProfileResponse> {
    const request: grpc.GetAlarmProfileRequest = { id: alarmProfileId };
    return GrpcUtils.unaryToObservable(this.client.getAlarmProfile.bind(this.client), request, {});
  }

  createAlarmProfile(
    grpcAlarmProfile: grpc.AlarmProfile
  ): Observable<grpc.CreateAlarmProfileResponse> {
    const request: grpc.CreateAlarmProfileRequest = { alarmProfile: grpcAlarmProfile };

    return GrpcUtils.unaryToObservable(
      this.client.createAlarmProfile.bind(this.client),
      request,
      {}
    );
  }

  deleteAlarmProfile(alarmProfileId: number): Observable<grpc.DeleteAlarmProfileResponse> {
    const request: grpc.DeleteAlarmProfileRequest = { alarmProfileId };
    return GrpcUtils.unaryToObservable(
      this.client.deleteAlarmProfile.bind(this.client),
      request,
      {}
    );
  }

  updateNotificationSettings(
    grpcNotificationSettings: grpc.NotificationSettings
  ): Observable<grpc.UpdateNotificationSettingsResponse> {
    const request: grpc.UpdateNotificationSettingsRequest = {
      notificationSettings: grpcNotificationSettings
    };

    return GrpcUtils.unaryToObservable(
      this.client.updateNotificationSettings.bind(this.client),
      request,
      {}
    );
  }

  refreshNotificationSettings(): Observable<grpc.GetNotificationSettingsResponse> {
    const request: grpc.GetNotificationSettingsRequest = {};
    return GrpcUtils.unaryToObservable(
      this.client.getNotificationSettings.bind(this.client),
      request,
      {}
    );
  }

  testEmailServerSettings(
    grpcEmailServer: grpc.EmailServer
  ): Observable<grpc.TestEmailServerSettingsResponse> {
    const request: grpc.TestEmailServerSettingsRequest = { emailServer: grpcEmailServer };

    return GrpcUtils.unaryToObservable(
      this.client.testEmailServerSettings.bind(this.client),
      request,
      {}
    );
  }

  testTrapReceiverSettins(
    grpcTrapReceiver: grpc.TrapReceiver
  ): Observable<grpc.TestTrapReceiverSettingsResponse> {
    const request: grpc.TestTrapReceiverSettingsRequest = { trapReceiver: grpcTrapReceiver };

    return GrpcUtils.unaryToObservable(
      this.client.testTrapReceiverSettings.bind(this.client),
      request,
      {}
    );
  }

  refreshNetworkSettings(): Observable<grpc.GetNetworkSettingsResponse> {
    const request: grpc.GetNetworkSettingsRequest = {};
    return GrpcUtils.unaryToObservable(
      this.client.getNetworkSettings.bind(this.client),
      request,
      {}
    );
  }

  updateNetworkSettings(
    grpcNetworkSettins: grpc.NetworkSettings
  ): Observable<grpc.UpdateNetworkSettingsResponse> {
    const request: grpc.UpdateNetworkSettingsRequest = {
      networkSettings: grpcNetworkSettins
    };

    return GrpcUtils.unaryToObservable(
      this.client.updateNetworkSettings.bind(this.client),
      request,
      {}
    );
  }

  refreshTimeSettings(): Observable<grpc.GetTimeSettingsResponse> {
    const request: grpc.GetTimeSettingsRequest = {};
    return GrpcUtils.unaryToObservable(this.client.getTimeSettings.bind(this.client), request, {});
  }

  updateTimeSettings(
    grpcTimeSettins: grpc.TimeSettings
  ): Observable<grpc.UpdateTimeSettingsResponse> {
    const request: grpc.UpdateTimeSettingsRequest = {
      timeSettings: grpcTimeSettins
    };

    return GrpcUtils.unaryToObservable(
      this.client.updateTimeSettings.bind(this.client),
      request,
      {}
    );
  }

  // startBaselineManualSetup(
  //   monitoringPortId: number,
  //   measurementSettings: MeasurementSettings
  // ): Observable<grpc.StartBaselineManualSetupResponse> {
  //   const gprcMeasurementSettings = MapUtils.toGrpcMeasurementSettings(measurementSettings);
  //   const request: grpc.StartBaselineManualSetupRequest = {
  //     monitoringPortId,
  //     measurementSettings: gprcMeasurementSettings
  //   };
  //   return GrpcUtils.unaryToObservable(
  //     this.client.startBaselineManualSetup.bind(this.client),
  //     request,
  //     {}
  //   );
  // }

  // stopBaselineManualSetup(
  //   monitoringPortId: number
  // ): Observable<grpc.StopBaselineManualSetupResponse> {
  //   const request: grpc.StopBaselineManualSetupRequest = { monitoringPortId };
  //   return GrpcUtils.unaryToObservable(
  //     this.client.stopBaselineManualSetup.bind(this.client),
  //     request,
  //     {}
  //   );
  // }
}
