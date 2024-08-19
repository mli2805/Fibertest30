using P = Fibertest30.Application.ApplicationPermission;
using R = Fibertest30.Application.ApplicationDefaultRole;

namespace Fibertest30.Application;

public static class ApplicationDefaultPermissions
{
    private static readonly Dictionary<ApplicationPermission, List<ApplicationDefaultRole>> _map = new();
    public static IReadOnlyDictionary<ApplicationPermission, List<ApplicationDefaultRole>> Map => _map;

    static ApplicationDefaultPermissions()
    {
        // Add all possible roles to the map
        // Don't specify the Administrator (it will be done automatically)

        AddPermission(P.ChangeRtuSettings);



        AddPermission(P.ConfigureOtau);
        AddPermission(P.SetupMonitoringThresholds, R.Operator);
        AddPermission(P.HandleAlarm, R.Operator);
        AddPermission(P.ViewDataLog, R.Operator, R.Supervisor);
        AddPermission(P.ChangeMonitoringPortSettings, R.Operator);
        AddPermission(P.ViewMonitoringPortSettings, R.Operator, R.Supervisor);
        AddPermission(P.ReceiveOpticalNotifications, R.Operator, R.Supervisor, R.NotificationReceiver);
        AddPermission(P.ReceiveSystemNotifications);
        AddPermission(P.EditUsers);
        AddPermission(P.ChangeNotificationSettings);
        AddPermission(P.ChangeNetworkSettings);
        AddPermission(P.ChangeTimeSettings);
        AddPermission(P.EditPortLabels, R.Operator);

        AddPermission(P.CheckRtuConnection, R.Operator, R.Supervisor);
        AddPermission(P.InitializeRtu, R.Operator);
        AddPermission(P.DoMeasurementClient, R.Operator);
    }

    private static void AddPermission(ApplicationPermission permission, params ApplicationDefaultRole[] roles)
    {
        var explicitlyListed = roles.ToList();
        explicitlyListed.Add(R.Root);

        _map.Add(permission, explicitlyListed);
    }

    public static List<ApplicationPermission> GetPermissionsByRole(ApplicationDefaultRole role)
    {
        return _map.Where(x => x.Value.Contains(role)).Select(x => x.Key).ToList();
    }
}



