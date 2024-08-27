using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Fibertest30.Infrastructure;
public class RtuContextInitializer
{
    private readonly ILogger<RtuContextInitializer> _logger;
    private readonly RtuContext _context;
    private readonly IDefaultPermissionProvider _permissionProvider;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;

    public RtuContextInitializer(
        ILogger<RtuContextInitializer> logger,
        RtuContext context,
        IDefaultPermissionProvider permissionProvider,
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager
        )
    {
        _logger = logger;
        _context = context;
        _permissionProvider = permissionProvider;
        _userManager = userManager;
        _roleManager = roleManager;
    }

    public async Task InitialiseAsync()
    {
        try
        {
            await _context.Database.EnsureCreatedAsync();
            // await _context.Database.MigrateAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while initializing the database.");
            throw;
        }
    }

    public async Task SeedAsync(string seedDemoOtaus = "", bool seedDemoUsers = false)
    {
        try
        {
            await TrySeedAsync(seedDemoOtaus, seedDemoUsers);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while seeding the database.");
            throw;
        }
    }

    private async Task TrySeedAsync(string seedDemoOtaus, bool seedDemoUsers)
    {
        // NOTE: It is called at each start
        // Don't forget to check if seed is needed

        await SeedDefaultRolesAndPermissions();
        await SeedEmptyNotificationSettings();

       

        if (seedDemoUsers)
        {
            await SeedDemoUsers();
        }
        else
        {
            await SeedAdministratorUser();
        }

        await _context.SaveChangesAsync();
    }

    private async Task SeedDefaultRolesAndPermissions()
    {
        // add a new default role if doesn't exist 
        var defaultRoles = _permissionProvider.DefaultRoles.Select(x => x.ToString()).ToList();
        foreach (var defaultRole in defaultRoles)
        {

            if (!(await _roleManager.RoleExistsAsync(defaultRole)))
            {
                var result = await _roleManager.CreateAsync(new IdentityRole(defaultRole));
                ThrowIfNotSucceed(result, $"Can't add {defaultRole} role");
            }
        }

        // NOTE: we don't need to add permissions to defaultRoles
        // as we they are known at compile time and not supposed to be changed dynamically

        // Also we don't need to add a new permission for a custom role
        // But we should remove missed permission from custom roles


        var customRoles = _roleManager.Roles.ToList().Where(x => !defaultRoles.Exists(y => y == x.Name)).ToList();
        var applicationPermissions = _permissionProvider.AllPermissions;

        foreach (var customRole in customRoles)
        {
            var roleCurrentClaims = await _roleManager.GetClaimsAsync(customRole);
            var rolePermissionClaims = roleCurrentClaims.Where(x => x.Type == ApplicationClaims.Permissions);
            foreach (var rolePermissionClaim in rolePermissionClaims)
            {
                var notExistAnymore = !applicationPermissions.Any(x => x.ToString() == rolePermissionClaim.Value);
                if (notExistAnymore)
                {
                    var result = await _roleManager.RemoveClaimAsync(customRole, rolePermissionClaim);
                    ThrowIfNotSucceed(result, $"Can't remove {rolePermissionClaim.Value} permission from {customRole.Name} role");
                }
            }
        }
    }

 
    private async Task SeedDemoUsers()
    {
        var userCount = await _userManager.Users.CountAsync();
        if (userCount > 0) { return;} 
        
        // Seed users for test needs.
        foreach (var testUser in TestUsersProvider.TestUsers)
        {
            var currentUser = await _userManager.FindByNameAsync(testUser.UserName);
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
                var result = await CreateUserWithLoosePassword(user, TestUsersProvider.DefaultRootPassword);
                ThrowIfNotSucceed(result, $"Can't create {user.UserName} user");


                result = await _userManager.AddToRoleAsync(user, testUser.Role.ToString());
                ThrowIfNotSucceed(result, $"Can't add {user.UserName} user to {testUser.Role.ToString()} role");
            }
        }
    }

    private async Task SeedAdministratorUser()
    {
        var userCount = await _userManager.Users.CountAsync();
        if (userCount > 0) { return;} 

        var adminRole = ApplicationDefaultRole.Root;

        var user = new ApplicationUser
        {
            UserName = "root",
        };

        var result = await CreateUserWithLoosePassword(user, TestUsersProvider.DefaultRootPassword);
        ThrowIfNotSucceed(result, $"Can't create {user.UserName} user");

        result = await _userManager.AddToRoleAsync(user, adminRole.ToString());
        ThrowIfNotSucceed(result, $"Can't add {user.UserName} user to {adminRole.ToString()} role");
    }

    private async Task<IdentityResult> CreateUserWithLoosePassword(ApplicationUser user, string password)
    {
        var originalPasswordOptions = _userManager.Options.Password;
        _userManager.Options.Password = GetLoosePasswordOptions();
        var result = await _userManager.CreateAsync(user, password);
        _userManager.Options.Password = originalPasswordOptions;
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
        if (await _context.NotificationSettings.AnyAsync()) return;

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
            UseVeexOid = false,
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

        _context.NotificationSettings.Add(settings.ToEf());
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
