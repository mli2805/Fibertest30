namespace Fibertest30.Application;

public interface ISystemEventSender
{
    Task Send(SystemEvent systemEvent);
}