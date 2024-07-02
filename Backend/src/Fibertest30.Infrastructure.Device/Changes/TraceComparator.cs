using Fibertest30.Infrastructure.Device.OtdrMeasEngine;

namespace Fibertest30.Infrastructure.Device;

public class TraceComparator : ITraceComparator
{
    private readonly OtdrMeasEngine.OtdrMeasEngine _otdrMeasEngine;

    public TraceComparator(OtdrMeasEngine.OtdrMeasEngine otdrMeasEngine)
    {
        _otdrMeasEngine = otdrMeasEngine;
    }

    public async Task<TraceComparisonResult> Compare(
        int monitoringPortId, byte[] baselineSor, byte[] measurementSor, AlarmProfile alarmProfile)
    {
        var request = new CompareTracesRequest()
        {
            ReferenceTrace = baselineSor,
            CurrentTrace = measurementSor,
            ThresholdsLevels = alarmProfile.ToOtdrMeasEngine()
        };
        var response = await _otdrMeasEngine.CompareTraces(request);
        return new TraceComparisonResult()
        {
            Changes = response.TraceDiff.Levels.ToMonitoringChanges(),
            ModifiedTrace = response.CurrentTrace
        };
    }
}