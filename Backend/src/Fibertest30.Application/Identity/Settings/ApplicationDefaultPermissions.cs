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
        AddPermission(P.PerformOnDemandTest, R.User);
        AddPermission(P.SetupMonitoringThresholds, R.User);
        AddPermission(P.HandleAlarm, R.User);
        AddPermission(P.ViewDataLog, R.User, R.Viewer);
        AddPermission(P.ChangeMonitoringPortSettings, R.User);
        AddPermission(P.ViewMonitoringPortSettings, R.User, R.Viewer);
        AddPermission(P.ReceiveOpticalNotifications, R.User, R.Viewer, R.NotificationReceiver);
        AddPermission(P.ReceiveSystemNotifications);
        AddPermission(P.EditUsers);
        AddPermission(P.ChangeNotificationSettings);
        AddPermission(P.ChangeNetworkSettings);
        AddPermission(P.ChangeTimeSettings);
        AddPermission(P.EditPortLabels, R.User);

        AddPermission(P.CheckRtuConnection, R.User, R.Viewer);
        AddPermission(P.InitializeRtu, R.User);
        AddPermission(P.DoMeasurementClient, R.User);
    }

    private static void AddPermission(ApplicationPermission permission, params ApplicationDefaultRole[] roles)
    {
        var withAdmin = roles.ToList();
        withAdmin.Add(R.Administrator);

        _map.Add(permission, withAdmin);
    }

    public static List<ApplicationPermission> GetPermissionsByRole(ApplicationDefaultRole role)
    {
        return _map.Where(x => x.Value.Contains(role)).Select(x => x.Key).ToList();
    }
}



