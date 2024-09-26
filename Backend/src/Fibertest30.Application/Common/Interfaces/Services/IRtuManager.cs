using Iit.Fibertest.Dto;

namespace Fibertest30.Application;
public interface IRtuManager
{
    Task<RtuConnectionCheckedDto> CheckRtuConnection(NetAddress netAddress, CancellationToken cancellationToken);
    Task<RtuInitializedDto> InitializeRtuAsync(InitializeRtuDto dto);
    Task<RequestAnswer> StartClientMeasurement(DoClientMeasurementDto dto);

    Task<RequestAnswer> ApplyMonitoringSettings(ApplyMonitoringSettingsDto dto);
    Task<RequestAnswer> StopMonitoring(Guid rtuId);

}
