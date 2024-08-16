namespace Fibertest30.Api;


public class RtuPollsterBackgroundService : BackgroundService
{
    private readonly IRtuLinuxPollster _rtuLinuxPollster;

    public RtuPollsterBackgroundService(IRtuLinuxPollster rtuLinuxPollster)
    {
        _rtuLinuxPollster = rtuLinuxPollster;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await _rtuLinuxPollster.PollRtus(stoppingToken);
    }
}
