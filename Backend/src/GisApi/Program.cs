using Microsoft.EntityFrameworkCore;

namespace GisApi
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.WebHost.ConfigureKestrel(o =>
            {
                o.ListenAnyIP(5289);
                o.ListenAnyIP(7151, listenOptions => listenOptions.UseHttps());
            });

            // Add services to the container.

            builder.Services.AddControllers();
            // var connectionString = "Data Source=Data.gmdb";
            var connectionString = builder.Configuration["ConnectionString"] ?? "Data Source=Data.gmdb";
            builder.Services.AddDbContext<GisDbContext>(c =>
            {
                c.UseSqlite(connectionString);
            });
            builder.Services.AddScoped<GisDbContextInitializer>();

            var app = builder.Build();
            using (var scope = app.Services.CreateScope())
            {
                var initializer = scope.ServiceProvider.GetRequiredService<GisDbContextInitializer>();
                await initializer.InitializeAsync();
            }

            // Configure the HTTP request pipeline.

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.UseCors();

            app.MapControllers();

            await app.RunAsync();
        }
    }
}
