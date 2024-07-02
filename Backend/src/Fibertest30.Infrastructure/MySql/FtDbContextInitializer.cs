using Microsoft.Extensions.Logging;

namespace Fibertest30.Infrastructure;
public class FtDbContextInitializer
{
    private readonly FtDbContext _ftDbContext;
    private readonly ILogger<RtuContextInitializer> _logger;

    public FtDbContextInitializer( FtDbContext ftDbContext,
        ILogger<RtuContextInitializer> logger

    )
    {
        _ftDbContext = ftDbContext;
        _logger = logger;
    }

    public async Task InitializeAsync()
    {
        try
        {
                await _ftDbContext.Database.EnsureCreatedAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while initializing the database.");
            throw;
        }
    }
}
