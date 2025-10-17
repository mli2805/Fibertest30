using Iit.Fibertest.Dto;
using Iit.Fibertest.Graph;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Fibertest30.Infrastructure;
public class ServerDbContextInitializer(IHostEnvironment environment, 
    ILogger<ServerDbContextInitializer> logger, ServerDbContext context,
    IDefaultPermissionProvider permissionProvider, UserManager<ApplicationUser> userManager,
    RoleManager<IdentityRole> roleManager)
{
    public async Task InitializeAsync()
    {
        try
        {
            await context.Database.EnsureCreatedAsync();
            //await context.Database.MigrateAsync();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while initializing the database.");
            throw;
        }
    }

    public async Task SeedAsync(List<User> ft20Users)
    {
        try
        {
            await TrySeedAsync(ft20Users);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while seeding the database.");
            throw;
        }
    }

    private async Task TrySeedAsync(List<User> ft20Users)
    {
        // NOTE: It is called at each start
        // Don't forget to check if seed is needed

        await SeedDefaultRolesAndPermissions();
        await SeedEmptyNotificationSettings();

        var userCount = await userManager.Users.CountAsync();
        if (userCount == 0)
        {
            if (ft20Users.Count > 0)
            {
                // установка 3.0 на подложенную базу 2.0
                await SeedUsersFromFibertest20(ft20Users);
            }
            else
            {
                // чистая установка 3.0 
                await SeedAdministratorUser("root", "root");
                await SeedAdministratorUser("developer", "cde3$RFV");
            }
        }

        if (environment.IsDevelopment())
        {
            await SeedDemoUsers();
        }

        await context.SaveChangesAsync();
    }

    private async Task SeedDemoUsers()
    {
        var users = await userManager.Users.ToListAsync();

        // Seed users for development needs.
        foreach (var testUser in TestUsersProvider.TestUsers)
        {
            if (users.FirstOrDefault(u=>u.UserName == testUser.UserName) != null) continue;

            var currentUser = await userManager.FindByNameAsync(testUser.UserName);
            if (currentUser == null)
            {
                var user = new ApplicationUser
                {
                    UserName = testUser.UserName,
                    FirstName = testUser.FirstName,
                    LastName = testUser.LastName,
                    JobTitle = testUser.JobTitle,
                    Email = testUser.Email,
                    PhoneNumber = testUser.PhoneNumber
                };
                var result = await CreateUserWithLoosePassword(user, testUser.Password);
                ThrowIfNotSucceed(result, $"Can't create {user.UserName} user");


                result = await userManager.AddToRoleAsync(user, testUser.Role.ToString());
                ThrowIfNotSucceed(result, $"Can't add {user.UserName} user to {testUser.Role.ToString()} role");
            }
        }
    }

    private async Task SeedUsersFromFibertest20(List<User> ft20Users)
    {
        foreach (User ft20User in ft20Users)
        {
            var user = new ApplicationUser()
            {
                UserName = ft20User.Title,
                Email = ft20User.Email.Address,
                PhoneNumber = ft20User.Sms.PhoneNumber,
                ZoneId = ft20User.ZoneId
                
            };

            // пароль хранился зашифрованный, поэтому создаем пользователя с паролем совпадающим с именем
            var result = await CreateUserWithLoosePassword(user, ft20User.Title);
            ThrowIfNotSucceed(result, $"Can't create {user.UserName} user");


            result = await userManager.AddToRoleAsync(user, GetNewRole(ft20User.Role).ToString());
            ThrowIfNotSucceed(result, $"Can't add {user.UserName} user to {ft20User.Role} role");
        }
    }

    private async Task SeedDefaultRolesAndPermissions()
    {
        // add a new default role if doesn't exist 
        var defaultRoles = permissionProvider.DefaultRoles.Select(x => x.ToString()).ToList();
        foreach (var defaultRole in defaultRoles)
        {

            if (!(await roleManager.RoleExistsAsync(defaultRole)))
            {
                var result = await roleManager.CreateAsync(new IdentityRole(defaultRole));
                ThrowIfNotSucceed(result, $"Can't add {defaultRole} role");
            }
        }

        // NOTE: we don't need to add permissions to defaultRoles
        // as we they are known at compile time and not supposed to be changed dynamically

        // Also we don't need to add a new permission for a custom role
        // But we should remove missed permission from custom roles


        var customRoles = roleManager.Roles.ToList().Where(x => !defaultRoles.Exists(y => y == x.Name)).ToList();
        var applicationPermissions = permissionProvider.AllPermissions;

        foreach (var customRole in customRoles)
        {
            var roleCurrentClaims = await roleManager.GetClaimsAsync(customRole);
            var rolePermissionClaims = roleCurrentClaims.Where(x => x.Type == ApplicationClaims.Permissions);
            foreach (var rolePermissionClaim in rolePermissionClaims)
            {
                var notExistAnymore = applicationPermissions
                    .All(x => x.ToString() != rolePermissionClaim.Value);
                if (notExistAnymore)
                {
                    var result = await roleManager.RemoveClaimAsync(customRole, rolePermissionClaim);
                    ThrowIfNotSucceed(result, $"Can't remove {rolePermissionClaim.Value} permission from {customRole.Name} role");
                }
            }
        }
    }

    private ApplicationDefaultRole GetNewRole(Role role)
    {
        switch (role)
        {
            case Role.Developer:
            case Role.Root: return ApplicationDefaultRole.Root;
            case Role.Operator: return ApplicationDefaultRole.Operator;
            case Role.Supervisor: return ApplicationDefaultRole.Supervisor;
            case Role.NotificationReceiver: return ApplicationDefaultRole.NotificationReceiver;
        }

        return ApplicationDefaultRole.NotificationReceiver;
    }

    private async Task SeedAdministratorUser(string login, string password)
    {
        var adminRole = ApplicationDefaultRole.Root;

        var user = new ApplicationUser
        {
            UserName = login,
        };

        var result = await CreateUserWithLoosePassword(user, password);
        ThrowIfNotSucceed(result, $"Can't create {user.UserName} user");

        result = await userManager.AddToRoleAsync(user, adminRole.ToString());
        ThrowIfNotSucceed(result, $"Can't add {user.UserName} user to {adminRole.ToString()} role");
    }

    private async Task<IdentityResult> CreateUserWithLoosePassword(ApplicationUser user, string password)
    {
        var originalPasswordOptions = userManager.Options.Password;
        userManager.Options.Password = GetLoosePasswordOptions();
        var result = await userManager.CreateAsync(user, password);
        userManager.Options.Password = originalPasswordOptions;
        return result;
    }

    private PasswordOptions GetLoosePasswordOptions()
    {
        return new PasswordOptions
        {
            RequireDigit = false,
            RequiredLength = 1,
            RequireLowercase = false,
            RequireUppercase = false,
            RequireNonAlphanumeric = false,
            RequiredUniqueChars = 1
        };
    }

    private async Task SeedEmptyNotificationSettings()
    {
        if (await context.NotificationSettings.AnyAsync()) return;

        var emailServer = new EmailServer
        {
            Enabled = false,
            ServerAddress = "",
            ServerPort = 587,
            OutgoingAddress = "",
            IsAuthenticationOn = true,
            ServerUserName = "",
            IsPasswordSet = false,
            ServerPassword = "",
            VerifyCertificate = false,
            FloodingPolicy = false,
            SmsOverSmtp = false,
        };

        var trapReceiver = new TrapReceiver
        {
            Enabled = false,
            SnmpVersion = "v1",
            UseIitOid = false,
            CustomOid = "",
            Community = "",
            AuthoritativeEngineId = "",
            UserName = "",
            IsAuthPswSet = false,
            AuthenticationPassword = "",
            AuthenticationProtocol = "SHA",
            IsPrivPswSet = false,
            PrivacyPassword = "",
            PrivacyProtocol = "Aes256",
            TrapReceiverAddress = "",
            TrapReceiverPort = 162
        };

        var settings = new NotificationSettings { EmailServer = emailServer, TrapReceiver = trapReceiver, };

        context.NotificationSettings.Add(settings.ToEf());
    }



    private void ThrowIfNotSucceed(IdentityResult result, string message)
    {
        if (!result.Succeeded)
        {
            var errorDescriptions = result.Errors.Select(x => x.Description);
            var strErrorDescriptions = string.Join(Environment.NewLine, errorDescriptions);
            throw new Exception($"{message} {Environment.NewLine}Description: {strErrorDescriptions}");
        }
    }
}
