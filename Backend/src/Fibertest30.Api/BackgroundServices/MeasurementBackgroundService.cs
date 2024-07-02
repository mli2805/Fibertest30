namespace Fibertest30.Api;

public class MeasurementBackgroundService : BackgroundService
{
    private readonly IMeasurementDispatcher _measurementDispatcher;
    
    public MeasurementBackgroundService(IMeasurementDispatcher measurementDispatcher)
    {
        _measurementDispatcher = measurementDispatcher;
    }
    
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await _measurementDispatcher.ProcessMeasurements(stoppingToken);
    }
}