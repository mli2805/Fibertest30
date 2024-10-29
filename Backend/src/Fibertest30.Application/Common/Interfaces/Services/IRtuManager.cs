using Iit.Fibertest.Dto;

namespace Fibertest30.Application;
public interface IRtuManager
{
    Task<RtuConnectionCheckedDto> CheckRtuConnection(NetAddress netAddress, CancellationToken cancellationToken);
    Task<RtuInitializedDto> InitializeRtuAsync(InitializeRtuDto dto);
    Task<RequestAnswer> StartClientMeasurement(DoClientMeasurementDto dto);

    Task<RequestAnswer> ApplyMonitoringSettings(ApplyMonitoringSettingsDto dto);
    Task<BaseRefAssignedDto> AssignBaseRefs(AssignBaseRefsDto dto);
    Task<RequestAnswer> StopMonitoring(Guid rtuId);

    Task<RequestAnswer> AttachTrace(AttachTraceDto dto, string username);
    Task<RequestAnswer> DetachTrace(Guid traceId, string username);
}
