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


   

    public static NotificationSettingsEf ToEf(this NotificationSettings notificationSettings)
    {
        return new NotificationSettingsEf
        {
            Id = notificationSettings.Id,
            EmailServer = notificationSettings.EmailServer!.ToJsonData(),
            TrapReceiver = notificationSettings.TrapReceiver!.ToJsonData(),
        };
    }

    public static NotificationSettings FromEf(this NotificationSettingsEf notificationSettingsEf)
    {
        var settings = new NotificationSettings
        {
            Id = notificationSettingsEf.Id,

        };
        settings.EmailServer = JsonSerializer.Deserialize<EmailServer>(notificationSettingsEf.EmailServer)!;
        settings.TrapReceiver = JsonSerializer.Deserialize<TrapReceiver>(notificationSettingsEf.TrapReceiver)!;

        return settings;
    }

}