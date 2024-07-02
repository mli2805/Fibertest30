using Optixsoft.PortableGeometry.Extensions;
using Optixsoft.SorExaminer.DomainModel.Sor;

namespace Fibertest30.Infrastructure.Emulator;

public class TraceComparator : ITraceComparator
{
    private readonly OtauEmulatorProvider _otauProvider = new();
    private readonly OtauEmulatorPortChangesProvider _portChangesProvider = new();
    
    private readonly IOtauService _otauService;

    public TraceComparator(IOtauService otauService)
    {
        _otauService = otauService;
    }
    
    public Task<TraceComparisonResult> Compare(
        int monitoringPortId, byte[] baselineSor, byte[] measurementSor, AlarmProfile alarmProfile)
    {
       var otaus = _otauProvider.GetAllOtauSettingsSortedBy();
       var portChangesMap = _portChangesProvider.GetPortChangesMap();
       var otauPortPath = _otauService.GetOtauPortPathByMonitoringPortId(monitoringPortId);

       OtauManager otau = otauPortPath.CascadeOtauManager ?? otauPortPath.OcmOtauManager;
       OtauPort otauPort = otauPortPath.CascadeOtauPort ?? otauPortPath.OcmOtauPort;
       
       var emulatedOtauId = FindEmulatedOtauId(otau, otaus);
       var portChanges = portChangesMap[emulatedOtauId][otauPort.PortIndex];
       var sortedPortChanges = portChanges.Changes.OrderBy(x => x.DistanceMeters).ToList();
  
       // Note: for emulator, 'measurementSor' and 'baselineSor' are expected to match initially.
       // but if emulated sor is changed, the baseline or old measurements are not changed
       // let's pass measurementSor to FillCurrentAndBaselineProperties to reflect changes immediatly
       // but proper way is to reset all the baselines and remove old measurements (db reset)
       FillCurrentAndBaselineProperties(measurementSor, sortedPortChanges);
       
       FillThresholds(alarmProfile.Thresholds, sortedPortChanges);

       var result = new TraceComparisonResult
       {
           ModifiedTrace = measurementSor,
           Changes = portChanges.Enabled ? sortedPortChanges  : new List<MonitoringChange>()
       };
       
       return Task.FromResult(result);
    }

    private static void FillCurrentAndBaselineProperties(
        byte[] measurementSor, 
        List<MonitoringChange> sortedPortChanges)
    {
        // TraceComparator should set Current and Baseline
        // In some cases BaselineLeft is set instead of Baseline, but emulator ignores that for the moment
        
        var trace = new MeasurementTrace(measurementSor);
        foreach (var portChange in sortedPortChanges)
        {
            if (portChange.DistanceMeters == null)
            {
                continue;
            }
            
            var positionOwt = trace.SorData.GetTransform(Space.Distance, Space.Owt)
                .TransformX(portChange.DistanceMeters.Value / 1000);
            var changeEvent = trace.SorData.KeyEvents.GetClosest(positionOwt);
            
            if (portChange.Type == MonitoringAlarmType.FiberBreak)
            {
                portChange.Baseline = trace.SorData.GetMonitoringChangeKeyEvent(changeEvent.Index);
                continue;
            }


            portChange.Current = trace.SorData.GetMonitoringChangeKeyEvent(changeEvent.Index);
            portChange.DistanceMeters = portChange.DistanceMeters;

            if (portChange.Type != MonitoringAlarmType.NewEvent 
                && portChange.Type != MonitoringAlarmType.NewEventAfterEof)
            {
                portChange.Baseline = trace.SorData.GetMonitoringChangeKeyEvent(changeEvent.Index);
            }
        }
    }
    
    private static void FillThresholds(
        List<Threshold> thresholds, 
        List<MonitoringChange> sortedPortChanges)
    {
        foreach (var portChange in sortedPortChanges)
        {
            // var thresholdParameter = portChange.Type.ToThresholdParameter();
            // if (thresholdParameter == null) {  continue;  }
            //
            // var threshold = thresholds.SingleOrDefault(x => x.Parameter == thresholdParameter);
            // if (threshold == null) { continue; }

            // Emulator actually doesn't care about AlarmProfile and Thresholds
            // Let's just use some test values


            if (portChange.Type == MonitoringAlarmType.FiberBreak
                || portChange.Type == MonitoringAlarmType.NewEvent
                || portChange.Type == MonitoringAlarmType.NewEventAfterEof)
            {
                // those do not have thresholds
                continue;
            }

            switch (portChange.DistanceMeters)
            {
                case 5000:
                portChange.Threshold = 5;
                portChange.ThresholdExcessDelta = 0.55;
                portChange.ReflectanceExcessDeltaExactness
                    = portChange.Type == MonitoringAlarmType.EventReflectance
                        ? ValueExactness.Exact
                        : null;
                break;
                case 10000:
                    portChange.Threshold = 10;
                    portChange.ThresholdExcessDelta = 1.11;
                    portChange.ReflectanceExcessDeltaExactness
                        = portChange.Type == MonitoringAlarmType.EventReflectance
                            ? ValueExactness.AtLeast
                            : null;
                    break;    
                case 15000:
                    portChange.Threshold = 15;
                    portChange.ThresholdExcessDelta = 1.15;
                    portChange.ReflectanceExcessDeltaExactness
                        = portChange.Type == MonitoringAlarmType.EventReflectance
                            ? ValueExactness.AtMost
                            : null;
                    break;     
                case 20000:
                    portChange.Threshold = 20;
                    portChange.ThresholdExcessDelta = 2.22;
                    portChange.ReflectanceExcessDeltaExactness
                        = portChange.Type == MonitoringAlarmType.EventReflectance
                            ? ValueExactness.Exact
                            : null;
                    break;                  
            }









        }
    }

    private string FindEmulatedOtauId(OtauManager otau, List<OtauEmulatorProvider.OtauEmulatorSettings> otaus)
    {
        if (otau.Otau.Type == OtauType.Ocm)
        {
            return otaus.OfType<OtauEmulatorProvider.OtauEmulatorOcmSettings>().Single().EmulatedOtauId;
        }

        if (otau.Otau.Type == OtauType.Osm)
        {
            return otaus.OfType<OtauEmulatorProvider.OtauEmulatorOsmSettings>().Single(x => x.ChainAddress 
                == ((OsmOtauParameters)otau.Otau.Parameters).ChainAddress).EmulatedOtauId;
        }
        
        if (otau.Otau.Type == OtauType.Oxc)
        {
            var oxcParams = (OxcOtauParameters)otau.Otau.Parameters;
            
            return otaus.OfType<OtauEmulatorProvider.OtauEmulatorOxcSettings>()
                .Single(x => x.Ip == oxcParams.Ip && x.Port == oxcParams.Port).EmulatedOtauId;
        }
        
        throw new Exception("Unknown otau type");
    }
}