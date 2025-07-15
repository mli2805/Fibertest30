using Iit.Fibertest.Dto;
using Iit.Fibertest.Graph;

namespace Fibertest30.Application;

public interface IBaseRefRepairman
{
    Task<string?> ProcessNodeRemoved(List<Guid> traceIds);
    Task<string?> AmendForTracesFromRtu(Guid rtuId);
    Task<string?> ProcessUpdateEquipment(Guid equipmentId);
    Task<string?> ProcessUpdateFiber(Guid fiberId);
    Task<string?> AmendForTracesWhichUseThisNode(Guid nodeId);

    Task<RequestAnswer> AmendBaseRefsForOneTrace(Trace trace);

}