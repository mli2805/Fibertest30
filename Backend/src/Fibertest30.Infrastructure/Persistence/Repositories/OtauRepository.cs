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

 
   

  
    public Task<string> GetPortNameByMonitoringPortId(int monitoringPortId, CancellationToken ct)
    {
        var otauPort = _rtuContext.OtauPorts.Single(p=>p.MonitoringPortId == monitoringPortId);
        var otau = _rtuContext.Otaus.Single(o => o.Id == otauPort.OtauId);

        var result = otau.OcmPortIndex != 0 ? $"{otau.OcmPortIndex}-" : "";
        result += otauPort.PortIndex;

        return Task.FromResult(result);
    }
}