using Microsoft.Extensions.Logging;

namespace Fibertest30.Infrastructure;
public class FtDbContextInitializer(FtDbContext ftDbContext,
    ILogger<FtDbContextInitializer> logger)
{
    public async Task InitializeAsync()
    {
        try
        {
                await ftDbContext.Database.EnsureCreatedAsync();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while initializing the database.");
            throw;
        }
    }
}
