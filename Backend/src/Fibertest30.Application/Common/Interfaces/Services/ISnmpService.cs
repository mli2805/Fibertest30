namespace Fibertest30.Application;

public interface ISnmpService
{
    void SendSnmpTrap(TrapReceiver trapReceiver, FtTrapType specificTrapValue, Dictionary<FtTrapProperty, string> payload);
}