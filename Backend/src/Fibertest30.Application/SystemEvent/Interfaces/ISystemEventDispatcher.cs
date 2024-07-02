namespace Fibertest30.Application;

public interface ISystemEventDispatcher
{
    Task ProcessSystemEvents(CancellationToken ct);
    IObservable<SystemEvent> GetEventStream();
}
