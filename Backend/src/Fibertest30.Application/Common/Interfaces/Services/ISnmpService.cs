namespace Fibertest30.Application;

public interface ISnmpService
{
    void SendSnmpTrap(TrapReceiver trapReceiver, int specificTrapValue, Dictionary<int, string> payload);
}