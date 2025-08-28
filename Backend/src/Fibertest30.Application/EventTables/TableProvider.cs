using Iit.Fibertest.Dto;
using Iit.Fibertest.Graph;

namespace Fibertest30.Application;

public class TableProvider
{
    // в случаем изменения - исправить константу в EventTablesService на web стороне
    private readonly Model _writeModel;

    public TableProvider(Model writeModel)
    {
        _writeModel = writeModel;
    }

    public HasCurrentEvents GetHasCurrentEvents(string userId)
    {
        //TODO отфильтровать события не входящие в зону ответственности данного пользователя

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

    public List<OpticalEventDto> GetOpticalEvents(Guid zoneId, bool current, DateTimeFilter dateTimeFilter, int portionSize)
    {
        var collection = current ? _writeModel.ActiveMeasurements : _writeModel.Measurements;
        var filtered = collection
            .Where(o => o.Filter("", "", _writeModel, zoneId));


        var since = dateTimeFilter.LoadSince != null
            ? dateTimeFilter.OrderDescending
                ? filtered.Where(e => e.MeasurementTimestamp < dateTimeFilter.LoadSince.Value.AddMilliseconds(-100))
                : filtered.Where(e => e.MeasurementTimestamp > dateTimeFilter.LoadSince.Value.AddMilliseconds(100))
            : filtered;

        var ordered = dateTimeFilter.OrderDescending
            ? since.OrderByDescending(o => o.MeasurementTimestamp)
            : since.OrderBy(o => o.MeasurementTimestamp);

        var portion = ordered.Take(portionSize);

        return portion.Select(m => m.CreateOpticalEventDto(_writeModel)).ToList();
    }

    public NetworkEventDto GetNetworkEvent(int eventId)
    {
        var networkEvent = _writeModel.NetworkEvents.Single(n => n.Ordinal == eventId);
        return networkEvent.CreateNetworkEventDto(_writeModel);
    }

    public List<NetworkEventDto> GetNetworkEvents(Guid userId, bool current, DateTimeFilter dateTimeFilter, int portionSize)
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

        var portion = ordered.Take(portionSize);

        return portion.Select(n => n!.CreateNetworkEventDto(_writeModel)).ToList();
    }

    public BopEventDto GetBopEvent(int eventId)
    {
        var bopEvent = _writeModel.BopNetworkEvents.Single(b => b.Ordinal == eventId);
        return bopEvent.CreateBopEventDto(_writeModel);
    }

    public List<BopEventDto> GetBopEvents(Guid userId, bool current, DateTimeFilter dateTimeFilter, int portionSize)
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
            ? since.OrderByDescending(o => o.EventTimestamp)
            : since.OrderBy(o => o.EventTimestamp);

        var portion = ordered.Take(portionSize);

        return portion.Select(b => b.CreateBopEventDto(_writeModel)).ToList();
    }

    public RtuAccidentDto GetRtuAccident(int eventId)
    {
        var rtuAccident = _writeModel.RtuAccidents.Single(a => a.Id == eventId);
        return rtuAccident.CreateAccidentDto(_writeModel);
    }

    public List<RtuAccidentDto> GetRtuAccidents(Guid userId, bool current, DateTimeFilter dateTimeFilter, int portionSize)
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

        var portion = ordered.Take(portionSize);

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
