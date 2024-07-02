using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Fibertest30.Database.Cli;

public static class ConfigureServices
{
    public static ServiceProvider CreateServiceProvider(string connectionString)
    {
        var services = new ServiceCollection();
        services.AddServices(connectionString);
        
        var serviceProvider = services.BuildServiceProvider();
        return serviceProvider;
    }
    public static void AddServices(this ServiceCollection services, string connectionString)
    {
        services.AddLogging(configure => { /*configure.AddConsole()*/ } );
        
        services.AddMemoryCache();
        
        services.AddDbContext<RtuContext>(c =>
        {
            c.UseSqlite(connectionString);
        });
        
        services.AddIdentityCore<ApplicationUser>(options => { })
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<RtuContext>();
        
        services.AddSingleton<IDefaultPermissionProvider, DefaultPermissionProvider>();
        
        services.AddScoped<IOtauRepository, OtauRepository>();
        services.AddScoped<IBaselineRepository, BaselineRepository>();
        services.AddScoped<IMonitoringRepository, MonitoringRepository>();
        services.AddScoped<IMonitoringPortRepository, MonitoringPortRepository>();
        services.AddScoped<RtuContextInitializer>();

    }
}