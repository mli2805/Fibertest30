namespace Fibertest30.Application;

public interface ITraceComparator
{
    Task<TraceComparisonResult> Compare(
        int monitoringPortId, byte[] baselineSor, byte[] measurementSor, AlarmProfile alarmProfile);
}