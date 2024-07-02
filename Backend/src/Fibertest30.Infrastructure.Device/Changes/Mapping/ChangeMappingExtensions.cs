using Fibertest30.Infrastructure.Device.OtdrMeasEngine;
using Threshold = Fibertest30.Infrastructure.Device.OtdrMeasEngine.Threshold;
using ValueExactness = Fibertest30.Infrastructure.Device.OtdrMeasEngine.ValueExactness;
using QualifiedValue = Fibertest30.Infrastructure.Device.OtdrMeasEngine.QualifiedValue;

namespace Fibertest30.Infrastructure.Device;

public static class ChangeMappingExtensions
{
    public static List<MonitoringChange> ToMonitoringChanges(this List<OtdrMeasEngine.ChangesLevel> levels)
    {
        var result = new List<MonitoringChange>();

        var orderedLevels = GetOrderedLevels(levels);
        foreach (var level in orderedLevels)
        {
            foreach (var change in level.Changes)
            {
                var monitoringChange = change.ToMonitoringChange(level.LevelName!);

                // filter out duplicate changes on lowest levels

                // Note: given that all levels share identical advanced threshold values,
                //       it's valid to compare their distances directly for equality
                if (result.SingleOrDefault(x => x.Type == monitoringChange.Type
                                // ReSharper disable once CompareOfFloatsByEqualityOperator
                                && x.DistanceMeters == monitoringChange.DistanceMeters) == null)
                {
                    result.Add(monitoringChange);
                }
            }
        }

        return result.OrderByDescending(x => x.Level).ThenBy(x => x.DistanceMeters).ToList();
    }

    private static List<OtdrMeasEngine.ChangesLevel> GetOrderedLevels(List<OtdrMeasEngine.ChangesLevel> levels)
    {
        var levelsOrder = new[] { "critical", "major", "minor" };

        List<OtdrMeasEngine.ChangesLevel> orderedLevels = levelsOrder
            .Select(x => levels.SingleOrDefault(y => y.LevelName == x))
            .Where(x => x != null).Select(x => x!)
            .ToList();

        return orderedLevels;
    }

    public static MonitoringChange ToMonitoringChange(this OtdrMeasEngine.Change change, string levelName)
    {
        var monitoringChange = new MonitoringChange
        {
            Type = change.GetAlarmType(),
            Level = change.GetAlarmLevel(levelName),
            DistanceMeters = change.ChangeLocation * 1000 ,
            DistanceThresholdMeters = change.LocationThreshold,
            Threshold = change.ExceededThresholdValue,
            ThresholdExcessDelta = change.ExceedingValue?.Value,
            
        };
        
        monitoringChange.ReflectanceExcessDeltaExactness = change.ExceededThreshold == Threshold.EventReflectance 
            ? change.ExceedingValue?.Exactness.ToApplicationValueExactness() : null;


        if (change.IsReferenceEventIsBaselineLeft())
        {
            monitoringChange.BaselineLeft = change.ToBaselineKeyEvent();
        }
        else
        {
            monitoringChange.Baseline = change.ToBaselineKeyEvent();
        }
        
        monitoringChange.Current = change.ToCurrentKeyEvent(monitoringChange.DistanceMeters, monitoringChange.Baseline?.Comment ?? string.Empty);
        return monitoringChange;
    }
    
    public static Application.ValueExactness? ToApplicationValueExactness(this ValueExactness? exactness)
    {
        if (exactness == null) { return null;}
        return exactness.ToApplicationValueExactness();
    }
    
    public static Application.ValueExactness ToApplicationValueExactness(this ValueExactness exactness)
    {
        return (Application.ValueExactness)exactness;
    }
    
    public static Application.QualifiedValue? ToApplicationQualifiedValue(this QualifiedValue? qualifiedValue)
    {
        if (qualifiedValue == null) { return null; }
        
        return new Application.QualifiedValue(qualifiedValue.Value, 
            qualifiedValue.Exactness.ToApplicationValueExactness()!);
    }
    
    public static MonitoringAlarmType GetAlarmType(this Change change)
    {
        var changeType = change.ChangeType;

        return changeType switch
        {
            OtdrMeasEngine.ChangeType.FiberBreak => MonitoringAlarmType.FiberBreak,
            OtdrMeasEngine.ChangeType.NewEvent => MonitoringAlarmType.NewEvent,
            // currently comparison algorithm never returns MissingEvent
            // ChangeType.MissingEvent => MonitoringAlarmType.MissingEvent, 
            OtdrMeasEngine.ChangeType.ExceededThreshold => GetExceedThresholdAlarmType(change.ExceededThreshold!.Value),
            OtdrMeasEngine.ChangeType.NewEventAfterEof => MonitoringAlarmType.NewEventAfterEof,
            _ => throw new ArgumentOutOfRangeException(nameof(changeType), changeType, null)
        };
    }

    private static MonitoringAlarmType GetExceedThresholdAlarmType(OtdrMeasEngine.Threshold threshold)
    {
        return threshold switch
        {
            OtdrMeasEngine.Threshold.EventLoss => MonitoringAlarmType.EventLoss,
            OtdrMeasEngine.Threshold.EventReflectance => MonitoringAlarmType.EventReflectance,
            OtdrMeasEngine.Threshold.EventLeadingLossCoefficient => MonitoringAlarmType.SectionAttenuation,
            // PON is not supported yet
            // OtdrMeasEngine.Threshold.EventMaxLevel => MonitoringAlarmType.PonEvent,
            _ => throw new ArgumentOutOfRangeException(nameof(threshold), threshold, null)
        };
    }

