using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Fibertest30.Infrastructure.Device;
public static class ConfigureServices
{
    public static IServiceCollection AddInfrastructureDeviceServices(
        this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<OtdrMeasEngine.Settings>(
            configuration.GetRequiredSection(OtdrMeasEngine.Settings.SectionName));
        services.AddSingleton<OtdrMeasEngine.OtdrMeasEngine>();

        return services;
    }

}
