﻿using Iit.Fibertest.Dto;

namespace Fibertest30.Application;
public interface IRtuManager
{
    Task<RtuConnectionCheckedDto> CheckRtuConnection(NetAddress netAddress, CancellationToken cancellationToken);
    Task<RtuInitializedDto> InitializeRtuAsync(InitializeRtuDto dto);
    Task<RequestAnswer> StartClientMeasurement(DoClientMeasurementDto dto);
    Task<RequestAnswer> StartPreciseMeasurementOutOfTurn(DoOutOfTurnPreciseMeasurementDto dto);

    Task<RequestAnswer> ApplyMonitoringSettings(ApplyMonitoringSettingsDto dto);
    Task<BaseRefAssignedDto> TransmitBaseRefs(AssignBaseRefsDto dto);
    Task<BaseRefAssignedDto> AssignBaseRefs(AssignBaseRefsDto dto);
    Task<RequestAnswer> StopMonitoring(Guid rtuId);
    Task<RequestAnswer> InterruptMesasurement(InterruptMeasurementDto dto);


    Task<RequestAnswer> AttachTrace(AttachTraceDto dto);
    Task<RequestAnswer> DetachTrace(Guid traceId);
    Task<OtauAttachedDto> AttachOtau(AttachOtauDto dto);
    Task<OtauDetachedDto> DetachOtau(DetachOtauDto dto);

}
