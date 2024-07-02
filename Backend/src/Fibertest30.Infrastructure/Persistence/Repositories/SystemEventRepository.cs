using Microsoft.EntityFrameworkCore;
using System.Diagnostics;

namespace Fibertest30.Infrastructure;

public class SystemEventRepository : ISystemEventRepository
{
    private readonly RtuContext _rtuContext;
    private readonly IDateTime _dateTime;

    public SystemEventRepository(RtuContext rtuContext, IDateTime dateTime)
    {
        _rtuContext = rtuContext;
        _dateTime = dateTime;
    }
    
    public async Task<int> Add(SystemEvent systemEvent, CancellationToken ct)
    {
        // Experimental feature: merge system events
        var mergedSystemEvent = await TryMergeSystemEvent(systemEvent, ct);
        if (mergedSystemEvent != null)
        {
            return mergedSystemEvent.Id;
        }
        
        var systemEventEf = systemEvent.ToEf();
        _rtuContext.SystemEvents.Add(systemEventEf);
        await _rtuContext.SaveChangesAsync(ct);
        return systemEventEf.Id;
    }

    public async Task<List<SystemEvent>> GetAll(bool sortDescending, CancellationToken ct)
    {
        IQueryable<SystemEventEf> query = _rtuContext.SystemEvents;
        if (sortDescending)
        {
            query = query.OrderByDescending(x => x.Id);
        }
        
        var systemEvents = await query.ToListAsync(ct);
        return systemEvents.Select(x => x.FromEf()).ToList();
    }
    
    private async Task<SystemEventEf?> TryMergeSystemEvent
        (SystemEvent systemEvent, CancellationToken ct)
    {
        if (systemEvent.Type == SystemEventType.OtauInformationChanged)
        {
            var (mergeCandidate, currentData, newData) 
                = await GetMergeCandidateAndEventData<OtauInformationChangedData>(systemEvent, ct);
        
            if (mergeCandidate == null || currentData == null || newData == null
                || (currentData.OtauId != newData.OtauId))
            {
                return null;
            }
            return await MergeOtauInformationChangedEvents(mergeCandidate, currentData, newData, ct);
        }

        return null;
    }
    
    private async Task<(SystemEventEf? mergeCandidate, T? currentData, T? newData)> 
        GetMergeCandidateAndEventData<T>(SystemEvent systemEvent, CancellationToken ct)
        where T : ISystemEventData {
        
        var mergeCandidate = await GetMergeCandidate(systemEvent.Type, systemEvent.Source.UserId ?? string.Empty, ct);
        if (mergeCandidate == null) { return (null, default(T), default(T)); }
        
        T currentEventData =
            (T)SystemEventDataFactory
                .Create(systemEvent.Type, mergeCandidate.JsonData)!;

        T newEventData = (T)systemEvent.Data!;

        return (mergeCandidate, currentEventData, newEventData);
    }

    private async Task<SystemEventEf?> MergeOtauInformationChangedEvents(
            SystemEventEf mergeCandidate, 
            OtauInformationChangedData currentData,
            OtauInformationChangedData newData, 
            CancellationToken ct)
    {
        Debug.Assert(currentData.OtauId == newData.OtauId);
        
        var mergedChangedProperties = MergeChangedProperties(currentData.ChangedProperties, newData.ChangedProperties);
        currentData.ChangedProperties = mergedChangedProperties;
        
        mergeCandidate.At = _dateTime.UtcNow;
        mergeCandidate.JsonData = currentData.ToJsonData();
        await _rtuContext.SaveChangesAsync(ct);
        return mergeCandidate;
    }

    private async Task<SystemEventEf?> GetMergeCandidate(SystemEventType type, string userId, CancellationToken ct)
    {
        var mergeWindow = _dateTime.UtcNow.AddMinutes(-3);
        
        var mergeCandidate = await _rtuContext.SystemEvents
            .Where(e => e.Type == type && e.UserId == userId && e.At >= mergeWindow)
            .OrderByDescending(x => x.Id)
            .FirstOrDefaultAsync(ct);
        return mergeCandidate;
    }
    
    private List<ChangedProperty> MergeChangedProperties(List<ChangedProperty> currentProperties, List<ChangedProperty> newProperties)
    {
        Dictionary<string, ChangedProperty> mergedMap = new();
        foreach (var prop in currentProperties)
        {
            mergedMap[prop.PropertyName] = prop;
        }
        foreach (var prop in newProperties)
        {
            mergedMap[prop.PropertyName] = prop;
        }
        return mergedMap.Values.ToList();
    }
}