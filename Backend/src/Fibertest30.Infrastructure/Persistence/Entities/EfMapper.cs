using Fibertest30.Infrastructure.Persistence.Entities;
using System.Text.Json;

namespace Fibertest30.Application;

public static class EfMapper
{
    public static SystemEventEf ToEf(this SystemEvent systemEvent)
    {
        return new SystemEventEf
        {
            Id = systemEvent.Id,
            Type = systemEvent.Type,
            Level = systemEvent.Level,
            JsonData = systemEvent.Data?.ToJsonData() ?? string.Empty,
            UserId = systemEvent.Source.UserId,
            Source = systemEvent.Source.Source,
            At = systemEvent.At
        };
    }

    public static SystemEvent FromEf(this SystemEventEf systemEvent)
    {
        var eventData = SystemEventDataFactory.Create(systemEvent.Type, systemEvent.JsonData);
        var at = DateTime.SpecifyKind(systemEvent.At, DateTimeKind.Utc);
        var source = string.IsNullOrEmpty(systemEvent.UserId) ?
            SystemEventSource.FromSource(systemEvent.Source ?? string.Empty)
            : SystemEventSource.FromUser(systemEvent.UserId);

        return new SystemEvent(systemEvent.Type, systemEvent.Level, eventData, source)
        {
            Id = systemEvent.Id,
            At = at
        };
    }


    //public static OtauEf ToEf(this Otau otau)
    //{
    //    return new OtauEf
    //    {
    //        Id = otau.Id,
    //        Type = otau.Type,
    //        OcmPortIndex = otau.OcmPortIndex,
    //        PortCount = otau.PortCount,
    //        SerialNumber = otau.SerialNumber,
    //        Name = otau.Name,
    //        Location = otau.Location,
    //        Rack = otau.Rack,
    //        Shelf = otau.Shelf,
    //        Note = otau.Note,
    //        OnlineAt = otau.OnlineAt,
    //        OfflineAt = otau.OfflineAt,
    //        Ports = otau.Ports.Select(p=>p.ToEf()).ToList(),
    //        JsonData = otau.Parameters.ToJsonData()
    //    };
    //}

    public static Otau FromEf(this OtauEf otauEf)
    {
        return new Otau()
        {
            Id = otauEf.Id,
            Type = otauEf.Type,
            OcmPortIndex = otauEf.OcmPortIndex,
            PortCount = otauEf.PortCount,
            SerialNumber = otauEf.SerialNumber,
            Name = otauEf.Name,
            Location = otauEf.Location,
            Rack = otauEf.Rack,
            Shelf = otauEf.Shelf,
            Note = otauEf.Note,
            OnlineAt = otauEf.OnlineAt,
            OfflineAt = otauEf.OfflineAt,
            Ports = otauEf.Ports.Select(x => x.FromEf()).ToList(),
            Parameters = OtauParametersFactory.Create(otauEf.Type, otauEf.JsonData)
        };
    }

    public static OtauPort FromEf(this OtauPortEf portEf)
    {
        return new OtauPort
        {
            Id = portEf.Id,
            OtauId = portEf.OtauId,
            MonitoringPortId = portEf.MonitoringPortId,
            PortIndex = portEf.PortIndex,
            Unavailable = portEf.Unavailable,
        };
    }

    public static MonitoringPort FromEf(this MonitoringPortEf portEf)
    {
        return new MonitoringPort
        {
            Id = portEf.Id,
            Note = portEf.Note,
            LastRun = portEf.LastRun,
            Mode = portEf.SchedulerMode,
            Status = portEf.Status,
            Baseline = portEf.Baseline?.FromEf(),
            Interval = portEf.Interval,
            TimeSlots = portEf.TimeSlots?.Select(x => x.FromEf()).ToList() ?? new List<MonitoringTimeSlot>(),
            OtauPortId = portEf.OtauPort.Id,
            OtauId = portEf.OtauPort.OtauId,
            AlarmProfileId = portEf.AlarmProfileId,
        };
    }

    public static MonitoringTimeSlot FromEf(this MonitoringTimeSlotEf timeSlotEf)
    {
        return new MonitoringTimeSlot
        {
            Id = timeSlotEf.Id,
            StartTime = timeSlotEf.StartTime,
            EndTime = timeSlotEf.EndTime
        };
    }

