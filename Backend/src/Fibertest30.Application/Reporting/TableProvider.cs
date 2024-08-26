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

    public List<OpticalEventDto> GetOpticalEvents(Guid userId)
    {
            // var user = _writeModel.Users.First(u => u.UserId == userId);
            // в модели другие юзеры , не те что в sqlite базе бэкенда
            //TODO переделать
            var user = _writeModel.Users.First(u => u.Role == Role.Root);


            var filtered = _writeModel
                .Measurements.Where(o => o.Filter("", "", _writeModel, user));

            return filtered.OrderByDescending(x=>x.SorFileId)
                .Select(m => m.CreateOpticalEventDto(_writeModel)).ToList();
    }


}
