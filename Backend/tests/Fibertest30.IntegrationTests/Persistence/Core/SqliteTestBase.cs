using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Fibertest30.IntegrationTests;

public abstract class SqliteTestBase
{
    protected bool _useSqliteMemory = true;
    private SqliteConnection? _inMemorySqlite;

    protected RtuContext _rtuContext = null!;
    protected UserManager<ApplicationUser> _userManager = null!;
    protected RoleManager<IdentityRole> _roleManager = null!;
    private RtuContextInitializer _initializer = null!;

    private readonly Mock<ILogger<RtuContextInitializer>> _mockLogger = new();
    protected readonly DefaultPermissionProvider _permissionProvider = new();
    protected readonly Mock<IDefaultPermissionProvider> _mockPermissionProvier = new();

    protected IMemoryCache _cache = new MemoryCache(new MemoryCacheOptions());


    [TestInitialize]
    public void BaseTestInitialize()
    {
        SetRtuContext();
    }

    [TestCleanup]
    public void BaseTestCleanup()
    {
        _rtuContext.Dispose();
        _inMemorySqlite?.Dispose();
    }

    private void SetRtuContext()
    {
        var rtuContext = _useSqliteMemory ? GetSqliteDbContext() : GetEntityFrameworkInMemory();
        var userStore = new UserStore<ApplicationUser>(rtuContext);
        var roleStore = new RoleStore<IdentityRole>(rtuContext);
        var otauRepository = new OtauRepository(rtuContext, _cache);

        var services = new ServiceCollection();
        services.AddIdentityCore<ApplicationUser>(options => { })
             .AddRoles<IdentityRole>()
        .AddEntityFrameworkStores<RtuContext>();

        services.Configure<IdentityOptions>(IdentityOptionsConfiguration.Configure);
        services.AddSingleton<IUserStore<ApplicationUser>>(userStore);
        services.AddSingleton<IRoleStore<IdentityRole>>(roleStore);

        var serviceProvider = services.BuildServiceProvider();
        _userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        _roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();


        ResetPermissionProvider();
        _initializer = new RtuContextInitializer(
            _mockLogger.Object,
            rtuContext,
            _mockPermissionProvier.Object,
            _userManager,
            _roleManager,
            otauRepository);
        _rtuContext = rtuContext;
    }

    private RtuContext GetEntityFrameworkInMemory()
    {
        var dbOptions = new DbContextOptionsBuilder<RtuContext>()
                        .UseInMemoryDatabase(databaseName: "TestRtu")
                        .Options;
        var rtuContext = new RtuContext(dbOptions);

        // Clear the database between each test
        // Alternatively you can use Guid.NewGuid() as database name
        rtuContext.Database.EnsureDeleted();

        return rtuContext;
    }

    private RtuContext GetSqliteDbContext()
    {
        // Sqlite memory mode destroys the database after connection is closed
        // Let's open the connection manually, and don't close it till test ends
        // some details: https://github.com/dotnet/efcore/issues/5086

        _inMemorySqlite = new SqliteConnection("Data Source=:memory:");
        _inMemorySqlite.Open();

        var dbOptions = new DbContextOptionsBuilder<RtuContext>()
                .UseSqlite(_inMemorySqlite)
                .Options;
        var rtuContext = new RtuContext(dbOptions);
        rtuContext.Database.Migrate();
        return rtuContext;
    }

    /// <summary>
    /// Use this method when you need to get a test database the same as initial production database
    /// </summary>
    /// <returns></returns>
    public async Task SeedUsingRtuContextInitializer()
    {
        await _initializer.SeedAsync(seedDemoOtaus: "all", seedDemoUsers: true);
    }

    public async Task SeedAlarmProfiles()
    {
        await _initializer.SeedDefaultAlarmProfile();
    }

    private void ResetPermissionProvider()
    {
        _mockPermissionProvier
            .Setup(x => x.GetDefaultRolePermissions(It.IsAny<ApplicationDefaultRole>()))
            .Returns<ApplicationDefaultRole>(role => _permissionProvider.GetDefaultRolePermissions(role));

        _mockPermissionProvier
            .Setup(x => x.AllPermissions)
            .Returns(_permissionProvider.AllPermissions);

        _mockPermissionProvier
            .Setup(x => x.DefaultRoles)
            .Returns(_permissionProvider.DefaultRoles);
    }
}

