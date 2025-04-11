using Iit.Fibertest.Dto;
using Iit.Fibertest.Graph;
using Microsoft.Extensions.Logging;

namespace Fibertest30.Infrastructure;
public partial class RtuManager : IRtuManager
{
    private readonly ILogger<RtuManager> _logger;
    private readonly IRtuTransmitter _rtuTransmitter;
    private readonly Model _writeModel;
    private readonly IEventStoreService _eventStoreService;
    private readonly IRtuStationsRepository _rtuStationsRepository;
    private readonly IRtuOccupationService _rtuOccupationService;
    private readonly ICurrentUserService _currentUserService;
    private readonly BaseRefsCheckerOnServer _baseRefsCheckerOnServer;
    private readonly SorFileRepository _sorFileRepository;

    public RtuManager(ILogger<RtuManager> logger, Model writeModel, 
        IRtuTransmitter rtuTransmitter, IEventStoreService eventStoreService, IRtuStationsRepository rtuStationsRepository,
        IRtuOccupationService rtuOccupationService, ICurrentUserService currentUserService,
        BaseRefsCheckerOnServer baseRefsCheckerOnServer, SorFileRepository sorFileRepository)
    {
        _logger = logger;
        _rtuTransmitter = rtuTransmitter;
        _writeModel = writeModel;
        _eventStoreService = eventStoreService;
        _rtuStationsRepository = rtuStationsRepository;
        _rtuOccupationService = rtuOccupationService;
        _currentUserService = currentUserService;
        _baseRefsCheckerOnServer = baseRefsCheckerOnServer;
        _sorFileRepository = sorFileRepository;
    }

    public Task<RtuConnectionCheckedDto> CheckRtuConnection(NetAddress netAddress, CancellationToken cancellationToken)
    {
        return _rtuTransmitter.CheckRtuConnection(netAddress, cancellationToken);
    }
 
}
