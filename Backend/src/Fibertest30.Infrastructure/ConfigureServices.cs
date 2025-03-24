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
        services.AddDbContext<ServerDbContext>(c =>
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
                // c.UseSqlite(connectionString);

                string serverDbScheme = "ft30server";
                var mySqlAddress = configuration["MySqlServerAddress"] ?? "localhost";
                var mySqlPort = configuration["MySqlServerPort"] ?? "3306";
                var conStrTemplate = "server={0};port={1};user id=root;password=root;database={2}";
                var conString = string.Format(conStrTemplate, mySqlAddress, mySqlPort, serverDbScheme);
                c.UseMySql(conString, ServerVersion.AutoDetect(conString));
            }
        });

        services.AddIdentityCore<ApplicationUser>(_ => { /*options.SignIn.RequireConfirmedAccount = true;*/ })
             .AddRoles<IdentityRole>()
             .AddEntityFrameworkStores<ServerDbContext>()
            //.AddDefaultTokenProviders()
            ;
        services.AddScoped<ServerDbContextInitializer>();

        services.AddDbContext<FtDbContext>(c =>
        {
            string myTablesScheme = "ft20efcore";
            var mySqlAddress = configuration["MySqlServerAddress"] ?? "localhost";
            var mySqlPort = configuration["MySqlServerPort"] ?? "3306";
            var conStrTemplate = "server={0};port={1};user id=root;password=root;database={2}";
            var connectionString = string.Format(conStrTemplate, mySqlAddress, mySqlPort, myTablesScheme);
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

        services.AddScoped<ISorFileRepository, SorFileRepository>();

        services.AddScoped<IEmailBuilder, EmailBuilder>();
        services.AddScoped<IEmailService, EmailService>();
        services.AddScoped<ISnmpService, SnmpService>();
        services.AddScoped<ILogProvider, LogProvider>();

        services.AddScoped<IRtuTransmitter, MakLinuxHttpTransmitter>();
        services.AddScoped<IRtuManager, RtuManager>();

        services.AddSingleton<IRtuOccupationService, RtuOccupationService>();
        services.AddSingleton<AccidentPlaceLocator>();
        services.AddSingleton<AccidentsFromSorExtractor>();
        services.AddSingleton<ProcessedResultsDtoFactory>();
        services.AddSingleton<IRtuCurrentStateDictionary, RtuCurrentStateDictionary>();
        services.AddSingleton<RtuDataProcessor>();
        services.AddSingleton<IRtuDataDispatcher, RtuDataDispatcher>();
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