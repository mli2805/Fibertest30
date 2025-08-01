using System.Collections.Immutable;

namespace Fibertest30.Application;

public static class SystemEventSupportedNotificationRules
{
    public static IReadOnlyDictionary<SystemEventType, IReadOnlyDictionary<NotificationChannel, NotificationTarget>> Map { get; }
        = new Dictionary<SystemEventType, IReadOnlyDictionary<NotificationChannel, NotificationTarget>>()
    {

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
            SystemEventType.NotificationSettingsUpdated,
            Rules(Rule(NotificationChannel.InAppInternal, NotificationTarget.All))
        },
      
       
        {
            SystemEventType.RtuConnectionChecked,
            Rules(Rule(NotificationChannel.InAppInternal, NotificationTarget.All))
        },
        {
            SystemEventType.RtuInitialized,
            Rules(Rule(NotificationChannel.InAppInternal, NotificationTarget.All))
        },
        {
            SystemEventType.MeasurementClientDone,
            Rules(Rule(NotificationChannel.InAppInternal, NotificationTarget.Me))
        },
        {
            SystemEventType.MonitoringStopped,
            Rules(Rule(NotificationChannel.InAppInternal, NotificationTarget.All))
        },
        {
            SystemEventType.MonitoringSettingsApplied,
            Rules(Rule(NotificationChannel.InAppInternal, NotificationTarget.All))
        },
        {
            SystemEventType.BaseRefsAssigned,
            Rules(Rule(NotificationChannel.InAppInternal, NotificationTarget.All))
        },
        {
            SystemEventType.TraceAttached,
            Rules(Rule(NotificationChannel.InAppInternal, NotificationTarget.All))
        },
        {
            SystemEventType.TraceDetached,
            Rules(Rule(NotificationChannel.InAppInternal, NotificationTarget.All))
        },
        {
            SystemEventType.OtauAttached,
            Rules(Rule(NotificationChannel.InAppInternal, NotificationTarget.All))
        },
        {
            SystemEventType.OtauDetached,
            Rules(Rule(NotificationChannel.InAppInternal, NotificationTarget.All))
        },
        {
            SystemEventType.TraceAdded,
            Rules(Rule(NotificationChannel.InAppInternal, NotificationTarget.All))
        },
        {
            SystemEventType.TraceCleaned,
            Rules(Rule(NotificationChannel.InAppInternal, NotificationTarget.All))
        },
        {
            SystemEventType.TraceRemoved,
            Rules(Rule(NotificationChannel.InAppInternal, NotificationTarget.All))
        },
        {
            SystemEventType.RtuAdded,
            Rules(Rule(NotificationChannel.InAppInternal, NotificationTarget.All))
        },
        {
            SystemEventType.RtuUpdated,
            Rules(Rule(NotificationChannel.InAppInternal, NotificationTarget.All))
        },
        {
            SystemEventType.RtuAddressCleared,
            Rules(Rule(NotificationChannel.InAppInternal, NotificationTarget.All))
        },
        {
            SystemEventType.RtuRemoved,
            Rules(Rule(NotificationChannel.InAppInternal, NotificationTarget.All))
        }, 
        {
            SystemEventType.TraceStateChanged,
            Rules(Rule(NotificationChannel.InAppInternal, NotificationTarget.All))
        },
        {
            SystemEventType.NetworkEventAdded,
            Rules(Rule(NotificationChannel.InAppInternal, NotificationTarget.All))
        },
        {
            SystemEventType.BopNetworkEventAdded,
            Rules(Rule(NotificationChannel.InAppInternal, NotificationTarget.All))
        },
        {
            SystemEventType.RtuStateAccidentAdded,
            Rules(Rule(NotificationChannel.InAppInternal, NotificationTarget.All))
        },
        {
            SystemEventType.LandmarksUpdateProgressed,
            Rules(Rule(NotificationChannel.InAppInternal, NotificationTarget.All))
        },
        {
            SystemEventType.MeasurementAdded,
            Rules(Rule(NotificationChannel.InAppInternal, NotificationTarget.All))
        },
        {
            SystemEventType.MeasurementUpdated,
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