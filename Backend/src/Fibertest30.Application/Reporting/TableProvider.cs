using Iit.Fibertest.Dto;
using Iit.Fibertest.Graph;

namespace Fibertest30.Application;

public class TableProvider
{
    private readonly Model _writeModel;

    public TableProvider(Model writeModel)
    {
        _writeModel = writeModel;
    }

    public List<OpticalEventDto> GetOpticalEvents(Guid userId, bool current)
    {
        // var user = _writeModel.Users.First(u => u.UserId == userId);
        // в модели другие юзеры , не те что в sqlite базе бэкенда
        //TODO переделать
        var user = _writeModel.Users.First(u => u.Role == Role.Root);

        var collection = current ? _writeModel.ActiveMeasurements : _writeModel.Measurements;

        var filtered = collection
            .Where(o => o.Filter("", "", _writeModel, user));

        return filtered.OrderByDescending(x => x.SorFileId)
            .Select(m => m.CreateOpticalEventDto(_writeModel)).ToList();
    }

    public List<NetworkEventDto> GetNetworkEvents(Guid userId, bool current)
    {
        var sift = current 
            ? _writeModel.Rtus.Where(r=> !r.IsAllRight)
                .Select(rtu=> _writeModel.NetworkEvents.LastOrDefault(n=>n.RtuId == rtu.Id))
                .Where(last => last != null)
                : _writeModel.NetworkEvents;

        return sift.OrderByDescending(x => x!.Ordinal)
            .Select(n => n!.CreateNetworkEventDto(_writeModel)).ToList();
    }

    public List<BopEventDto> GetBopEvents(Guid userId, bool current)
    {
        var sift = current
            ? _writeModel.Rtus
                .Select(rtu => _writeModel.BopNetworkEvents.LastOrDefault(n => n.RtuId == rtu.Id))
                .Where(lastBopNetworkEvent => lastBopNetworkEvent != null && !lastBopNetworkEvent.IsOk)
            : _writeModel.BopNetworkEvents;

        return sift.OrderByDescending(x => x!.Ordinal)
            .Select(b => b!.CreateBopEventDto(_writeModel)).ToList();
    }

    public List<RtuAccidentDto> GetRtuAccidents(Guid userId, bool current)
    {
        var sift = current ? GetCurrentStateAccidents() : _writeModel.RtuAccidents;
        return sift.OrderByDescending(x => x.Id)
            .Select(a => a.CreateAccidentDto(_writeModel)).ToList();
    }

    private List<RtuAccident> GetCurrentStateAccidents()
    {
        var traces = _writeModel.Traces
            .Select(trace => _writeModel.RtuAccidents
                .LastOrDefault(a => a.IsMeasurementProblem && a.TraceId == trace.TraceId))
            .Where(lastAccident => lastAccident != null && !lastAccident.IsGoodAccident);

        var rtus = _writeModel.Rtus
            .Select(rtu => _writeModel.RtuAccidents
                .LastOrDefault(a => a.RtuId == rtu.Id && !a.IsMeasurementProblem))
            .Where(lastAccident => lastAccident != null && !lastAccident.IsGoodAccident);

        return traces.Union(rtus).ToList()!;
    }
}
