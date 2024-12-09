using Iit.Fibertest.Dto;
using Iit.Fibertest.Graph;
using System.Diagnostics;

namespace Fibertest30.Application;

public class TableProvider
{
    // в случаем изменения - исправить константу в EventTablesService на web стороне
    private readonly int _pageSize = 150;
    private readonly Model _writeModel;

    public TableProvider(Model writeModel)
    {
        _writeModel = writeModel;
    }

    public HasCurrentEvents GetHasCurrentEvents(Guid userId)
    {
        var hasCurrentEvents = new HasCurrentEvents();

        if (_writeModel.ActiveMeasurements.Any())
            hasCurrentEvents.HasCurrentOpticalEvents = true;

        if (_writeModel.Rtus.Any(r => !r.IsAllRight))
            hasCurrentEvents.HasCurrentNetworkEvents = true;

        if (_writeModel.BopNetworkEvents
            .OrderByDescending(e => e.EventTimestamp)
            .GroupBy(b => b.Serial)
            .Select(g => g.First()).Any(l => !l.IsOk))
            hasCurrentEvents.HasCurrentBopNetworkEvents = true;

        if (GetCurrentStateAccidents().Any())
            hasCurrentEvents.HasCurrentRtuAccidents = true;

        return hasCurrentEvents;
    }

    public OpticalEventDto GetOpticalEvent(int eventId)
    {
        var measurement = _writeModel.Measurements.Single(m => m.SorFileId == eventId);
        return measurement.CreateOpticalEventDto(_writeModel);
    }

    public List<OpticalEventDto> GetOpticalEvents(Guid userId, bool current, DateTimeFilter dateTimeFilter)
    {
        // var user = _writeModel.Users.First(u => u.UserId == userId);
        // в модели другие юзеры , не те что в sqlite базе бэкенда
        //TODO переделать
        var user = _writeModel.Users.First(u => u.Role == Role.Root);

        var collection = current ? _writeModel.ActiveMeasurements : _writeModel.Measurements;
        var filtered = collection
            .Where(o => o.Filter("", "", _writeModel, user));


        var since = dateTimeFilter.LoadSince != null
            ? dateTimeFilter.OrderDescending
                ? filtered.Where(e => e.MeasurementTimestamp < dateTimeFilter.LoadSince.Value.AddMilliseconds(-100))
                : filtered.Where(e => e.MeasurementTimestamp > dateTimeFilter.LoadSince.Value.AddMilliseconds(100))
            : filtered;

        var ordered = dateTimeFilter.OrderDescending
            ? since.OrderByDescending(o => o.MeasurementTimestamp)
            : since.OrderBy(o => o.MeasurementTimestamp);

        var portion = ordered.Take(_pageSize);

        return portion.Select(m => m.CreateOpticalEventDto(_writeModel)).ToList();
    }

    public List<NetworkEventDto> GetNetworkEvents(Guid userId, bool current, DateTimeFilter dateTimeFilter)
    {
        var collection = current
            ? _writeModel.Rtus.Where(r => !r.IsAllRight)
                .Select(rtu => _writeModel.NetworkEvents.LastOrDefault(n => n.RtuId == rtu.Id))
                .Where(last => last != null)
            : _writeModel.NetworkEvents;

        // TODO нужно будет фильтровать по зонам отв для пользователя
        var filtered = collection; 

        var since = dateTimeFilter.LoadSince != null
            ? dateTimeFilter.OrderDescending
                ? filtered.Where(e => e!.EventTimestamp < dateTimeFilter.LoadSince.Value.AddMilliseconds(-100))
                : filtered.Where(e => e!.EventTimestamp > dateTimeFilter.LoadSince.Value.AddMilliseconds(100))
            : filtered;

        var ordered = dateTimeFilter.OrderDescending
            ? since.OrderByDescending(o => o!.EventTimestamp)
            : since.OrderBy(o => o!.EventTimestamp);

        var portion = ordered.Take(_pageSize);

        return portion.Select(n => n!.CreateNetworkEventDto(_writeModel)).ToList();
    }

    public List<BopEventDto> GetBopEvents(Guid userId, bool current, DateTimeFilter dateTimeFilter)
    {
        var collection = current
            ? _writeModel.BopNetworkEvents
                .OrderByDescending(e => e.EventTimestamp) // самыц свежий - первый
                .GroupBy(b => b.Serial)
                .Select(g => g.First())
                .Where(l => !l.IsOk)
            : _writeModel.BopNetworkEvents;

        // TODO нужно будет фильтровать по зонам отв для пользователя
        var filtered = collection.ToList(); 
        
        var since = dateTimeFilter.LoadSince != null
            ? dateTimeFilter.OrderDescending
                ? filtered.Where(e => e.EventTimestamp < dateTimeFilter.LoadSince.Value.AddMilliseconds(-100))
                : filtered.Where(e => e.EventTimestamp > dateTimeFilter.LoadSince.Value.AddMilliseconds(100))
            : filtered;

        var ordered = dateTimeFilter.OrderDescending
            ? since.OrderByDescending(o => o!.EventTimestamp)
            : since.OrderBy(o => o!.EventTimestamp);

        var portion = ordered.Take(_pageSize);

        return portion.Select(b => b.CreateBopEventDto(_writeModel)).ToList();
    }

    public List<RtuAccidentDto> GetRtuAccidents(Guid userId, bool current, DateTimeFilter dateTimeFilter)
    {
        var collection = current ? GetCurrentStateAccidents() : _writeModel.RtuAccidents;


        // TODO нужно будет фильтровать по зонам отв для пользователя
        var filtered = collection; 

        var since = dateTimeFilter.LoadSince != null
            ? dateTimeFilter.OrderDescending
                ? filtered.Where(e => e.EventRegistrationTimestamp < dateTimeFilter.LoadSince.Value.AddMilliseconds(-100))
                : filtered.Where(e => e.EventRegistrationTimestamp > dateTimeFilter.LoadSince.Value.AddMilliseconds(100))
            : filtered;

        var ordered = dateTimeFilter.OrderDescending
            ? since.OrderByDescending(o => o.EventRegistrationTimestamp)
            : since.OrderBy(o => o.EventRegistrationTimestamp);

        var portion = ordered.Take(_pageSize);

        return portion.Select(a => a.CreateAccidentDto(_writeModel)).ToList();
    }

    private IEnumerable<RtuAccident> GetCurrentStateAccidents()
    {
        var accidentsOnTraces = _writeModel.Traces
            .Select(trace => _writeModel.RtuAccidents
                .LastOrDefault(a => a.IsMeasurementProblem && a.TraceId == trace.TraceId))
            .Where(lastAccident => lastAccident != null && !lastAccident.IsGoodAccident);

        var accidentsOnRtus = _writeModel.Rtus
            .Select(rtu => _writeModel.RtuAccidents
                .LastOrDefault(a => a.RtuId == rtu.Id && !a.IsMeasurementProblem))
            .Where(lastAccident => lastAccident != null && !lastAccident.IsGoodAccident);

        return accidentsOnTraces.Union(accidentsOnRtus)!;
    }
}
