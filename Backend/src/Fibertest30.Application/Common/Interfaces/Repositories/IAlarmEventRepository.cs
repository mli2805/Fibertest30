
namespace Fibertest30.Application;
public interface IAlarmEventRepository
{
    Task<List<MonitoringAlarmEvent>> GetFilteredPortion(List<int> portIds, bool sortDescending);

}
