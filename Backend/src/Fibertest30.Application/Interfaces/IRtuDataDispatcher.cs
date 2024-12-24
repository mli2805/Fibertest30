using Iit.Fibertest.Dto;

namespace Fibertest30.Application;

public interface IRtuDataDispatcher
{
    Task Send(IDataFromRtu dataFromRtu, CancellationToken ct);
    Task ProcessRtuData(CancellationToken ct);

}