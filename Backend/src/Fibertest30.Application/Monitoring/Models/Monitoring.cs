namespace Fibertest30.Application;

public class Monitoring : IDisposable
{
    public int MonitoringPortId { get; set; }
    public DateTime StartedAt { get; set; }
    public DateTime CompletedAt { get; set; }
    public Measurement? Measurement { get; set; } 
    public string? FailReason { get; private set; }
    
    private readonly CancellationTokenSource _cts = new();
    public CancellationToken CancellationToken => _cts.Token;

    public Monitoring(int monitoringPortId)
    {
        MonitoringPortId = monitoringPortId;
    }

    public void SetMeasurementSettings(MeasurementSettings measurementSettings)
    {
        Measurement = new Measurement(MonitoringPortId);
        Measurement.SetMeasurementSettings(measurementSettings);
    }
    
    public void Cancel()
    {
        _cts.Cancel();
    }

    public void Dispose()
    {
        _cts.Dispose();
    }
}
