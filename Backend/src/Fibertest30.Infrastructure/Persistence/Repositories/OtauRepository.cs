using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using System.Diagnostics;

namespace Fibertest30.Infrastructure;

public class OtauRepository : IOtauRepository
{
    private readonly RtuContext _rtuContext;
    private readonly IMemoryCache _cache;

    public OtauRepository(RtuContext rtuContext, IMemoryCache cache)
    {
        _rtuContext = rtuContext;
        _cache = cache;
    }
    public async Task<Otaus> ReadOtaus(CancellationToken ct)
    {
        var otaus = await GetAllOtau(ct);
        return new Otaus() { 
            OcmOtau = otaus.SingleOrDefault(x => x.Type == OtauType.Ocm),
            OsmOtaus = otaus.Where(x => x.Type == OtauType.Osm).ToList(), 
            OxcOtaus = otaus.Where(x => x.Type == OtauType.Oxc).ToList(), 
        };
    }

    public async Task<List<Otau>> GetAllOtau(CancellationToken ct)
    {
        var otausEf = await _rtuContext.Otaus
            .Include(x => x.Ports)
            .ToListAsync(ct);
        var otaus = otausEf.Select(x => x.FromEf()).ToList();
        return otaus;
    }

    public async Task<Otau> GetOtau(int otauId, CancellationToken ct)
    {
        var otauEf = await _rtuContext.Otaus
            .Include(x=>x.Ports)
            .SingleAsync(x => x.Id == otauId, cancellationToken: ct);
        return otauEf.FromEf();
    }

