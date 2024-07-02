using Fibertest30.Domain.Utils;

namespace Fibertest30.Application;

public static class MeasurementSettingsToIOtdrMeasureParameters
{
    public static (bool, 
        OtdrTraceFiberParameters, 
        OtdrTraceAnalysisParameters, 
        OtdrTraceSpanParameters, 
        OtdrTraceManualMeasurementParameters) 
        ToIOtdrMeasureParameters(this MeasurementSettings measurementSettings)
    {
        return (measurementSettings.IsLive(),
                measurementSettings.ToFiberParameters(),
                measurementSettings.ToAnalysisParameters(),
                measurementSettings.ToSpanParameters(),
                measurementSettings.ToManualMeasurementParameters()
            );
    }

    public static bool IsLive(this MeasurementSettings measurementSettings)
    {
        return measurementSettings.FastMeasurement;
    }

    public static bool IsAuto(this MeasurementSettings measurementSettings)
    {
        return measurementSettings.MeasurementType 
            is MeasurementType.Auto or MeasurementType.AutoSkipMeasurement;
    }

    public static bool IsSkipMeasurement(this MeasurementSettings measurementSettings)
    {
        return measurementSettings.MeasurementType 
            is MeasurementType.AutoSkipMeasurement;
    }

    public static OtdrTraceFiberParameters ToFiberParameters(
        this MeasurementSettings measurementSettings)
    {
        return new OtdrTraceFiberParameters
        {
            BackscatterCoefficient = measurementSettings.BackscatterCoeff,
            RefractiveIndex = measurementSettings.RefractiveIndex
        };
    }
    
    public static OtdrTraceAnalysisParameters ToAnalysisParameters(
        this MeasurementSettings measurementSettings)
    {
        return new OtdrTraceAnalysisParameters
        {
            EndOfFiberThreshold = measurementSettings.EndOfFiberThreshold,
            EventLossThreshold = measurementSettings.EventLossThreshold,
            EventReflectanceThreshold = measurementSettings.EventReflectanceThreshold
        };
    }

    public static OtdrTraceSpanParameters ToSpanParameters(
        this MeasurementSettings measurementSettings)
    {
        return new OtdrTraceSpanParameters
        {
            BeginningEventIndex = 0,
            EndEventIndex = -1,
            IncludeBeginningEventLoss = false,
            IncludeEndEventLoss = false
        };
    }

    public static OtdrTraceManualMeasurementParameters ToManualMeasurementParameters(
        this MeasurementSettings measurementSettings)
    {
        var measurementParameters = new OtdrTraceManualMeasurementParameters
        {
            Laser = new Laser(measurementSettings.Laser, null)
        };

        if (measurementSettings.MeasurementType == MeasurementType.Auto)
        {
            return measurementParameters;
        }
        
        measurementParameters.DistanceRange = measurementSettings.DistanceRange;
        measurementParameters.PulseDuration = measurementSettings.Pulse;
        measurementParameters.Resolution = measurementSettings.SamplingResolution;
        measurementParameters.AveragingTime = measurementSettings.FastMeasurement ? null : measurementSettings.AveragingTime;
        measurementParameters.LiveAveragingTime =
            measurementSettings.FastMeasurement ? measurementSettings.AveragingTime : null;
        
        return measurementParameters;
    }

    public static OpticalLineTopology ToOpticalLineTopology(
        this MeasurementSettings measurementSettings)
    {
        var topology = new OpticalLineTopology
        {
            LineKind = measurementSettings.NetworkType switch
            {
                NetworkType.ManualPon => LineKind.Pon,
                NetworkType.AutoPon => LineKind.Pon,
                NetworkType.XWdm => LineKind.Pon,
                NetworkType.AutoPonToOnt => LineKind.PonToOnt,
                NetworkType.PointToPoint => LineKind.PointToPoint,
                _ => throw new ArgumentOutOfRangeException()
            }
        };

        if (measurementSettings.NetworkType == NetworkType.ManualPon)
        {
            if (measurementSettings.Splitter1Db > 0) { topology.ElemenetLosses.Add(measurementSettings.Splitter1Db);}
            if (measurementSettings.Splitter2Db > 0) { topology.ElemenetLosses.Add(measurementSettings.Splitter2Db);}
        }
        
        if (measurementSettings.NetworkType == NetworkType.XWdm)
        {
            for (var i = 0; i < measurementSettings.Mux; i++)
            {
                topology.ElemenetLosses.Add(DefaultParameters.MuxDb);
            }
        }


        return topology;
    }
}