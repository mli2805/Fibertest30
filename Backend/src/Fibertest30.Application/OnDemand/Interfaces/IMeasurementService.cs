namespace Fibertest30.Application;

public interface IMeasurementService
{
    Task Measure(Measurement measurement, CancellationToken ct, bool notifyComplete = true);
    MeasurementTrace? GetLastProgressSorData(Measurement measurement);
    Task StopOtdrMeasurement(Measurement measurement);
    Measurement? CurrentMeasurement { get;  }
}