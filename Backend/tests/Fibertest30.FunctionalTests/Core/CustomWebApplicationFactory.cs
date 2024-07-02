using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;

namespace Fibertest30.FunctionalTests;

extern alias Api;

internal class CustomWebApplicationFactory : WebApplicationFactory<Api::Program>
{
    private readonly IDateTime _dateTime;

    public CustomWebApplicationFactory(IDateTime dateTime)
    {
        _dateTime = dateTime;
    }
    
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Test");
        
        builder.ConfigureServices((builder, services) =>
        {
            services.Remove<IDateTime>().AddSingleton(_dateTime);
        });
    }
}

