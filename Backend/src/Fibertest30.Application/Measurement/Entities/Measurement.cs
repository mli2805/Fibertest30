using System.Reactive.Linq;
using System.Reactive.Subjects;

namespace Fibertest30.Application;
public class Measurement
{
    public IObservable<MeasurementProgress> ProgressObservable { get; init; } 
    private readonly Subject<MeasurementProgress> _progressSubject = new();
    public int MonitoringPortId { get; init; }

    public string MeasurementName { get; private set; } = string.Empty;
    public MeasurementSettings? MeasurementSettings { get; private set; }
    public MeasurementProgress? Progress { get; private set; }
    

    public Measurement(int monitoringPortId)
    {
        MonitoringPortId = monitoringPortId;
        ProgressObservable =  _progressSubject.AsObservable();
    }
    
    public void SetMeasurementSettings(MeasurementSettings measurementSettings, 
        string measurementName = "")
    {
        MeasurementName = measurementName;
        MeasurementSettings = measurementSettings;
    }

    public void NotifyProgress(MeasurementProgress progress)
    {
        Progress = progress;
        _progressSubject.OnNext(progress);
    }

    public void NotifyComplete()
    {
        _progressSubject.OnCompleted();
    }
}