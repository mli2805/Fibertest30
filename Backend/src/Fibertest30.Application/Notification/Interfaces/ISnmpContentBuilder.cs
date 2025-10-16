using Iit.Fibertest.Graph;

namespace Fibertest30.Application;

public interface ISnmpContentBuilder
{
    Dictionary<FtTrapProperty, string> BuildSnmpPayload(AddMeasurement measurement, Model model);
    Dictionary<FtTrapProperty, string> BuildSnmpPayload(NetworkEvent networkEvent, Model model);
    Dictionary<FtTrapProperty, string> BuildSnmpPayload(BopNetworkEvent bopNetworkEvent, Model model);
    Dictionary<FtTrapProperty, string> BuildSnmpPayload(RtuAccident rtuStatusEvent, Model model);
}