    public static MonitoringAlarmLevel GetAlarmLevel(this OtdrMeasEngine.Change change, string levelName)
    {
        var changeType = change.ChangeType;
        return changeType switch
        {
            OtdrMeasEngine.ChangeType.FiberBreak => MonitoringAlarmLevel.Critical,
            OtdrMeasEngine.ChangeType.NewEvent => MonitoringAlarmLevel.Critical,
            OtdrMeasEngine.ChangeType.ExceededThreshold => GetAlarmLevel(levelName),
            OtdrMeasEngine.ChangeType.NewEventAfterEof => MonitoringAlarmLevel.Critical,
            _ => throw new ArgumentOutOfRangeException(nameof(changeType), changeType, null)
        };
    }

    private static MonitoringAlarmLevel GetAlarmLevel(string level)
    {
        return level switch
        {
            "critical" => MonitoringAlarmLevel.Critical,
            "major" => MonitoringAlarmLevel.Major,
            "minor" => MonitoringAlarmLevel.Minor,
            _ => throw new ArgumentOutOfRangeException(nameof(level), level, null)
        };
    }
    
    private static bool IsReferenceEventIsBaselineLeft(this OtdrMeasEngine.Change change)
    {
        // when ReferenceEventMapsToCurrentEvents is false
        // it means the reference event is not exactly the same as the current change
        // it's actually the left event from the change
        
        return change.ReferenceEventMapsToCurrentEvents == false;
    }

    private static MonitoringChangeKeyEvent? ToCurrentKeyEvent(this OtdrMeasEngine.Change change, double? distanceMeters, string eventComment)
    {
        var current = ToMonitoringChangeKeyEvent(
            change.ChangeType,
            change.ExceededThreshold,
            change.CurrentEventIndex, change.CurrentEventLoss, 
            change.CurrentEventReflectance, change.CurrentEventLeadingLossCoefficient, 
            eventComment);

        // fill the DistanceMeters
        if (current != null)
        {
            current.DistanceMeters = distanceMeters;
        }

        return current;
    }
    
    private static MonitoringChangeKeyEvent? ToBaselineKeyEvent(this OtdrMeasEngine.Change change)
    {
        // the DistanceMeters will be set later
        
        return ToMonitoringChangeKeyEvent(
            change.ChangeType,
            change.ExceededThreshold,
            change.ReferenceEventIndex, change.ReferenceEventLoss, 
            change.ReferenceEventReflectance, change.ReferenceEventLeadingLossCoefficient, 
            change.ReferenceEventComment);
    }
    
    private static MonitoringChangeKeyEvent? ToMonitoringChangeKeyEvent(
        ChangeType changeType,
        Threshold? exceededThreshold,
        int? eventIndex, 
        QualifiedValue? eventLoss, 
        QualifiedValue? eventReflectance, 
        QualifiedValue? eventLeadingLossCoefficient, 
        string? referenceEventComment)
    {
        // NOTE: the Change doesn't have Distance for baseline event,
        // but MonitoringChangeKeyEvent has
        
        
        if (eventIndex == null)  { return null; }

        if (changeType == ChangeType.ExceededThreshold && exceededThreshold == Threshold.EventLoss && eventLoss == null  )
        {
            throw new ArgumentNullException(nameof(eventLoss), "eventLoss: must be set, changeType: " + changeType);
        }

        if (eventLoss != null && eventLoss.Exactness != ValueExactness.Exact)
        {
            throw new ArgumentException("eventLoss.Exactness: only Exact exactness is supported, changeType: " + changeType, nameof(eventLoss));
        }

        if (changeType == ChangeType.ExceededThreshold && exceededThreshold == Threshold.EventReflectance && eventReflectance == null)
        {
            throw new ArgumentNullException(nameof(eventReflectance), "eventReflectance: must be set, changeType: " + changeType);
        }

        if (changeType == ChangeType.ExceededThreshold && exceededThreshold == Threshold.EventLeadingLossCoefficient && eventLeadingLossCoefficient == null)
        {
            throw new ArgumentNullException(nameof(eventLeadingLossCoefficient), "eventLeadingLossCoefficient: must be set, changeType: " + changeType);
        }

        if (eventLeadingLossCoefficient != null && eventLeadingLossCoefficient.Exactness != ValueExactness.Exact)
        {
            throw new ArgumentException("eventLeadingLossCoefficient.Exactness: only Exact exactness is supported, changeType: " + changeType, nameof(eventLeadingLossCoefficient));
        }
        
        var changeKeyEvent = new MonitoringChangeKeyEvent
        {
              KeyEventIndex = eventIndex.Value,
              EventLoss = eventLoss?.Value,
              EventReflectance  = eventReflectance.ToApplicationQualifiedValue()!,
              SectionAttenuation = eventLeadingLossCoefficient?.Value,
              
              Comment = referenceEventComment ?? string.Empty
        };

        var reflectanceProperties = changeKeyEvent.EventReflectance?.Exactness.ToReflectanceProperties();
        changeKeyEvent.IsReflective = reflectanceProperties?.IsReflective;
        changeKeyEvent.IsClipped = reflectanceProperties?.IsClipped;

        return changeKeyEvent;
    }
    

}