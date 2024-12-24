using Iit.Fibertest.Dto;
using System.Collections.Concurrent;

namespace Fibertest30.Infrastructure;

public class RtuCurrentStateDictionary : IRtuCurrentStateDictionary
{
    private readonly ConcurrentDictionary<Guid, CurrentMonitoringStepDto> _dictionary = new();

    public void Set(CurrentMonitoringStepDto dto)
    {
        _dictionary.AddOrUpdate(dto.RtuId,  dto, (_, _) => dto);
    }

    public CurrentMonitoringStepDto? Get(Guid key)
    {
        return _dictionary.TryGetValue(key, out CurrentMonitoringStepDto? dto) ? dto : null;
    }
}