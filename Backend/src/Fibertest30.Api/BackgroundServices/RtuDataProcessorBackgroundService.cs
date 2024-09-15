namespace Fibertest30.Api;

public class RtuDataProcessorBackgroundService : BackgroundService
{
    private readonly IRtuDataDispatcher _rtuDataDispatcher;

    public RtuDataProcessorBackgroundService(IRtuDataDispatcher rtuDataDispatcher)
    {
        _rtuDataDispatcher = rtuDataDispatcher;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // вытягивает из Channel диспетчера данные и обрабатывает их
        await _rtuDataDispatcher.ProcessRtuData(stoppingToken);
    }
}