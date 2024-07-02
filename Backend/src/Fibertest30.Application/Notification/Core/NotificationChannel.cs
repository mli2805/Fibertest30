namespace Fibertest30.Application;

// There are two kind of InApp notifications: InAppInternal & InApp
// InAppInternal has always sent, because application logic depends on it
// InApp is sent only if an user enabled it in the notification settings

public enum NotificationChannel
{
    InAppInternal,
    InApp,
    Email,
    Sms,
    Snmp,
    Push
}