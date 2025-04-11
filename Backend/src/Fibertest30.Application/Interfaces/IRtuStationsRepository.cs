using Iit.Fibertest.Dto;

namespace Fibertest30.Application;

public interface IRtuStationsRepository
{
    Task<int> RegisterRtuInitializationResultAsync(RtuStation rtuStation);
    Task<string?> RemoveRtuAsync(Guid rtuId);
    Task<DoubleAddress?> GetRtuAddresses(Guid rtuId);
    Task<int> RegisterRtuHeartbeatAsync(RtuChecksChannelDto dto);
    Task<int> Update(UpdateRtuStationDto dto);
    Task<bool> IsRtuExist(Guid rtuId);
    Task<List<RtuStation>> GetAllRtuStations();
    Task<RtuStation?> GetRtuStation(Guid rtuId);
    Task<int> SaveAvailabilityChanges(List<RtuStation> changedStations);
}