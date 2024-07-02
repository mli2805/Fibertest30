using System.Text.Json;

namespace Fibertest30.Api;

public static class AlarmMappingExtensions
{
    public static MonitoringAlarmType ToProto(this Fibertest30.Application.MonitoringAlarmType type)
    {
        return type switch
        {
            Fibertest30.Application.MonitoringAlarmType.EventLoss => MonitoringAlarmType.EventLoss,
            Fibertest30.Application.MonitoringAlarmType.TotalLoss => MonitoringAlarmType.TotalLoss,
            Fibertest30.Application.MonitoringAlarmType.EventReflectance => MonitoringAlarmType.EventReflectance,
            Fibertest30.Application.MonitoringAlarmType.SectionAttenuation => MonitoringAlarmType.SectionAttenuation,
            Fibertest30.Application.MonitoringAlarmType.SectionLoss => MonitoringAlarmType.SectionLoss,
            Fibertest30.Application.MonitoringAlarmType.SectionLengthChange => MonitoringAlarmType
                .SectionLengthChange,
            Fibertest30.Application.MonitoringAlarmType.PortHealth => MonitoringAlarmType.PortHealth,
            Fibertest30.Application.MonitoringAlarmType.FiberBreak => MonitoringAlarmType.FiberBreak,
            Fibertest30.Application.MonitoringAlarmType.NewEvent => MonitoringAlarmType.NewEvent,
            Fibertest30.Application.MonitoringAlarmType.NewEventAfterEof => MonitoringAlarmType.NewEventAfterEof,
            _ => throw new ArgumentOutOfRangeException()
        };
    }

    public static MonitoringAlarmLevel ToProto(this Fibertest30.Application.MonitoringAlarmLevel type)
    {
        return type switch
        {
            Fibertest30.Application.MonitoringAlarmLevel.Minor => MonitoringAlarmLevel.Minor,
            Fibertest30.Application.MonitoringAlarmLevel.Major => MonitoringAlarmLevel.Major,
            Fibertest30.Application.MonitoringAlarmLevel.Critical => MonitoringAlarmLevel.Critical,
            _ => throw new ArgumentOutOfRangeException()
        };
    }
    
    public static MonitoringAlarmStatus ToProto(this Fibertest30.Application.MonitoringAlarmStatus type)
    {
        return type switch
        {
            Fibertest30.Application.MonitoringAlarmStatus.Active => MonitoringAlarmStatus.Active,
            Fibertest30.Application.MonitoringAlarmStatus.Resolved => MonitoringAlarmStatus.Resolved,
            _ => throw new ArgumentOutOfRangeException()
        };
    }

    public static Fibertest30.Application.MonitoringAlarmLevel FromProto(this MonitoringAlarmLevel level)
    {
        return level switch
        {
            MonitoringAlarmLevel.Minor => Fibertest30.Application.MonitoringAlarmLevel.Minor,
            MonitoringAlarmLevel.Major => Fibertest30.Application.MonitoringAlarmLevel.Major,
            MonitoringAlarmLevel.Critical => Fibertest30.Application.MonitoringAlarmLevel.Critical,
            _ => throw new ArgumentOutOfRangeException()
        };
    }
    
    public static MonitoringAlarmEvent ToProto(this Fibertest30.Application.MonitoringAlarmEvent alarmEvent)
    {
        var proto = new MonitoringAlarmEvent
        {
            Id = alarmEvent.Id,
            MonitoringAlarmGroupId = alarmEvent.MonitoringAlarmGroupId,
            MonitoringPortId = alarmEvent.MonitoringPortId,
            MonitoringAlarmId = alarmEvent.MonitoringAlarmId,
            MonitoringResultId = alarmEvent.MonitoringResultId,
            Type = alarmEvent.Type.ToProto(),
            DistanceMeters = alarmEvent.DistanceMeters,
            At = alarmEvent.At.ToTimestamp(),
            OldLevel = alarmEvent.OldLevel.HasValue 
                ? new MonitoringAlarmLevelWrapper { Value = alarmEvent.OldLevel.Value.ToProto()} : null,
            Level = alarmEvent.Level.ToProto(),
            OldStatus = alarmEvent.OldStatus.HasValue 
                ? new MonitoringAlarmStatusWrapper { Value = alarmEvent.OldStatus.Value.ToProto()} : null,
            Status = alarmEvent.Status.ToProto(), 
            JsonChange = alarmEvent.Change != null 
                ? JsonSerializer.Serialize(alarmEvent.Change, JsonSerializerEx.SerializerOptionsForWeb) : string.Empty
        };

        return proto;
    }
    
    public static MonitoringAlarm ToProto(this Fibertest30.Application.MonitoringAlarm alarm)
    {
        var proto = new MonitoringAlarm()
        {
            Id = alarm.Id,
            AlarmGroupId = alarm.AlarmGroupId,
            MonitoringPortId = alarm.MonitoringPortId,
            MonitoringResultId = alarm.MonitoringResultId,
            LastChangedAt = alarm.LastChangedAt.ToTimestamp(),
            ActiveAt = alarm.ActiveAt.ToTimestamp(),
            ResolvedAt = alarm.ResolvedAt.ToTimestamp(),
            Type = alarm.Type.ToProto(),
            Level = alarm.Level.ToProto(),
            Status = alarm.Status.ToProto(),
            DistanceMeters = alarm.DistanceMeters,
        };

        proto.Events.AddRange(alarm.Events?.Select(x => x.ToProto()) ?? Enumerable.Empty<MonitoringAlarmEvent>());
        return proto;
    }
}