    public static MonitoringBaseline FromEf(this MonitoringBaselineEf baseline)
    {
        return new MonitoringBaseline
        {
            Id = baseline.Id,
            MonitoringPortId = baseline.MonitoringPortId,
            CreatedByUserId = baseline.CreatedByUserId,
            CreatedAt = baseline.CreatedAt,
            MeasurementSettings = baseline.MeasurementSettings,
        };
    }

    public static AlarmProfile FromEf(this AlarmProfileEf alarmProfileEf)
    {
        return new AlarmProfile()
        {
            Id = alarmProfileEf.Id,
            Name = alarmProfileEf.Name,

            Thresholds = alarmProfileEf.Thresholds.Select(t => t.FromEf()).ToList(),
        };
    }

    public static AlarmProfileEf ToEf(this AlarmProfile alarmProfile)
    {
        return new AlarmProfileEf()
        {
            Id = alarmProfile.Id,
            Name = alarmProfile.Name,

            Thresholds = alarmProfile.Thresholds.Select(t => t.ToEf()).ToList(),
        };
    }

    public static Threshold FromEf(this ThresholdEf thresholdEf)
    {
        return new Threshold()
        {
            Id = thresholdEf.Id,
            Parameter = thresholdEf.Parameter,
            IsMinorOn = thresholdEf.IsMinorOn,
            IsMajorOn = thresholdEf.IsMajorOn,
            IsCriticalOn = thresholdEf.IsCriticalOn,
            Minor = thresholdEf.Minor,
            Major = thresholdEf.Major,
            Critical = thresholdEf.Critical,
        };
    }

    public static ThresholdEf ToEf(this Threshold threshold)
    {
        return new ThresholdEf()
        {
            Id = threshold.Id,
            Parameter = threshold.Parameter,
            IsMinorOn = threshold.IsMinorOn,
            IsMajorOn = threshold.IsMajorOn,
            IsCriticalOn = threshold.IsCriticalOn,
            Minor = threshold.Minor,
            Major = threshold.Major,
            Critical = threshold.Critical,
        };
    }

    public static MonitoringAlarm FromEf(this MonitoringAlarmEf alarmEf)
    {
        return new MonitoringAlarm
        {
            Id = alarmEf.Id,
            AlarmGroupId = alarmEf.AlarmGroupId,
            MonitoringPortId = alarmEf.MonitoringPortId,
            MonitoringResultId = alarmEf.MonitoringResultId,
            LastChangedAt = alarmEf.LastChangedAt,
            ActiveAt = alarmEf.ActiveAt,
            ResolvedAt = alarmEf.ResolvedAt,
            Type = alarmEf.Type,
            Level = alarmEf.Level,
            Status = alarmEf.Status,
            DistanceMeters = alarmEf.DistanceMeters,
            Events = alarmEf.Events?.Select(x => x.FromEf()).ToList()
        };
    }

    public static MonitoringAlarmEvent FromEf(this MonitoringAlarmEventEf alarmEventEf)
    {
        return new MonitoringAlarmEvent
        {
            Id = alarmEventEf.Id,
            MonitoringAlarmGroupId = alarmEventEf.MonitoringAlarmGroupId,
            MonitoringPortId = alarmEventEf.MonitoringPortId,
            MonitoringAlarmId = alarmEventEf.MonitoringAlarmId,
            MonitoringResultId = alarmEventEf.MonitoringResultId,
            Type = alarmEventEf.Type,
            DistanceMeters = alarmEventEf.DistanceMeters,
            At = alarmEventEf.At,
            OldLevel = alarmEventEf.OldLevel,
            Level = alarmEventEf.Level,
            OldStatus = alarmEventEf.OldStatus,
            Status = alarmEventEf.Status,
            Change = alarmEventEf.Change
        };
    }


    public static NotificationSettingsEf ToEf(this NotificationSettings notificationSettings)
    {
        return new NotificationSettingsEf()
        {
            Id = notificationSettings.Id,
            EmailServer = notificationSettings.EmailServer!.ToJsonData(),
            TrapReceiver = notificationSettings.TrapReceiver!.ToJsonData(),
        };
    }

    public static NotificationSettings FromEf(this NotificationSettingsEf notificationSettingsEf)
    {
        var settings = new NotificationSettings()
        {
            Id = notificationSettingsEf.Id,

        };
        settings.EmailServer = JsonSerializer.Deserialize<EmailServer>(notificationSettingsEf.EmailServer)!;
        settings.TrapReceiver = JsonSerializer.Deserialize<TrapReceiver>(notificationSettingsEf.TrapReceiver)!;

        return settings;
    }

}