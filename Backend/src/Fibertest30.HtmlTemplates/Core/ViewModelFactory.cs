using Fibertest30.Application;

namespace Fibertest30.HtmlTemplates;

public class ViewModelFactory 
{
    public MonitoringAlarmViewModel CreateAlarmViewModel(TimeZoneInfo timeZone, 
        MonitoringAlarm alarm)
    {
        var orderedEvents = alarm.Events!
            .OrderByDescending(x => x.At)
            .ToList();
        
        return new MonitoringAlarmViewModel
        {
            Id = alarm.Id,
            GroupId = alarm.AlarmGroupId,
            Level = alarm.Level.AlarmLevelToString(),
            LevelValue = alarm.Level.ToLevelValue(),
            Type = alarm.Type.AlarmTypeToString(),
            Distance = alarm.DistanceMeters.ToKmOrM(),
            Status = alarm.Status.AlarmStatusToString(),
            Events = orderedEvents.Select((alarmEvent, index) => new MonitoringAlarmEventViewModel
            {
                At = alarmEvent.At.DateTimeToStringWithTimeZone(timeZone),
                OldLevel = alarmEvent.OldLevel?.AlarmLevelToString() ?? null,
                OldLevelValue = alarmEvent.OldLevel?.ToLevelValue() ?? null,
                Level =  alarmEvent.Level.AlarmLevelToString(),
                OldStatus = alarmEvent.OldStatus?.AlarmStatusToString() ?? null,
                OldStatusValue = alarmEvent.OldStatus?.ToStatusValue() ?? null,
                Status = alarmEvent.Status.AlarmStatusToString(),
                EvenOrOdd = (index+1) % 2 == 0 ? "even" : "odd",
                StatusColor = alarmEvent.Status.ToStatusColor(alarmEvent.Level)

            }).ToList(),
            LevelColor = alarm.Level.ToString().ToLowerInvariant(),
            StatusColor = alarm.Status.ToStatusOnlyResolvedColor(),
            Change = ToMonitoringChangeViewModel(alarm.DistanceMeters, orderedEvents.FirstOrDefault()?.Change)
        };
    }
    
    public MonitoringChangeViewModel ToMonitoringChangeViewModel(double? alarmDistanceMeters, MonitoringChange? change)
    {
        var result = new MonitoringChangeViewModel
        {
            ShowDistances = change != null && alarmDistanceMeters != null
                                           && (change.BaselineLeft?.DistanceMeters != null ||
                                               change.BaselineRight?.DistanceMeters != null),
            BaselineLeftComment = change?.BaselineLeft?.Comment ?? string.Empty,
            BaselineRightComment = change?.BaselineRight?.Comment ?? string.Empty,
        };
            
        if (change?.BaselineLeft?.DistanceMeters != null)
        {
            result.BaselineLeftDeltaDistance =  (alarmDistanceMeters - change.BaselineLeft.DistanceMeters).ToKmOrM();
        }
        
        if (change?.BaselineRight?.DistanceMeters != null)
        {
            result.BaselineRightDeltaDistance =  (change.BaselineRight.DistanceMeters - alarmDistanceMeters).ToKmOrM();
        }

        return result;
    }
}