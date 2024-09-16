using Iit.Fibertest.Dto;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Fibertest30.Infrastructure;

public class RtuStationsRepository
{
    private readonly ILogger<RtuStationsRepository> _logger;
    private readonly FtDbContext _ftDbContext;

    public RtuStationsRepository(ILogger<RtuStationsRepository> logger, FtDbContext ftDbContext)
    {
        _logger = logger;
        _ftDbContext = ftDbContext;
    }

    public async Task<int> RegisterRtuInitializationResultAsync(RtuStation rtuStation)
    {
        try
        {
            var previousRtuStationRow = await _ftDbContext.rtustations.FirstOrDefaultAsync(r => r.RtuGuid == rtuStation.RtuGuid);
            if (previousRtuStationRow == null)
            {
                _ftDbContext.rtustations.Add(rtuStation);
                _logger.LogInformation( 
                    $"RtuStation {rtuStation.RtuGuid.First6()} successfully registered with main address {rtuStation.MainAddress}.");
            }
            else
            {
                previousRtuStationRow.Version = rtuStation.Version;
                previousRtuStationRow.MainAddress = rtuStation.MainAddress;
                previousRtuStationRow.MainAddressPort = rtuStation.MainAddressPort;
                previousRtuStationRow.IsReserveAddressSet = rtuStation.IsReserveAddressSet;
                previousRtuStationRow.ReserveAddress = rtuStation.ReserveAddress;
                previousRtuStationRow.ReserveAddressPort = rtuStation.ReserveAddressPort;
                _logger.LogInformation( 
                    $"RtuStation {rtuStation.RtuGuid.First6()} successfully updated.");
            }

            return await _ftDbContext.SaveChangesAsync();
        }
        catch (Exception e)
        {
            _logger.LogError("RegisterRtuInitializationResultAsync: " + e.Message);
            return -1;
        }
    }

    public async Task<string?> RemoveRtuAsync(Guid rtuId)
    {
        try
        {
            var rtu = _ftDbContext.rtustations.FirstOrDefault(r => r.RtuGuid == rtuId);
            if (rtu != null)
            {
                _ftDbContext.rtustations.Remove(rtu);
                await _ftDbContext.SaveChangesAsync();
                _logger.LogInformation( "RTU removed.");
                return null;
            }

            var message = $"RTU with id {rtuId.First6()} not found";
            _logger.LogInformation( message);
            return message;
        }
        catch (Exception e)
        {
            _logger.LogError("RemoveRtuAsync: " + e.Message);
            return e.Message;
        }
    }

    public async Task<DoubleAddress?> GetRtuAddresses(Guid rtuId)
    {
        try
        {
            var rtu = await _ftDbContext.rtustations.FirstOrDefaultAsync(r => r.RtuGuid == rtuId);
            if (rtu != null)
                return rtu.GetRtuDoubleAddress();

            _logger.LogInformation( $"RTU with id {rtuId.First6()} not found");
            return null;
        }
        catch (Exception e)
        {
            _logger.LogError("GetRtuAddresses: " + e.Message);
            return null;
        }
    }

    public async Task<int> RegisterRtuHeartbeatAsync(RtuChecksChannelDto dto)
    {
        try
        {
            var rtu = _ftDbContext.rtustations.FirstOrDefault(r => r.RtuGuid == dto.RtuId);
            if (rtu == null)
            {
                _logger.LogInformation( $"Unknown RTU's {dto.RtuId.First6()} heartbeat.");
            }
            else
            {
                if (dto.IsMainChannel)
                    rtu.LastConnectionByMainAddressTimestamp = DateTime.Now;
                else
                    rtu.LastConnectionByReserveAddressTimestamp = DateTime.Now;
                rtu.LastMeasurementTimestamp = dto.LastMeasurementTimestamp; // при следующем опросе RTU потребует результаты новее этого
                rtu.Version = dto.Version;
            }
            return await _ftDbContext.SaveChangesAsync();
        }
        catch (Exception e)
        {
            _logger.LogError("RegisterRtuHeartbeatAsync: " + e.Message);
            return -1;
        }
    }

    public async Task<bool> IsRtuExist(Guid rtuId)
    {
        try
        {
                var rtu = await _ftDbContext.rtustations.FirstOrDefaultAsync(r => r.RtuGuid == rtuId);
                if (rtu != null) return true;
                _logger.LogInformation( $"Unknown RTU {rtuId.First6()}");
                return false;
        }
        catch (Exception e)
        {
            _logger.LogError("IsRtuExist: " + e.Message);
            return false;
        }
    }

    public async Task<List<RtuStation>> GetAllRtuStations()
    {
        try
        {
            return await _ftDbContext.rtustations.ToListAsync();
        }
        catch (Exception e)
        {
            _logger.LogError("GetAllRtuStations: " + e.Message);
            return new List<RtuStation>();
        }
    }

    public async Task<RtuStation?> GetRtuStation(Guid rtuId)
    {
        try
        {
                return await _ftDbContext.rtustations.FirstOrDefaultAsync(r => r.RtuGuid == rtuId);
        }
        catch (Exception e)
        {
            _logger.LogError("GetRtuStation: " + e.Message);
            return null;
        }
    }

    public async Task<int> SaveAvailabilityChanges(List<RtuStation> changedStations)
    {
        try
        {
            foreach (var changedStation in changedStations)
            {
                var rtuStation = _ftDbContext.rtustations.First(r => r.RtuGuid == changedStation.RtuGuid);
                Cop(changedStation, rtuStation);
            }
            return await _ftDbContext.SaveChangesAsync();
        }
        catch (Exception e)
        {
            _logger.LogError("SaveAvailabilityChanges: " + e.Message);
            return -1;
        }
    }

    private void Cop(RtuStation source, RtuStation destination)
    {
        destination.IsMainAddressOkDuePreviousCheck = source.IsMainAddressOkDuePreviousCheck;
        destination.IsReserveAddressOkDuePreviousCheck = source.IsReserveAddressOkDuePreviousCheck;
        destination.IsReserveAddressSet = source.IsReserveAddressSet;
        destination.LastConnectionByMainAddressTimestamp = source.LastConnectionByMainAddressTimestamp;
        destination.LastConnectionByReserveAddressTimestamp = source.LastConnectionByReserveAddressTimestamp;
        destination.MainAddress = source.MainAddress;
        destination.MainAddressPort = source.MainAddressPort;
        destination.ReserveAddress = source.ReserveAddress;
        destination.ReserveAddressPort = source.ReserveAddressPort;
        destination.RtuGuid = source.RtuGuid;
        destination.Version = source.Version;
        destination.LastMeasurementTimestamp = source.LastMeasurementTimestamp;
    }
}