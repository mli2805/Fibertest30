using System.Collections.Immutable;

namespace Fibertest30.Application;

public static class SystemEventSupportedNotificationRules
{
    public static IReadOnlyDictionary<SystemEventType, IReadOnlyDictionary<NotificationChannel, NotificationTarget>> Map { get; }
        = new Dictionary<SystemEventType, IReadOnlyDictionary<NotificationChannel, NotificationTarget>>()
    {
        {
            SystemEventType.OnDemandFailed,
            Rules()
        },
        {
            SystemEventType.OnDemandCompleted,
            Rules(Rule(NotificationChannel.InApp, NotificationTarget.Others))
        },
        {
            SystemEventType.UserChanged,
            Rules(
                Rule(NotificationChannel.InAppInternal, NotificationTarget.All),
                Rule(NotificationChannel.InApp, NotificationTarget.Others))
        },
        {
            SystemEventType.UserCreated,
            Rules(
                Rule(NotificationChannel.InAppInternal, NotificationTarget.All),
                Rule(NotificationChannel.InApp, NotificationTarget.Others))
        },
        {
            SystemEventType.UserDeleted,
            Rules(
                Rule(NotificationChannel.InAppInternal, NotificationTarget.All),
                Rule(NotificationChannel.InApp, NotificationTarget.Others))
        },
        {
            SystemEventType.OtauConnectionStatusChanged,
            Rules(
                Rule(NotificationChannel.InAppInternal, NotificationTarget.All),
                Rule(NotificationChannel.InApp, NotificationTarget.All))
        },
        {
            SystemEventType.OtauChanged,
            Rules(
                Rule(NotificationChannel.InAppInternal, NotificationTarget.All),
                Rule(NotificationChannel.InApp, NotificationTarget.All))
        },
        {
            SystemEventType.OtauInformationChanged,
            Rules(
                Rule(NotificationChannel.InAppInternal, NotificationTarget.All)
                )
        },
        {
            SystemEventType.OtauAdded,
            Rules(
                Rule(NotificationChannel.InAppInternal, NotificationTarget.All),
                Rule(NotificationChannel.InApp, NotificationTarget.Others))
        },
        {
            SystemEventType.OtauRemoved,
            Rules(
                Rule(NotificationChannel.InAppInternal, NotificationTarget.All),
                Rule(NotificationChannel.InApp, NotificationTarget.Others))
        },
        {
            SystemEventType.MonitoringPortStatusChanged,
            Rules(
                Rule(NotificationChannel.InAppInternal, NotificationTarget.All)
                )
        },
        {
            SystemEventType.MonitoringPortScheduleChanged,
            Rules(
                Rule(NotificationChannel.InAppInternal, NotificationTarget.All)
                )
        },
        {
            SystemEventType.MonitoringPortAlarmProfileChanged,
            Rules(
                Rule(NotificationChannel.InAppInternal, NotificationTarget.All)
                )
        },
        {
            SystemEventType.MonitoringPortNoteChanged,
            Rules(
                Rule(NotificationChannel.InAppInternal, NotificationTarget.All)
            )
        },
        {
            SystemEventType.BaselineFailed,
            Rules(Rule(NotificationChannel.InApp, NotificationTarget.Me))
        },
        {
            SystemEventType.BaselineCompleted,
            Rules(Rule(NotificationChannel.InApp, NotificationTarget.All))
        },
        {
            SystemEventType.OtdrTaskProgress,
            Rules(Rule(NotificationChannel.InAppInternal, NotificationTarget.All))
        },
        {
            SystemEventType.AlarmProfileChanged,
            Rules(Rule(NotificationChannel.InAppInternal, NotificationTarget.All))
        },
        {
            SystemEventType.AlarmProfileCreated,
            Rules(Rule(NotificationChannel.InAppInternal, NotificationTarget.All))
        },
        {
            SystemEventType.AlarmProfileDeleted,
            Rules(Rule(NotificationChannel.InAppInternal, NotificationTarget.All))
        },
        {
            SystemEventType.NotificationSettingsUpdated,
            Rules(Rule(NotificationChannel.InAppInternal, NotificationTarget.All))
        },
        {
            SystemEventType.UnsupportedOsmModuleConnected,
            Rules(Rule(NotificationChannel.InAppInternal, NotificationTarget.All),
                Rule(NotificationChannel.InApp, NotificationTarget.Others))
        },
        {
            SystemEventType.NetworkSettingsUpdated,
            Rules(Rule(NotificationChannel.InAppInternal, NotificationTarget.All))
        },
        {
            SystemEventType.NtpSettingsUpdated,
            Rules(Rule(NotificationChannel.InAppInternal, NotificationTarget.All))
        },
        {
            SystemEventType.TimeSettingsUpdated,
            Rules(Rule(NotificationChannel.InAppInternal, NotificationTarget.All))
        },
        {
            SystemEventType.PortLabelAttached,
            Rules(Rule(NotificationChannel.InApp, NotificationTarget.All))
        },
        {
            SystemEventType.PortLabelUpdated,
            Rules(Rule(NotificationChannel.InApp, NotificationTarget.All))
        },
        {
            SystemEventType.PortLabelDetached,
            Rules(Rule(NotificationChannel.InApp, NotificationTarget.All))
        },
        {
            SystemEventType.RtuConnectionChecked,
            Rules(Rule(NotificationChannel.InAppInternal, NotificationTarget.All))
        },
        {
            SystemEventType.RtuInitialized,
            Rules(Rule(NotificationChannel.InAppInternal, NotificationTarget.All))
        }
    };

    private class NotificationRule
    {
        public NotificationChannel Channel { get; set; }
        public NotificationTarget Target { get; set; }
    }
    private static NotificationRule Rule(NotificationChannel channel, NotificationTarget target)
    {
        return new NotificationRule { Channel = channel, Target = target };
    }
    private static IReadOnlyDictionary<NotificationChannel, NotificationTarget> Rules(params NotificationRule[] rules)
    {
        return rules.ToImmutableDictionary(x => x.Channel, x => x.Target);
    }
}