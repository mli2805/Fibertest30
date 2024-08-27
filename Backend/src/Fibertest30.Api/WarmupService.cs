using System.Diagnostics;

namespace Fibertest30.Api;

public class WarmupService
{
    private readonly ILogger<WarmupService> _logger;
    private readonly IUsersRepository _usersRepository;

    public WarmupService(ILogger<WarmupService> logger, 
        IUsersRepository usersRepository
       )
    {
        _logger = logger;
        _usersRepository = usersRepository;
    }
    
    public async Task Execute()
    {
        try
        {
            _logger.LogInformation("Warmup started..");
            var stopwatch = Stopwatch.StartNew();
            await DoExecute();
            _logger.LogInformation("Warmup finished in {ElapsedMilliseconds} ms", stopwatch.ElapsedMilliseconds);
        }
        catch(Exception ex)
        {
            _logger.LogError(ex, "Warmup failed");
        }
    }

    private async Task DoExecute()
    {
        // get all users (fill users cache)
        var _ = await _usersRepository.GetAllUsers();
        
       
    }
}