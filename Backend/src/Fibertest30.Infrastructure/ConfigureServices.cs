using Microsoft.AspNetCore.Identity;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Fibertest30.Infrastructure.Device;
using Fibertest30.Infrastructure.Emulator;
using Iit.Fibertest.Graph;

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

        services.AddIdentityCore<ApplicationUser>(options => { /*options.SignIn.RequireConfirmedAccount = true;*/ })
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

        services.AddScoped<EventStoreService>();
        services.AddScoped<EventStoreInitializer>();
        services.AddScoped<MySerializer>();

        services.AddScoped<RtuStationsRepository>();
        services.AddScoped<SnapshotRepository>();
        services.AddScoped<SorFileRepository>();
        services.AddScoped<EventLogComposer>();
        services.AddScoped<EventToLogLineParser>();
        services.AddScoped<CommandAggregator>();
        services.AddScoped<EventsQueue>(); // Singleton?

        services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
        services.AddScoped<IUsersRepository, UsersRepository>();
        services.AddScoped<INotificationRepository, NotificationRepository>();
        services.AddScoped<IUserSettingsRepository, UserSettingsRepository>();
        services.AddScoped<IOnDemandRepository, OnDemandRepository>();
        services.AddScoped<IMonitoringRepository, MonitoringRepository>();
        services.AddScoped<IBaselineRepository, BaselineRepository>();
        services.AddScoped<IAlarmProfileRepository, AlarmProfileRepository>();
        services.AddScoped<INotificationSettingsRepository, NotificationSettingsRepository>();
        services.AddScoped<ISystemEventRepository, SystemEventRepository>();
        services.AddScoped<IMonitoringPortRepository, MonitoringPortRepository>();
        services.AddScoped<IMonitoringAlarmRepository, MonitoringAlarmRepository>();
        services.AddScoped<IAlarmEventRepository, AlarmEventRepository>();
        services.AddScoped<IPortLabelRepository, PortLabelRepository>();

        services.AddScoped<IEmailBuilder, EmailBuilder>();
        services.AddScoped<IEmailService, EmailService>();
        services.AddScoped<ISnmpService, SnmpService>();

        services.AddInfrastructureDeviceServices(configuration);

        services.AddScoped<IOtauRepository, OtauRepository>();

        services.AddOtdr(configuration);
        services.AddOtau(configuration);
        services.AddEmulatedDelayService(configuration, environmentName);
        services.AddDeviceInfoProvider(configuration);
        services.AddSingleton<IShellCommand, ShellCommand>();
        services.AddNetworkSettingsProvider(configuration);
        services.AddTimeSettingsProvider(configuration);

        return services;
    }

    private static void AddOtdr(this IServiceCollection services, IConfiguration configuration)
    {
        var emulator = configuration.GetValue<bool>("Emulator:Enabled");
        if (emulator)
        {
            services.AddSingleton<IOtdr, Emulator.Otdr>();
            services.AddSingleton<ITraceComparator, Emulator.TraceComparator>();
            services.AddSingleton<ILinkmapGenerator, Emulator.LinkmapGenerator>();
        }
        else
        {
            services.Configure<Device.OtdrSettings>(configuration.GetRequiredSection(Device.OtdrSettings.SectionName));
            services.AddSingleton<IOtdr, Device.Otdr>();
            services.AddSingleton<ITraceComparator, Device.TraceComparator>();
            services.AddSingleton<ILinkmapGenerator, Device.LinkmapGenerator>();
        }
    }

    private static void AddOtau(this IServiceCollection services, IConfiguration configuration)
    {
        var emulator = configuration.GetValue<bool>("Emulator:Enabled");
        if (emulator)
        {
            services.AddSingleton<IOtauControllerFactory, Emulator.OtauControllerFactory>();
        }
        else
        {
            services.AddSingleton<IOtauControllerFactory, Device.OtauControllerFactory>();
        }
    }

    private static void AddEmulatedDelayService(this IServiceCollection services,
        IConfiguration configuration, string environmentName)
    {
        var emulator = configuration.GetValue<bool>("Emulator:Enabled");
        if (!emulator)
        {
            return;
        }

        if (environmentName == "Test" || environmentName == "Development")
        {
            services.AddSingleton<IEmulatorDelayService, TestDelayService>();
        }
        else
        {
            services.AddSingleton<IEmulatorDelayService, EmulatorDelayService>();
        }
    }

    private static void AddDeviceInfoProvider(this IServiceCollection services, IConfiguration configuration)
    {
        var emulator = configuration.GetValue<bool>("Emulator:Enabled");
        if (emulator)
        {
            services.AddSingleton<IDeviceInfoProvider, Emulator.DeviceInfoProvider>();
        }
        else
        {
            services.AddSingleton<IDeviceInfoProvider, Device.DeviceInfoProvider>();
        }
    }

    private static void AddNetworkSettingsProvider(this IServiceCollection services, IConfiguration configuration)
    {
        var emulator = configuration.GetValue<bool>("Emulator:Enabled");
        if (emulator)
        {
            services.AddSingleton<INetworkSettingsProvider, Emulator.NetworkSettingsProvider>();
        }
        else
        {
            services.AddSingleton<INetworkSettingsProvider, Device.NetworkSettingsProvider>();
        }
    }

    private static void AddTimeSettingsProvider(this IServiceCollection services, IConfiguration configuration)
    {
        var emulator = configuration.GetValue<bool>("Emulator:Enabled");
        if (emulator)
        {
            services.AddSingleton<INtpSettingsProvider, Emulator.NtpSettingsProvider>();
        }
        else
        {
            services.AddSingleton<INtpSettingsProvider, Device.NtpSettingsProvider>();
        }
    }
}

public static class SqliteSharedConnection
{
    private static SqliteConnection? _connection = null;

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