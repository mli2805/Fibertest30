namespace Fibertest30.IntegrationTests;

[TestClass]
public class UserRolePermissionProviderTests : SqliteTestBase
{
    [TestMethod]
    public async Task CheckViewerPermissions()
    {
        await SeedUsingRtuContextInitializer();

        var provider = new UserRolePermissionProvider(_permissionProvider, _userManager, _roleManager);
        
        await TestDefaultRolePermission(provider, ApplicationDefaultRole.Administrator);
        await TestDefaultRolePermission(provider, ApplicationDefaultRole.User);
        await TestDefaultRolePermission(provider, ApplicationDefaultRole.Viewer);
        await TestDefaultRolePermission(provider, ApplicationDefaultRole.NotificationReceiver);
    }

    private async Task TestDefaultRolePermission(UserRolePermissionProvider provider
        , ApplicationDefaultRole defaultRole)
    {
        var username = TestUsersProvider.GetFirstUserByRole(defaultRole).UserName;
        var user = await _userManager.FindByNameAsync(username);
        var singleRole = await provider.GetUserSingleRole(user!);
        singleRole.Name.Should().Be(defaultRole.ToString());

        var rolePermissions = await provider.GetRolePermissions(singleRole.Name);
        var userPermissions = await provider.GetUserPermissions(user!);

        rolePermissions.Should().Equal(userPermissions);

        var allPermissions = _permissionProvider.AllPermissions;
        var unsetPermissions = allPermissions.Except(rolePermissions).ToList();

        rolePermissions.Select(x => provider.HasPermission(singleRole.Name, x).Result)
            .Count(x => x).Should().Be(rolePermissions.Count);

        unsetPermissions.Select(x => provider.HasPermission(singleRole.Name, x).Result)
            .Count(x => !x).Should().Be(unsetPermissions.Count);
    }
}