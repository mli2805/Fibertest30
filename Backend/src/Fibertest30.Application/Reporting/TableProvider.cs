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
        return _writeModel.NetworkEvents.OrderByDescending(x => x.Ordinal)
            .Select(n => n.CreateNetworkEventDto(_writeModel)).ToList();
    }

    public List<BopEventDto> GetBopEvents(Guid userId, bool current)
    {
        return _writeModel.BopNetworkEvents.OrderByDescending(x => x.Ordinal)
            .Select(b => b.CreateBopEventDto(_writeModel)).ToList();
    }

    public List<RtuAccidentDto> GetRtuAccidents(Guid userId, bool current)
    {
        return _writeModel.RtuAccidents.OrderByDescending(x => x.Id)
            .Select(a => a.CreateAccidentDto(_writeModel)).ToList();
    }
}