    public async Task<int> AddOtau(OtauType type, int ocmPortIndex
        ,  string serialNumber, int portCount, IOtauParameters otauParameters)
    {
        Debug.Assert(otauParameters != null && (
            type == OtauType.Ocm && otauParameters is OcmOtauParameters ||
            type == OtauType.Osm && otauParameters is OsmOtauParameters ||
            type == OtauType.Oxc && otauParameters is OxcOtauParameters
        ));
        
        await using var transaction = await _rtuContext.Database.BeginTransactionAsync();

        try
        {
            if (type != OtauType.Ocm)
            {
                var ocmPort = await _rtuContext.OtauPorts
                        .Include(x => x.MonitoringPort)
                        .SingleOrDefaultAsync(x => x.OtauId == OtauService.OcmOtauId && x.PortIndex == ocmPortIndex);

                if (ocmPort == null)
                {
                    throw new Exception($"Can't add {type} OTAU. There is no OCM OTAU with portIndex {ocmPortIndex}");
                }
                
                if (ocmPort.MonitoringPort.Status != MonitoringPortStatus.Off)
                {
                    throw new Exception($"Can't add {type} OTAU to ocmPortIndex {ocmPortIndex}, because port is under monitoring");
                }
            }
            
            var otauEf = new OtauEf()
            {
                Type = type,
                SerialNumber = serialNumber, 
                OcmPortIndex = ocmPortIndex, 
                PortCount = portCount,
                JsonData = otauParameters.ToJsonData()
            };

            
            // let's OCM otau always have ID = OtauService.OcmOtauId
            // for quick OCM otau querying
            if (type == OtauType.Ocm)
            {
                otauEf.Id = OtauService.OcmOtauId;
            }
            
            _rtuContext.Otaus.Add(otauEf);
            await _rtuContext.SaveChangesAsync();

            await AddPortsAndSaveChanges(otauEf, 1, otauEf.PortCount);
        
            await transaction.CommitAsync();
            return otauEf.Id;
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    private async Task AddPortsAndSaveChanges(OtauEf otau, int firstIndex, int portCount)
    {
        var otauPorts = new List<OtauPortEf>();
        var monitoringPorts = new List<MonitoringPortEf>();
        foreach (var portIndex in Enumerable.Range(firstIndex, portCount))
        {
            var monitoringPort = new MonitoringPortEf()
            {
                SchedulerMode = MonitoringSchedulerMode.RoundRobin,
                Status = MonitoringPortStatus.Off,
                AlarmProfileId = 1
            };
            
            monitoringPorts.Add(monitoringPort);
            
            var otauPortEf = new OtauPortEf()
            {
                Otau = otau,
                PortIndex = portIndex,
                MonitoringPort = monitoringPort
            };
            
            otauPorts.Add(otauPortEf);
        }

        _rtuContext.OtauPorts.AddRange(otauPorts);
        _rtuContext.MonitoringPorts.AddRange(monitoringPorts);
        await _rtuContext.SaveChangesAsync();
        
        // as we added MonitoringPorts, let's reset the cache
        _cache.Remove(MonitoringPortRepository.GetAllMonitoringPortsKey);
    }

    public async Task ChangeOtau(Otau currentOtau, string discoverSerialNumber, int discoverPortCount, CancellationToken ct)
    {
        await using var transaction = await _rtuContext.Database.BeginTransactionAsync(ct);

        try
        {
            var otauEf = _rtuContext.Otaus.Include(x => x.Ports).Single(x => x.Id == currentOtau.Id);
            otauEf.SerialNumber = discoverSerialNumber; 
            otauEf.PortCount = discoverPortCount;
        
            if (discoverPortCount > currentOtau.PortCount)
            {
                var portCountIncludingUnavailablePorts = otauEf.Ports.Count();
                if (discoverPortCount > portCountIncludingUnavailablePorts)
                {
                    // let's add new ports
                    await AddPortsAndSaveChanges(otauEf, portCountIncludingUnavailablePorts + 1, discoverPortCount - portCountIncludingUnavailablePorts);
                }
                
                var availablePorts = await _rtuContext.OtauPorts
                    .Where(x => x.OtauId == currentOtau.Id && x.PortIndex <= discoverPortCount)
                    .ToListAsync(ct);
                
                availablePorts.ForEach(x => x.Unavailable = false);
                

            } 
            else if (discoverPortCount < currentOtau.PortCount)
            {
                var unavailablePorts = await _rtuContext.OtauPorts
                    .Where(x => x.OtauId == currentOtau.Id && x.PortIndex > discoverPortCount)
                    .ToListAsync(ct);
                
                unavailablePorts.ForEach(x => x.Unavailable = true);
            }
            
            await _rtuContext.SaveChangesAsync(ct);
            await transaction.CommitAsync(ct);
        }
        catch (Exception)
        {
            await transaction.RollbackAsync(ct);
            throw;
        }
    }

    public async Task<List<ChangedProperty>> UpdateOtau(int otauId, OtauPatch patch, CancellationToken ct)
    {
        var otauEf = await _rtuContext.Otaus.SingleAsync(x => x.Id == otauId, ct);

        var changedProperties = new List<ChangedProperty>();

        if (patch.Name != null)
        {
            changedProperties.Add(new ChangedProperty("Name", otauEf.Name, patch.Name));
            otauEf.Name = patch.Name;
        }

        if (patch.Location != null)
        {
            changedProperties.Add(new ChangedProperty("Location", otauEf.Location, patch.Location));
            otauEf.Location = patch.Location;
        }

        if (patch.Rack != null)
        {
            changedProperties.Add(new ChangedProperty("Rack", otauEf.Rack, patch.Rack));
            otauEf.Rack = patch.Rack;
        }

        if (patch.Shelf != null)
        {
            changedProperties.Add(new ChangedProperty("Shelf", otauEf.Shelf, patch.Shelf));
            otauEf.Shelf = patch.Shelf;
        }

        if (patch.Note != null)
        {
            changedProperties.Add(new ChangedProperty("Note", otauEf.Note, patch.Note));
            otauEf.Note = patch.Note;
        }

        await _rtuContext.SaveChangesAsync(ct);
        return changedProperties;
    }


    public async Task UpdateOtauOnlineAtOfflineAt
        (int otauId, DateTime? onlineAt, DateTime? offlineAt, CancellationToken ct)
    {
        var otau = _rtuContext.Otaus.SingleOrDefault(x => x.Id == otauId);
        if (otau == null) { return; }

        otau.OnlineAt = onlineAt;
        otau.OfflineAt = offlineAt;
        await _rtuContext.SaveChangesAsync(ct);
    }

    public async Task RemoveOtau(int otauId, CancellationToken ct)
    {
        // MonitoringPortEf is a primary entity in
        // the relationship between OtauEf and MonitoringPortEf
        // so it should be deleted manually (no cascading)
        
        var otau = _rtuContext.Otaus
            .Include(x => x.Ports)
            .FirstOrDefault(x => x.Id == otauId); 

        if (otau != null)
        {
            foreach (var otauPort in otau.Ports)
            {
                // otau port removed before, because of Restrict mode in cascading
                _rtuContext.OtauPorts.Remove(otauPort);
                var monitoringPort = 
                    _rtuContext.MonitoringPorts.Local.FirstOrDefault(e => e.Id == otauPort.MonitoringPortId)
                           ?? new MonitoringPortEf { Id = otauPort.MonitoringPortId }; // don't need to Attach
                _rtuContext.MonitoringPorts.Remove(monitoringPort);
            }

            _rtuContext.Otaus.Remove(otau);
            await _rtuContext.SaveChangesAsync(ct);
            
            // as we removed MonitoringPorts, let's reset the cache
            _cache.Remove(MonitoringPortRepository.GetAllMonitoringPortsKey);
        }
    }

    public Task<string> GetPortNameByMonitoringPortId(int monitoringPortId, CancellationToken ct)
    {
        var otauPort = _rtuContext.OtauPorts.Single(p=>p.MonitoringPortId == monitoringPortId);
        var otau = _rtuContext.Otaus.Single(o => o.Id == otauPort.OtauId);

        var result = otau.OcmPortIndex != 0 ? $"{otau.OcmPortIndex}-" : "";
        result += otauPort.PortIndex;

        return Task.FromResult(result);
    }
}