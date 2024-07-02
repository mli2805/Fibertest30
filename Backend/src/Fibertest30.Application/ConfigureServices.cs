using FluentValidation;
using MediatR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Fibertest30.Applications;
using Iit.Fibertest.Graph;
using System.Reflection;

namespace Fibertest30.Application;

public static class ConfigureServices
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
        services.AddMediatR(config => config.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));
        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(AuthorizationBehaviour<,>));
        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(LogRequestBehaviour<,>));
        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehaviour<,>));
        //services.AddTransient(typeof(IPipelineBehavior<,>), typeof(PerformanceBehaviour<,>));
        services.AddSingleton<IDefaultPermissionProvider, DefaultPermissionProvider>();
        
        services.AddSingleton<SystemEventDispatcher>(); 
        services.AddSingleton<ISystemEventDispatcher>(provider => provider.GetRequiredService<SystemEventDispatcher>());
        services.AddSingleton<ISystemEventSender>(provider => provider.GetRequiredService<SystemEventDispatcher>());

        services.AddSingleton<NotificationDispatcher>(); 
        services.AddSingleton<INotificationDispatcher>(provider => provider.GetRequiredService<NotificationDispatcher>());
        services.AddSingleton<INotificationSender>(provider => provider.GetRequiredService<NotificationDispatcher>());

        services.AddSingleton<IEmailChannelSender, EmailChannelSender>();
        services.AddSingleton<ISnmpChannelSender, SnmpChannelSender>();
        services.AddSingleton<IInAppChannelSender, InAppChannelSender>();
        
        services.AddSingleton<IMeasurementDispatcher, MeasurementDispatcher>();
        services.AddSingleton<IMeasurementService, MeasurementService>();
        services.AddSingleton<IOnDemandService, OnDemandService>();
        services.AddSingleton<IMonitoringAlarmService, MonitoringAlarmService>();
        services.AddSingleton<IMonitoringService, MonitoringService>();
        services.AddSingleton<IPrometheusPushService, PrometheusPushService>();
        services.AddSingleton<IPrometheusQueryStringBuilder, PrometheusQueryStringBuilder>();
        services.AddSingleton<IBaselineSetupService, BaselineSetupService>();
        services.AddSingleton<IOtdrTasksService, OtdrTasksService>();
        services.AddScoped<IUserRolePermissionProvider, UserRolePermissionProvider>();

        services.AddSingleton<IOtauService, OtauService>();
        services.AddSingleton<IMonitoringScheduler, MonitoringScheduler>();

        services.AddSingleton<Model>();
        
        return services;
    }

    public static IServiceCollection AddPrometheusHttpClient(this IServiceCollection services, IConfiguration configuration)
    {
        string? prometheusBase = configuration["PrometheusBase"];

        if (!string.IsNullOrEmpty(prometheusBase))
        {
            if (!prometheusBase.EndsWith('/'))
            {
                prometheusBase = prometheusBase.TrimEnd('\\') + '/';
            }
            Uri baseAddress = new(prometheusBase);
            
            services.AddHttpClient("prometheus", config =>
            {
                config.BaseAddress = baseAddress;
            });
        }
        else
        {
            services.AddHttpClient();
        }

        return services;
    }
}