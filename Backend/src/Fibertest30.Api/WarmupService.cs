using Optixsoft.SorFormat.Protobuf;
using System.Diagnostics;

namespace Fibertest30.Api;

public class WarmupService
{
    private readonly ILogger<WarmupService> _logger;
    private readonly IUsersRepository _usersRepository;
    private readonly IOnDemandRepository _onDemandRepository;

    public WarmupService(ILogger<WarmupService> logger, 
        IUsersRepository usersRepository,
        IOnDemandRepository onDemandRepository)
    {
        _logger = logger;
        _usersRepository = usersRepository;
        _onDemandRepository = onDemandRepository;
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
        var users = await _usersRepository.GetAllUsers();
        
        // get on demands
        var onDemands = await _onDemandRepository.GetAll(new List<int>(), false);
        if (onDemands.Count > 0)
        {
            // serialize otdr trace
            var sor = await _onDemandRepository.GetSor(onDemands[0].Id);
            var sorProto = new MeasurementTrace(sor).OtdrData.ToSorDataBuf().ToBytes();
        }
    }
}