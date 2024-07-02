using GrpcCompareTracesRequest = Optixsoft.GrpcOtdr.CompareTracesRequest;
using GrpcThresholdsLevel = Optixsoft.GrpcOtdr.CompareTracesRequest.Types.ComparisonOptions.Types.ThresholdSetup.Types.Level;
using GrpcThresholdSetup = Optixsoft.GrpcOtdr.CompareTracesRequest.Types.ComparisonOptions.Types.ThresholdSetup;
using GrpcThresholdsScopedGroup = Optixsoft.GrpcOtdr.CompareTracesRequest.Types.ComparisonOptions.Types.ThresholdSetup.Types.Level.Types.ThresholdScopedGroup;
using GrpcThresholdsGroup = Optixsoft.GrpcOtdr.CompareTracesRequest.Types.ComparisonOptions.Types.ThresholdSetup.Types.Level.Types.ThresholdScopedGroup.Types.ThresholdGroup;
using GrpcCombinedThreshold = Optixsoft.GrpcOtdr.CombinedThreshold;
using GrpcAdvancedThresholds = Optixsoft.GrpcOtdr.CompareTracesRequest.Types.ComparisonOptions.Types.ThresholdSetup.Types.Level.Types.AdvancedThresholds;
using GrpcCompareTracesResponse = Optixsoft.GrpcOtdr.CompareTracesResponse;
using GrpcTraceDiff = Optixsoft.GrpcOtdr.CompareTracesResponse.Types.TraceDiff;
using GrpcChangesLevel = Optixsoft.GrpcOtdr.CompareTracesResponse.Types.TraceDiff.Types.Level;
using GrpcChange = Optixsoft.GrpcOtdr.CompareTracesResponse.Types.TraceDiff.Types.Change;
using GrpcChangeType = Optixsoft.GrpcOtdr.CompareTracesResponse.Types.TraceDiff.Types.Change.Types.ChangeType;
using GrpcThreshold = Optixsoft.GrpcOtdr.CompareTracesResponse.Types.TraceDiff.Types.Change.Types.Threshold;
using GrpcQualifiedValue = Optixsoft.GrpcOtdr.QualifiedValue;

namespace Fibertest30.Infrastructure.Device.OtdrMeasEngine;

public static class CompareTracesMappingExtensions
{
    public static GrpcCombinedThreshold? ToGrpcCombinedThreshold(this double? value)
    {
        return value.HasValue ?
            new GrpcCombinedThreshold() { Decrease = -value.Value, Increase = value.Value } :
            null;
    }

    public static GrpcThresholdsScopedGroup ToGrpc(this Thresholds native)
    {
        return new GrpcThresholdsScopedGroup()
        {
            Thresholds = new GrpcThresholdsGroup()
            {
                EventLoss = native.EventLoss.ToGrpcCombinedThreshold(),
                EventReflectance = native.EventReflectance.ToGrpcCombinedThreshold(),
                EventLeadingLossCoefficient = native.EventLeadingLossCoefficient.ToGrpcCombinedThreshold(),
                ReflectiveEventPosition = native.ReflectiveEventPosition.ToGrpcCombinedThreshold(),
                NonReflectiveEventPosition = native.NonReflectiveEventPosition.ToGrpcCombinedThreshold()
            }
        };
    }

    public static GrpcAdvancedThresholds ToGrpc(this AdvancedThresholds native)
    {
        var grpc = new GrpcAdvancedThresholds();
        if (native.AttenuationCoefficientChangeForNewEvents.HasValue)
        {
            grpc.AttenuationCoefficientChangeForNewEvents = native.AttenuationCoefficientChangeForNewEvents.Value;
        };
        if (native.EofLossChangeForFiberBreak.HasValue)
        {
            grpc.EofLossChangeForFiberBreak = native.EofLossChangeForFiberBreak.Value;
        }
        if (native.EofAtenuationCoefficientChangeForFiberBreak.HasValue)
        {
            grpc.EofAttenuationCoefficientChangeForFiberBreak = native.EofAtenuationCoefficientChangeForFiberBreak.Value;
        }
        if (native.MaxEofAtenuationCoefficientForFiberBreak.HasValue)
        {
            grpc.MaxEofAttenuationCoefficientForFiberBreak = native.MaxEofAtenuationCoefficientForFiberBreak.Value;
        }
        if (native.NoiseLevelChangeForFiberElongation.HasValue)
        {
            grpc.NoiseLevelChangeForFiberElongation = native.NoiseLevelChangeForFiberElongation.Value;
        }
        return grpc;
    }

    public static GrpcThresholdsLevel ToGrpc(this ThresholdsLevel native)
    {
        return new GrpcThresholdsLevel()
        {
            Name = native.Name,
            Groups = { native.Thresholds.ToGrpc(), },
            AdvancedThresholds = native.AdvancedThresholds.ToGrpc()
        };
    }

    public static GrpcThresholdSetup ToGrpcThresholdSetup(this List<ThresholdsLevel> native)
    {
        var grpc = new GrpcThresholdSetup();
        grpc.Levels.AddRange(native.Select(l => l.ToGrpc()));
        return grpc;
    }

