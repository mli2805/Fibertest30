using Fibertest30.Infrastructure.Services;
using Iit.Fibertest.Graph;
using Microsoft.AspNetCore.Identity;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Fibertest30.Infrastructure;

public static class ConfigureServices
{

    public static IServiceCollection AddInfrastructureServices(
        this IServiceCollection services
        , IConfiguration configuration
        , string environmentName)
    {
        services.Configure<JwtSettings>(configuration.GetRequiredSection(JwtSettings.SectionName));

        services.AddSingleton<IDateTime, DateTimeService>();
        services.AddSingleton<IDelayService, DelayService>();
        services.AddDbContext<RtuContext>(c =>
        {
            var connectionString = configuration.GetConnectionString("Default")!;
            if (connectionString.Contains(":memory:"))
            {
                // The in memory database is used by functional tests. 
                // But it also can be used by the application if you don't care about data persistence.
                c.UseSqlite(SqliteSharedConnection.Get(connectionString));
            }
            else
            {
                c.UseSqlite(connectionString);
            }
        });

        services.AddIdentityCore<ApplicationUser>(_ => { /*options.SignIn.RequireConfirmedAccount = true;*/ })
             .AddRoles<IdentityRole>()
             .AddEntityFrameworkStores<RtuContext>()
            //.AddDefaultTokenProviders()
            ;
        services.AddScoped<RtuContextInitializer>();

        services.AddDbContext<FtDbContext>(c =>
        {
            var connectionString = "server=localhost;port=3306;user id=root;password=root;database=ft20efcore";
            c.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
        });
        services.AddScoped<FtDbContextInitializer>();


        services.AddHttpContextAccessor();
        services.AddScoped<SignInManager<ApplicationUser>>();

        services.Configure<IdentityOptions>(IdentityOptionsConfiguration.Configure);

        services.AddMemoryCache();

       

        services.AddScoped<RtuStationsRepository>();
        services.AddScoped<SnapshotRepository>();
        services.AddScoped<SorFileRepository>();
        services.AddScoped<EventLogComposer>();

        services.AddScoped<CommandAggregator>();
        services.AddScoped<EventsQueue>(); // Singleton?

        services.AddSingleton<EventToLogLineParser>();
        services.AddSingleton<MySerializer>();
        services.AddSingleton<EventStoreInitializer>();
        services.AddScoped<IEventStoreService, EventStoreService>();

        services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
        services.AddScoped<IUsersRepository, UsersRepository>();
        services.AddScoped<INotificationRepository, NotificationRepository>();
        services.AddScoped<IUserSettingsRepository, UserSettingsRepository>();
        services.AddScoped<INotificationSettingsRepository, NotificationSettingsRepository>();
        services.AddScoped<ISystemEventRepository, SystemEventRepository>();

        services.AddScoped<IEmailBuilder, EmailBuilder>();
        services.AddScoped<IEmailService, EmailService>();
        services.AddScoped<ISnmpService, SnmpService>();

        services.AddScoped<IRtuTransmitter, MakLinuxHttpTransmitter>();
        services.AddScoped<IRtuManager, RtuManager>();

        services.AddSingleton<IRtuOccupationService, RtuOccupationService>();
        services.AddSingleton<IRtuLinuxPollster, RtuLinuxPollster>();

        return services;
    }

  
}

public static class SqliteSharedConnection
{
    private static SqliteConnection? _connection;

    public static SqliteConnection Get(string connectionString)
    {
        if (_connection == null)
        {
            _connection = new SqliteConnection(connectionString);
            _connection.Open();
        }

        return _connection;
    }
}