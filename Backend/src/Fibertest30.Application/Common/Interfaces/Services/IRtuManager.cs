using Iit.Fibertest.Dto;

namespace Fibertest30.Application;
public interface IRtuManager
{
    Task<RtuConnectionCheckedDto> CheckRtuConnection(NetAddress netAddress, CancellationToken cancellationToken);
    Task<RtuInitializedDto> InitializeRtuAsync(InitializeRtuDto dto);
    Task<ClientMeasurementStartedDto> StartClientMeasurement(DoClientMeasurementDto dto);

    Task<RequestAnswer> StopMonitoring(Guid rtuId);

}