    public static GrpcCompareTracesRequest ToGrpc(this CompareTracesRequest native)
    {
        return new GrpcCompareTracesRequest()
        {
            CurrentTraces = { Google.Protobuf.ByteString.CopyFrom(native.CurrentTrace), },
            ReferenceTraces = { Google.Protobuf.ByteString.CopyFrom(native.ReferenceTrace), },
            ComparisonOptions = new GrpcCompareTracesRequest.Types.ComparisonOptions()
            {
                Mode = GrpcCompareTracesRequest.Types.ComparisonOptions.Types.Mode.Normal,
                ThresholdsSetup = native.ThresholdsLevels.ToGrpcThresholdSetup()
            }
        };
    }

    public static ChangeType FromGrpc(this GrpcChangeType grpc)
    {
        return grpc switch
        {
            GrpcChangeType.ExceededThreshold => ChangeType.ExceededThreshold,
            GrpcChangeType.FiberBreak => ChangeType.FiberBreak,
            GrpcChangeType.MissingEvent => ChangeType.MissingEvent,
            GrpcChangeType.NewEvent => ChangeType.NewEvent,
            GrpcChangeType.NewEventAfterEof => ChangeType.NewEventAfterEof,
            _ => throw new Exception($"grpc_otdr returned unknown or unspecified ChangeType: {grpc}")
        };
    }

    public static Threshold FromGrpc(this GrpcThreshold grpc)
    {
        return grpc switch
        {
            GrpcThreshold.EventLoss => Threshold.EventLoss,
            GrpcThreshold.EventReflectance => Threshold.EventReflectance,
            GrpcThreshold.EventLeadingLossCoefficient => Threshold.EventLeadingLossCoefficient,
            _ => throw new Exception($"grpc_otdr returned unknown Threshold: {grpc}")
        };
    }

    public static ValueExactness FromGrpc(this GrpcQualifiedValue.Types.ValueExactness grpc)
    {
        return grpc switch
        {
            GrpcQualifiedValue.Types.ValueExactness.Unspecified or 
            GrpcQualifiedValue.Types.ValueExactness.Exact => ValueExactness.Exact,
            GrpcQualifiedValue.Types.ValueExactness.AtLeast => ValueExactness.AtLeast,
            GrpcQualifiedValue.Types.ValueExactness.AtMost => ValueExactness.AtMost,
            _ => throw new Exception($"grpc_otdr returned unknown ValueExactness: {grpc}")
        };
    }

    public static QualifiedValue? FromGrpc(this GrpcQualifiedValue? grpc)
    {
        return grpc != null ? new QualifiedValue(grpc.Value, grpc.Exactness.FromGrpc()) : null;
    }

    public static Change FromGrpc(this GrpcChange grpc)
    {
        return new Change()
        {
            ChangeType = grpc.ChangeType.FromGrpc(),
            ExceededThreshold = grpc.HasExceededThreshold ? grpc.ExceededThreshold.FromGrpc() : null,
            ExceededThresholdValue = grpc.HasExceededThresholdPartValue ? grpc.ExceededThresholdPartValue : null,
            ExceedingValue = grpc.ExceedingValue.FromGrpc(),
            ChangeLocation = grpc.HasChangeLocation ? grpc.ChangeLocation : null,
            LocationThreshold = (grpc.LocationThreshold != null && grpc.LocationThreshold.HasIncrease) ? grpc.LocationThreshold.Increase : null,
            CurrentEventIndex = grpc.HasCurrentEventIndex ? grpc.CurrentEventIndex : null,
            CurrentEventLoss = grpc.CurrentEventLoss.FromGrpc(),
            CurrentEventReflectance = grpc.CurrentEventReflectance.FromGrpc(),
            CurrentEventLeadingLossCoefficient = grpc.CurrentEventLeadingLossCoefficient.FromGrpc(),
            ReferenceEventIndex = grpc.HasReferenceEventIndex ? grpc.ReferenceEventIndex : null,
            ReferenceEventLoss = grpc.ReferenceEventLoss.FromGrpc(),
            ReferenceEventReflectance = grpc.ReferenceEventReflectance.FromGrpc(),
            ReferenceEventLeadingLossCoefficient = grpc.ReferenceEventLeadingLossCoefficient.FromGrpc(),
            ReferenceEventComment = grpc.HasReferenceEventComment ? grpc.ReferenceEventComment : null,
            ReferenceEventMapsToCurrentEvents = grpc.HasReferenceEventMapsToCurrentEvent ? grpc.ReferenceEventMapsToCurrentEvent : null
        };
    }

    public static ChangesLevel FromGrpc(this GrpcChangesLevel grpc)
    {
        return new ChangesLevel()
        {
            LevelName = grpc.Name,
            Changes = grpc.Changes.Select(s => s.FromGrpc()).ToList()
        };
    }

    public static TraceDiff FromGrpc(this GrpcTraceDiff grpc)
    {
        return new TraceDiff()
        {
            Levels = grpc.Levels.Select(l => l.FromGrpc()).ToList()
        };
    }

    public static CompareTracesResponse FromGrpc(this GrpcCompareTracesResponse grpc)
    {
        if (grpc.CurrentTraces.Count == 0)
        {
            throw new Exception("grpc_otdr returned empty CurrentTraces array");
        }
        return new CompareTracesResponse()
        {
            Log = grpc.Log,
            CurrentTrace = grpc.CurrentTraces[0].ToByteArray(),
            TraceDiff = grpc.TraceDiff.FromGrpc()
        };
    }

}
