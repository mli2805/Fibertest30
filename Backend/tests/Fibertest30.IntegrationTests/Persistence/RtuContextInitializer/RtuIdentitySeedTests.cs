
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace Fibertest30.IntegrationTests;

[TestClass]
public class RtuIdentitySeedTests : SqliteTestBase
{
    [TestMethod]
    public async Task Roles_FirstSeed()
    {
        await SeedUsingRtuContextInitializer();

        var roles = _roleManager.Roles.ToList();

        _permissionProvider.DefaultRoles.Select(x => x.ToString())
            .Should().Equal(roles.Select(x => x.Name));
    }

    [TestMethod]
    public async Task Roles_SecondSeed_ChangeNothing()
    {
        await SeedUsingRtuContextInitializer();
        await SeedUsingRtuContextInitializer();

        var roles = _roleManager.Roles.ToList();
        _permissionProvider.DefaultRoles.Select(x => x.ToString())
              .Should().Equal(roles.Select(x => x.Name));
    }

    [TestMethod]
    public async Task CustomRoleIsPreservedAfterSeed()
    {
        await _roleManager.CreateAsync(new IdentityRole("CustomRole"));

        await SeedUsingRtuContextInitializer();

        _roleManager.Roles.Count().Should().Be(_permissionProvider.DefaultRoles.Count + 1);
    }

    [TestMethod]
    public async Task DefaultRoleNotRemoved()
    {
        await SeedUsingRtuContextInitializer();

        var defaultRoles = _permissionProvider.DefaultRoles;
        var newDefaultRoles = defaultRoles.Take(defaultRoles.Count - 1).ToList();

        _mockPermissionProvier.Setup(x => x.DefaultRoles).Returns(newDefaultRoles);

        await SeedUsingRtuContextInitializer();

        _roleManager.Roles.Select(x => x.Name)
            .Should().Equal(defaultRoles.Select(x => x.ToString()));
    }

    [TestMethod]
    public async Task CustomRole_RevokedPermissionRemoved_PreservedPermissionKept_AfterSeeding()
    {
        var preservedPermission = ApplicationPermission.HandleAlarm;
        var revokedPermission = ApplicationPermission.InitializeRtu;

        await _roleManager.CreateAsync(new IdentityRole("CustomRole"));
        var customRole = _roleManager.Roles.Single(x => x.Name == "CustomRole");
        await _roleManager.AddClaimAsync(customRole, 
            new Claim(ApplicationClaims.Permissions, preservedPermission.ToString()));
        await _roleManager.AddClaimAsync(customRole,
            new Claim(ApplicationClaims.Permissions, revokedPermission.ToString()));


        _mockPermissionProvier
            .SetupGet(x => x.AllPermissions)
            .Returns(() =>
            {
                var permissions = _permissionProvider.AllPermissions;
                permissions.Remove(revokedPermission);
                return permissions;
            });

        await SeedUsingRtuContextInitializer();

        var identityRole = _roleManager.Roles.Single(x => x.Name == customRole.ToString());
        _roleManager.GetClaimsAsync(identityRole).Result
            .Should().NotContain(x => x.Value == revokedPermission.ToString())
            .And.Contain(x => x.Value == preservedPermission.ToString());
    }

    [TestMethod]
    public async Task TestUsers_FirstSeed()
    {
        await SeedUsingRtuContextInitializer();

        foreach (var testUser in TestUsersProvider.TestUsers)
        {
            var user = await _userManager.FindByNameAsync(testUser.UserName);
            user.Should().NotBeNull();
        }
    }

    [TestMethod]
    public async Task TestUsers_SecondSeed()
    {
        await SeedUsingRtuContextInitializer();
        await SeedUsingRtuContextInitializer();

        _userManager.Users.Count()
            .Should().Be(TestUsersProvider.TestUsers.Count);
    }
}
