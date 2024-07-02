using Microsoft.EntityFrameworkCore;

namespace Fibertest30.Infrastructure;

public class PortLabelRepository : IPortLabelRepository
{
    private readonly RtuContext _rtuContext;

    public PortLabelRepository(RtuContext rtuContext)
    {
        _rtuContext = rtuContext;
    }
    
    public Task<List<PortLabel>> GetAll(CancellationToken ct)
    {
        var query = _rtuContext.PortLabels.AsNoTracking()
            .Select(p => new PortLabel
            {
                Id = p.Id,
                Name = p.Name,
                HexColor = p.HexColor,
                MonitoringPortIds = p.PortLabelMonitoringPorts.Select(mp => mp.MonitoringPortId).ToList()
            });
        
        return query.ToListAsync(ct);
    }
    
    public Task<PortLabel> Get(int portLabelId, CancellationToken ct)
    {
        var query = _rtuContext.PortLabels.AsNoTracking()
            .Where(p => p.Id == portLabelId)
            .Select(p => new PortLabel
            {
                Id = p.Id,
                Name = p.Name,
                HexColor = p.HexColor,
                MonitoringPortIds = p.PortLabelMonitoringPorts.Select(mp => mp.MonitoringPortId).ToList()
            });
        
        return query.SingleAsync(ct);
    }
    
    private IQueryable<PortLabel> SelectPortLabels(IQueryable<PortLabelEf> query)
    {
        return query.Select(p => new PortLabel
        {
            Id = p.Id,
            Name = p.Name,
            HexColor = p.HexColor,
            MonitoringPortIds = p.PortLabelMonitoringPorts.Select(mp => mp.MonitoringPortId).ToList()
        });
    }

    public async Task<int> AddAndAttachPortLabel(string name, string hexColor, int monitoringPortId, CancellationToken ct)
    {
        var exists = await _rtuContext.PortLabels.AnyAsync(x => x.Name == name, ct);
        if (exists)
        {
            throw new ArgumentException($"Port label with name {name} already exists");
        }

        var portLabelEf = new PortLabelEf
        {
            Name = name,
            HexColor = hexColor,
            PortLabelMonitoringPorts = new List<PortLabelMonitoringPortEf>
            {
                new PortLabelMonitoringPortEf { MonitoringPortId = monitoringPortId }
            }
        };
        
        _rtuContext.PortLabels.Add(portLabelEf);
        await _rtuContext.SaveChangesAsync(ct);
        return portLabelEf.Id;
    }

    public async Task UpdatePortLabel(int portLabelId, string name, string hexColor, CancellationToken ct)
    {
        var result = await _rtuContext.PortLabels
            .Where(p => p.Id == portLabelId)
            .ExecuteUpdateAsync(
                 p => p.SetProperty(x => x.Name, name)
                .SetProperty(x => x.HexColor, hexColor),
                 ct);

        if (result == 0)
        {
            throw new ArgumentException($"Can't update port label. portLabelId: {portLabelId}");
        }
    }

    public async Task AttachPortLabel(int portLabelId, int monitoringPortId, CancellationToken ct)
    {
        _rtuContext.PortLabelMonitoringPorts.Add(new PortLabelMonitoringPortEf
        {
            PortLabelId = portLabelId,
            MonitoringPortId = monitoringPortId
        });

        await _rtuContext.SaveChangesAsync(ct);
    }

    public async Task DetachPortLabelAndRemoveIfLast(int portLabelId, int monitoringPortId, CancellationToken ct)
    {
        await using var transaction = await _rtuContext.Database.BeginTransactionAsync(ct);
        try
        {
            var deleted = await _rtuContext.PortLabelMonitoringPorts
                .Where(x => x.PortLabelId == portLabelId && x.MonitoringPortId == monitoringPortId)
                .ExecuteDeleteAsync(ct);
            
            if (deleted == 0)
            {
                throw new ArgumentException($"Can't remove port label. portLabelId: {portLabelId}, monitoringPortId: {monitoringPortId}");
            }
            
            // remove port label if it has no monitoring ports
            await _rtuContext.PortLabels
                .Where(x => x.Id == portLabelId && x.PortLabelMonitoringPorts.Count == 0)
                .ExecuteDeleteAsync(ct);
            
            await transaction.CommitAsync(ct);
        }
        catch (Exception)
        {
            await transaction.RollbackAsync(ct);
            throw;
        }
    }
}