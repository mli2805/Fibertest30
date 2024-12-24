using Iit.Fibertest.Dto;

namespace Fibertest30.Application;

public interface IRtuCurrentStateDictionary
{
    void Set(CurrentMonitoringStepDto dto);
    CurrentMonitoringStepDto? Get(Guid key);

}