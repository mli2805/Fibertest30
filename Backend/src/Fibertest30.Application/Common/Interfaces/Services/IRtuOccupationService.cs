using Iit.Fibertest.Dto;

namespace Fibertest30.Application;
public interface IRtuOccupationService
{
    bool TrySetOccupation(Guid rtuId, RtuOccupation newRtuOccupation, string? userName, out RtuOccupationState? state);
}
