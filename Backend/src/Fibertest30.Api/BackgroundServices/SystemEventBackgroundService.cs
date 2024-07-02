namespace Fibertest30.Api;

public class SystemEventBackgroundService : BackgroundService
{
    private readonly ISystemEventDispatcher _systemEventDispatcher;
    
    public SystemEventBackgroundService(ISystemEventDispatcher systemEventDispatcher)
    {
        _systemEventDispatcher = systemEventDispatcher;
    }
    
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await _systemEventDispatcher.ProcessSystemEvents(stoppingToken);
    }
}