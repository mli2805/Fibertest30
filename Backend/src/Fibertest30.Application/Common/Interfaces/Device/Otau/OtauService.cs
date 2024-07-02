using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Collections.Concurrent;
using System.Diagnostics;

namespace Fibertest30.Application;

public class OtauService : IOtauService
{
    public static readonly string VirtualOcmSerialNumber = "Virtual Ocm";
    public static readonly int OcmOtauOcmPortIndex = 0;
    public static readonly int OcmOtauId = 1;


    private readonly ConcurrentDictionary<int, OtauManager> _otauMapById = new();
    private readonly ConcurrentDictionary<int, OtauManager> _otauMapByOcmPortIndex = new();
    private readonly SemaphoreSlim _osmSharedSemaphore = new SemaphoreSlim(1, 1);

    private readonly ILogger<OtauService> _logger;
    private readonly IDateTime _dateTime;
    private readonly IOtauControllerFactory _otauControllerFactory;
    private readonly IServiceScopeFactory _serviceScopeFactory;
    private readonly ISystemEventSender _systemEventSender;
    private IMonitoringService _monitoringService = null!;

    private Task? _pingOtausTask;
    private readonly CancellationTokenSource _pingOtausCts = new();
    private readonly TimeSpan _pingTimeout = TimeSpan.FromSeconds(10);

    public OtauService(
        ILogger<OtauService> logger,
        IDateTime dateTime,
        IOtauControllerFactory otauControllerFactory,
        IServiceScopeFactory serviceScopeFactory,
        ISystemEventSender systemEventSender

    )
    {
        _logger = logger;
        _dateTime = dateTime;
        _otauControllerFactory = otauControllerFactory;
        _serviceScopeFactory = serviceScopeFactory;
        _systemEventSender = systemEventSender;
    }

    public void SetMonitoringService(IMonitoringService monitoringService)
    {
        _monitoringService = monitoringService;
    }

    public async Task Initialize(CancellationToken ct)
    {
        var lastKnownOtaus = await ReadAllOtaus(ct);
        await InitializeOcm(lastKnownOtaus.OcmOtau, ct);
        await InitializeOtausOnStart(lastKnownOtaus.OsmOtaus, ct);
        await InitializeOtausOnStart(lastKnownOtaus.OxcOtaus, ct);
    }

    public void StartPingingOtaus(CancellationToken ct)
    {
        _pingOtausTask = Task.Run(() => PingOtaus(_pingOtausCts.Token), ct);
    }

    public async ValueTask DisposeAsync()
    {
        _pingOtausCts.Cancel();
        if (_pingOtausTask != null)
        {
            // do we need to await?
            _logger.LogInformation("Check otau connections: Stopping..");
            await _pingOtausTask;
            _logger.LogInformation("Check otau connections: Stopped");
        }
    }

    private async Task PingOtaus(CancellationToken ct)
    {
        while (!ct.IsCancellationRequested)
        {
            try
            {
                // let's delay ping start a bit
                // as we're checking LastCommandTime we don't need to wait pingTimeout here
                await Task.Delay(1000, ct);

                foreach (var otauManager in _otauMapById.Values)
                {
                    try
                    {
                        await PingOtau(otauManager, ct);
                    }
                    catch (Exception ex)
                    {
                        // could be in case if otau was removed from the database
                        otauManager.LastCommandTime = _dateTime.UtcNow;
                        _logger.LogError(ex, "Error while pinging otau: id={OtauId} ",
                            otauManager.Otau.Id);
                    }
                }
            }
            catch (OperationCanceledException)
            {
                // ignore cancelling
            }
        }
    }

    private async Task PingOtau(OtauManager otauManager, CancellationToken ct)
    {
        // completely remove VirtualOcm from the ping for now
        // This is because we need to rethink how  Online/Offline statuses are shown for Ocm
        if (otauManager.Otau.SerialNumber == VirtualOcmSerialNumber)
        {
            return;
        }
        
        
        // skip those who were active recently (ping, connect, setPorts, etc.)
        if (_dateTime.UtcNow - otauManager.LastCommandTime < _pingTimeout)
        {
            return;
        }

        bool isConnectedBeforePing;
        bool pingResult;
        using (await otauManager.Semaphore.LockAsync(ct))
        {
            // let's check timeout again
            // it's possible that ping were waiting for setPorts command on the same otau
            if (_dateTime.UtcNow - otauManager.LastCommandTime < _pingTimeout)
            {
                return;
            }

            isConnectedBeforePing = otauManager.IsConnected;
            pingResult = await otauManager.Controller.Ping(ct);
            otauManager.LastCommandTime = _dateTime.UtcNow;
        }
        
        if (pingResult == isConnectedBeforePing)
        {
            // nothing is changed
            return;
        }

        _logger.LogInformation("Otau connection: id={OtauId} type={OtauType} " +
                               "ocmPortIndex={OtauOcmPortIndex} status={OtauStatus}",
            otauManager.Otau.Id, otauManager.Otau.Type, otauManager.Otau.OcmPortIndex,
            pingResult ? "online" : "offline");


        if (pingResult == false)
        {
            SetIsConnected(otauManager, false);
            await SaveOfflineAtToTheDatabase(otauManager, ct);
        }

        if (pingResult || otauManager.Otau.Type == OtauType.Ocm)
        {
            // otau is back after inactivity, let's reinitialize it
            // or ocm goes offline, so reinitialize it as virtual ocm
            await InitializeOtau(otauManager.Otau, discover: null, ct);
        }

        // Fire OtauOnline/OtauOffline system event which updates the UI
        await _systemEventSender.Send(
            SystemEventFactory.OtauConnectionStatusChanged
            (otauManager.Otau.Id, otauManager.IsConnected,
                otauManager.OnlineAt, otauManager.OfflineAt)
        );
    }

    private async Task InitializeOcm(Otau? currentOcm, CancellationToken ct)
    {
        Debug.Assert(currentOcm == null || currentOcm.Type == OtauType.Ocm);
        var ocmController = CreateOtauController(OtauType.Ocm, new OcmOtauParameters());

        OtauDiscover? discoverOcm = null;
        if (currentOcm == null)
        {
            // the very first run

            using var scope = _serviceScopeFactory.CreateScope();
            var otauRepository = scope.ServiceProvider.GetRequiredService<IOtauRepository>();
            discoverOcm = (await DiscoverWithoutLock(ocmController, ct))!.Discover!;

            var otauId = await otauRepository.AddOtau(OtauType.Ocm, OcmOtauOcmPortIndex,
                discoverOcm.SerialNumber, discoverOcm.PortCount, new OcmOtauParameters());

            currentOcm = await otauRepository.GetOtau(otauId, ct);
        }

        AddToMap(currentOcm, ocmController);
        await InitializeOtau(currentOcm, discoverOcm, ct);
    }

    private async Task InitializeOtausOnStart(List<Otau> otaus, CancellationToken ct)
    {
        foreach (var otau in otaus)
        {
            var error = await CreateControllerAndInitializeOtau(otau, discover: null, ct);
            if (error != null && error == OtauDiscoverError.UnsupportedOsmModuleConnected)
            {
                await _systemEventSender.Send(
                    SystemEventFactory.UnsupportedOsmModuleConnected(otau.OcmPortIndex));
            }
        }
    }

    private async Task<OtauDiscoverError?> CreateControllerAndInitializeOtau(Otau otau, OtauDiscover? discover, CancellationToken ct)
    {
        var controller = CreateOtauController(otau.Type, otau.Parameters);
        AddToMap(otau, controller);
        return await InitializeOtau(otau, discover, ct);
    }

    private async Task<OtauDiscoverError?> InitializeOtau(Otau otau, OtauDiscover? discover, CancellationToken ct)
    {
        OtauDiscoverError? initError = null;

        if (discover == null)
        {
            var discoverResult = await Discover(otau.Id, ct);
            discover = discoverResult.Discover;
            initError = discoverResult.Error;
        }

        _logger.LogInformation("Initialize otau: id={OtauId} type={OtauType} " +
                               "ocmPortIndex={OtauOcmPortIndex} serialNumber={OtauSerialNumber} " +
                               "portCount={OtauPortCount} discoverSerialNumber={OtauDiscoverSerialNumber} " +
                               "discoverPortCount={OtauDiscoverPortCount} status={OtauStatus}"
            , otau.Id, otau.Type, otau.OcmPortIndex, otau.SerialNumber, otau.PortCount,
            discover?.SerialNumber, discover?.PortCount, discover != null ? "online" : "offline");

        if (discover != null)
        {
            await UpdateOtauIfChanged(otau, discover, ct);
        }

        if (discover != null)
        {
            await Connect(otau.Id, ct);
        }
        else
        {
            SetIsConnected(otau.Id, false);
            await SaveOfflineAtToTheDatabase(otau.Id, ct);
        }

        return initError;
    }

    private void AddToMap(Otau otau, IOtauController controller)
    {
        var otauManager = new OtauManager
        {
            Controller = controller,
            Otau = otau,
            Semaphore = CreateOtauSemaphore(otau.Type),
            IsConnected = false,
            LastCommandTime = _dateTime.UtcNow,
            OnlineAt = otau.OnlineAt,
            OfflineAt = otau.OfflineAt
        };

        var addToMapById = _otauMapById.TryAdd(otau.Id, otauManager);
        if (!addToMapById)
        {
            throw new Exception($"Can't add otau to the map by id, OtauId={otau.Id}");
        }

        var addToMapByOcmPortIndex = _otauMapByOcmPortIndex.TryAdd(otau.OcmPortIndex, otauManager);
        if (!addToMapByOcmPortIndex)
        {
            throw new Exception($"Can't add otau to the map by OcmPortIndex, OtauId={otau.Id}");
        }
    }

    private async Task UpdateOtauIfChanged(Otau otau, OtauDiscover discover, CancellationToken ct)
    {
        if (otau.SerialNumber != discover.SerialNumber)
        {
            using var scope = _serviceScopeFactory.CreateScope();
            var otauRepository = scope.ServiceProvider.GetRequiredService<IOtauRepository>();

            await otauRepository.ChangeOtau(otau, discover.SerialNumber, discover.PortCount, ct);

            await UpdateOtauInOtauManager(otauRepository, otau.Id, ct);

            // TODO: Mark every otau's port that has a baseline with 'better to remeasure' warning

            // Hide VirtualOcm otau change events from system event history
            var internalOnly = otau.SerialNumber == VirtualOcmSerialNumber
             || discover.SerialNumber == VirtualOcmSerialNumber;

            // Fire otau changed system event (show exactly what changed)
            await _systemEventSender.Send(
                SystemEventFactory.OtauChanged(otau.Id,
                    otau.SerialNumber, discover.SerialNumber,
                    otau.PortCount, discover.PortCount, internalOnly)
            );


            _logger.LogInformation("Otau changed: id={OtauId} type={OtauType} ocmPortIndex={OtauOcmPortIndex} " +
                                   "otauSerialNumber={OtauSerialNumber} otauPortCount={OtauPortCount}",
                otau.Id, otau.Type, otau.OcmPortIndex, discover.SerialNumber, discover.PortCount);
        }
    }

    public Task<List<CombinedOtau>> GetAllOtau(CancellationToken ct)
    {
        var combinedOtaus = _otauMapById.Values.Select(otauManager =>
                new CombinedOtau(otauManager.Otau, new OtauInfo
                {
                    IsConnected = otauManager.IsConnected,
                    OnlineAt = otauManager.OnlineAt,
                    OfflineAt = otauManager.OfflineAt
                }))
            .OrderBy(x => x.Otau.OcmPortIndex)
            .ToList();


        return Task.FromResult(combinedOtaus);
    }

    public async Task<HashSet<int>> GetOnlineOtauPortIds(CancellationToken ct)
    {
        var otaus = await GetAllOtau(ct);
        return otaus.Where(x => x.OtauInfo.IsConnected)
            .SelectMany(x => x.Otau.Ports)
            .Where(x => x.Unavailable == false)
            .Select(x => x.Id)
            .ToHashSet();
    }

    private async Task<OtauDiscoverResult> Discover(int otauId, CancellationToken ct)
    {
        var otauManager = GetOtauManagerOrThrow(otauId);
        using (await otauManager.Semaphore.LockAsync(ct))
        {
            var discover = await DiscoverWithoutLock(otauManager.Controller, ct);
            otauManager.LastCommandTime = _dateTime.UtcNow;
            return discover;
        }
    }

    private async Task<OtauDiscoverResult> DiscoverWithoutLock(IOtauController controller, CancellationToken ct)
    {
        OtauDiscoverResult result;
        try
        {
            var discover = await controller.Discover(ct);
            result = new OtauDiscoverResult { Discover = discover };
            if (discover == null)
            {
                result.Error = OtauDiscoverError.OsmModuleNotFound;
            }
        }
        catch (UnsupportedOsmModuleConnectedException )
        {
            result = new OtauDiscoverResult { Error = OtauDiscoverError.UnsupportedOsmModuleConnected };
        }

        if (controller.OtauType == OtauType.Ocm && result.Discover == null)
        {
            result.Discover = new OtauDiscover
            {
                SerialNumber = VirtualOcmSerialNumber,
                PortCount = 1
            };
        }

        return result;
    }

    private async Task Connect(int otauId, CancellationToken ct)
    {
        var otauManager = GetOtauManagerOrThrow(otauId);
        using (await otauManager.Semaphore.LockAsync(ct))
        {
            // ReSharper disable once SimplifyConditionalTernaryExpression
            var result = otauManager.Otau.SerialNumber == VirtualOcmSerialNumber 
                ? true : await otauManager.Controller.Connect(ct);

            _logger.LogInformation("Otau connect: id={OtauId} type={OtauType} " +
                                   "ocmPortIndex={OtauOcmPortIndex} status={OtauStatus}",
                otauId, otauManager.Otau.Type, otauManager.Otau.OcmPortIndex, result ? "online" : "offline");

            SetIsConnected(otauManager, result);
        }

        await SaveOfflineAtToTheDatabase(otauManager, ct);
    }

    private async Task Disconnect(int otauId, CancellationToken ct)
    {
        var otauManager = GetOtauManagerOrThrow(otauId);
        using (await otauManager.Semaphore.LockAsync(ct))
        {
            await otauManager.Controller.Disconnect(ct);
            SetIsConnected(otauManager, false);
        }

        await SaveOfflineAtToTheDatabase(otauManager, ct);
    }
    public OtauPortPath GetOtauPortPathByMonitoringPortId(int monitoringPortId)
    {
        var ocmOtauManager = GetOcmOtauManager();
        foreach (var ocmPort in ocmOtauManager.Otau.Ports)
        {
            if (monitoringPortId == ocmPort.MonitoringPortId)
            {
                return new OtauPortPath
                {
                    OcmOtauManager = ocmOtauManager,
                    OcmOtauPort = ocmPort
                };
            }

#pragma warning disable CS8600
            if (_otauMapByOcmPortIndex.TryGetValue(ocmPort.PortIndex, out OtauManager cascadeOtauManager))
#pragma warning restore CS8600
            {
                foreach (var cascadeOtauPort in cascadeOtauManager.Otau.Ports)
                {
                    if (monitoringPortId == cascadeOtauPort.MonitoringPortId)
                    {
                        return new OtauPortPath
                        {
                            OcmOtauManager = ocmOtauManager,
                            OcmOtauPort = ocmPort,
                            CascadeOtauManager = cascadeOtauManager,
                            CascadeOtauPort = cascadeOtauPort
                        };
                    }
                }
            }
        }

        throw new OtauSetPortException(OtauSetPortExceptionReason.OtauPortUnavailable,
            $"MonitoringPortId={monitoringPortId} is not available");
    }

    public async Task SetPort(int monitoringPortId, CancellationToken ct)
    {
        var portPath = GetOtauPortPathByMonitoringPortId(monitoringPortId);

        // check if we are trying to measure using just ocm port,
        // but with cascading attached to this port
        if (portPath.CascadeOtauManager == null
            && _otauMapByOcmPortIndex.TryGetValue(portPath.OcmOtauPort.PortIndex, out _))
        {
            throw new OtauSetPortException(OtauSetPortExceptionReason.OtauPortUnavailable,
                $"OtauId={portPath.OcmOtauManager.Otau.Id} portIndex={portPath.OcmOtauPort.PortIndex} is not available");
        }

        if (portPath.OcmOtauManager.Otau.SerialNumber != VirtualOcmSerialNumber)
        {
            await SetPort(portPath.OcmOtauManager, portPath.OcmOtauPort, ct);
        }

        if (portPath.CascadeOtauManager != null && portPath.CascadeOtauPort != null)
        {
            await SetPort(portPath.CascadeOtauManager, portPath.CascadeOtauPort, ct);
        }
    }
    private async Task SetPort(OtauManager otauManager, OtauPort otauPort, CancellationToken ct)
    {
        if (!otauManager.IsConnected)
        {
            throw new OtauSetPortException(OtauSetPortExceptionReason.OtauIsNotConnected,
                $"OtauId={otauManager.Otau.Id} is not connected");
        }

        if (otauPort.Unavailable)
        {
            throw new OtauSetPortException(OtauSetPortExceptionReason.OtauPortUnavailable,
                $"OtauId={otauManager.Otau.Id} portIndex={otauPort.PortIndex} is not available");
        }

        var monitoringPort = await GetMonitoringPort(otauPort.MonitoringPortId, ct);
        if (monitoringPort.Status == MonitoringPortStatus.Maintenance)
        {
            throw new OtauSetPortException(OtauSetPortExceptionReason.OtauPortMaintenance,
                $"OtauId={otauManager.Otau.Id} portIndex={otauPort.PortIndex} is in maintenance mode");
        }

        try
        {
            using (await otauManager.Semaphore.LockAsync(ct))
            {
                await otauManager.Controller.SetPort(otauPort.PortIndex, ct);
                otauManager.LastCommandTime = _dateTime.UtcNow;
            }
        }
        catch (OperationCanceledException)
        {
            throw;
        }
        catch (Exception ex)
        {
            throw new OtauSetPortException(OtauSetPortExceptionReason.OtauSetPortFailed,
                $"OtauId={otauManager.Otau.Id} portIndex={otauPort.PortIndex} set port exception",
                ex);
        }

        _logger.LogInformation("Otau set port: id={OtauId} type={OtauType} " +
                               "ocmPortIndex={OtauOcmPortIndex} portIndex={OtauPortIndex} ",
            otauManager.Otau.Id, otauManager.Otau.Type, otauManager.Otau.OcmPortIndex,
            otauPort.PortIndex);
    }

    private IOtauController CreateOtauController
        (OtauType otauType, IOtauParameters otauParameters)
    {
        switch (otauType)
        {
            case OtauType.Ocm:
                return _otauControllerFactory.CreateOcm();
            case OtauType.Osm:
                var ocmParameters = (OsmOtauParameters)otauParameters;
                return _otauControllerFactory.CreateOsm(ocmParameters.ChainAddress);
            case OtauType.Oxc:
                var oxcParameters = (OxcOtauParameters)otauParameters;
                return _otauControllerFactory.CreateOxc(oxcParameters.Ip, oxcParameters.Port);
            default:
                throw new ArgumentException($"Unknown otau type {otauType}");
        }
    }

    private SemaphoreSlim CreateOtauSemaphore
        (OtauType otauType)
    {
        switch (otauType)
        {
            case OtauType.Osm:
                // OSM otaus use shared connections
                // we can't send commands to different OSM otaus in parallel 
                return _osmSharedSemaphore;
            case OtauType.Ocm:
            case OtauType.Oxc:
                return new SemaphoreSlim(1, 1);
            default:
                throw new ArgumentException($"Unknown otau type {otauType}");
        }
    }

    private async Task<Otaus> ReadAllOtaus(CancellationToken ct)
    {
        using var scope = _serviceScopeFactory.CreateScope();
        var otauRepository = scope.ServiceProvider.GetRequiredService<IOtauRepository>();
        return await otauRepository.ReadOtaus(ct);
    }

    private async Task<MonitoringPort> GetMonitoringPort(int monitoringPortId, CancellationToken ct)
    {
        using var scope = _serviceScopeFactory.CreateScope();
        var monitoringPortRepository = scope.ServiceProvider.GetRequiredService<IMonitoringPortRepository>();
        return await monitoringPortRepository.GetMonitoringPort(monitoringPortId, ct);
    }

    private OtauManager GetOtauManagerOrThrow(int otauId)
    {
        if (!_otauMapById.TryGetValue(otauId, out var otauManager))
        {
            throw new Exception("OtauController not found");
        }

        return otauManager;
    }

    private OtauManager GetOcmOtauManager()
    {
        if (!_otauMapByOcmPortIndex.TryGetValue(OcmOtauOcmPortIndex, out var otauManager))
        {
            throw new Exception($"Ocm OtauManager not found");
        }

        return otauManager;
    }

    private void SetIsConnected(int otauId, bool isConnected)
    {
        var otauManager = GetOtauManagerOrThrow(otauId);
        SetIsConnected(otauManager, isConnected);
    }

    // keep SetIsConnected simple as it's called inside semaphore lock
    private void SetIsConnected(OtauManager otauManager, bool isConnected)
    {
        otauManager.IsConnected = isConnected;
        otauManager.LastCommandTime = _dateTime.UtcNow;

        if (isConnected)
        {
            otauManager.OnlineAt ??= _dateTime.UtcNow;
            otauManager.OfflineAt = null;
        }
        else
        {
            otauManager.OnlineAt = null;
            otauManager.OfflineAt ??= _dateTime.UtcNow;
        }
    }

    // SaveOfflineAtToTheDatabase should be called right after SetIsConnected
    // but they are separated to free semaphore lock as soon as possible
    private async Task SaveOfflineAtToTheDatabase(int otauId, CancellationToken ct)
    {
        var otauManager = GetOtauManagerOrThrow(otauId);
        await SaveOfflineAtToTheDatabase(otauManager, ct);
    }

    private async Task SaveOfflineAtToTheDatabase(OtauManager otauManager, CancellationToken ct)
    {
        using var scope = _serviceScopeFactory.CreateScope();
        var otauRepository = scope.ServiceProvider.GetRequiredService<IOtauRepository>();
        await otauRepository.UpdateOtauOnlineAtOfflineAt
            (otauManager.Otau.Id, otauManager.OnlineAt, otauManager.OfflineAt, ct);
    }


    // The BlinkOsmOtau/BlinkOxcOtau is intended to be used from Web to check if OSM otau is available
    // before adding it to the system, hence the checking for duplications
    public async Task<bool> BlinkOsmOtau(int chainAddress, CancellationToken ct)
    {
        ThrowIfOsmAlreadyInUse(chainAddress);

        var controller = _otauControllerFactory.CreateOsm(chainAddress);
        return await controller.Blink(ct);
    }

    public async Task<bool> BlinkOxcOtau(string ipAddress, int port, CancellationToken ct)
    {
        ThrowIfOxcAlreadyInUse(ipAddress, port);

        var controller = _otauControllerFactory.CreateOxc(ipAddress, port);
        return await controller.Blink(ct);
    }

    public async Task<bool> BlinkOtau(int otauId, CancellationToken ct)
    {
        var otauManager = GetOtauManagerOrThrow(otauId);
        using (await otauManager.Semaphore.LockAsync(ct))
        {
            return await otauManager.Controller.Blink(ct);
        }
    }

    // The DiscoverOsmOtau/DiscoverOxcOtau is intended to be used from Web to check if OSM otau is available
    // before adding it to the system, hence the checking for duplications
    public async Task<OtauDiscoverResult> DiscoverOsmOtau(int chainAddress, CancellationToken ct)
    {
        ThrowIfOsmAlreadyInUse(chainAddress);

        var controller = _otauControllerFactory.CreateOsm(chainAddress);
        // lock to prevent parallel requests, OSM uses shared COM channel
        using (await _osmSharedSemaphore.LockAsync(ct))
        {
            return await DiscoverWithoutLock(controller, ct);
        }
    }

    public async Task<OtauDiscoverResult> DiscoverOxcOtau(string ipAddress, int port, CancellationToken ct)
    {
        ThrowIfOxcAlreadyInUse(ipAddress, port);

        var controller = _otauControllerFactory.CreateOxc(ipAddress, port);
        return await DiscoverWithoutLock(controller, ct);
    }

    private void ThrowIfOsmAlreadyInUse(int chainAddress)
    {
        var usedOsmOtauParameters = _otauMapById.Values
            .Where(x => x.Otau.Type == OtauType.Osm)
            .Select(x => (OsmOtauParameters)x.Otau.Parameters).ToList();

        if (usedOsmOtauParameters.Any(x => x.ChainAddress == chainAddress))
        {
            throw new Exception($"Otau with the same ChainAddress={chainAddress} is already in use");
        }
    }

    private void ThrowIfOxcAlreadyInUse(string ipAddress, int port)
    {
        var usedOcxOtauParameters = _otauMapById.Values
            .Where(x => x.Otau.Type == OtauType.Oxc)
            .Select(x => (OxcOtauParameters)x.Otau.Parameters).ToList();

        if (usedOcxOtauParameters.Any(x =>
                x.Ip.ToLowerInvariant() == ipAddress.ToLowerInvariant() && x.Port == port))
        {
            throw new Exception($"Otau with the same ipAddress:port={ipAddress}:{port} is already in use");
        }
    }

    public async Task<Otau> AddOsmOtau(int ocmPortIndex, int chainAddress, CancellationToken ct)
    {
        var discoverResult = await DiscoverOsmOtau(chainAddress, ct);
        if (discoverResult.Discover == null)
        {
            throw new Exception($"Can't add OSM with chainAddress={chainAddress}, because it's not available");
        }

        return await AddOtau(ocmPortIndex, OtauType.Osm, discoverResult.Discover, new OsmOtauParameters(chainAddress), ct);
    }

    public async Task<Otau> AddOxcOtau(int ocmPortIndex, string ipAddress, int port, CancellationToken ct)
    {
        var discoverResult = await DiscoverOxcOtau(ipAddress, port, ct);
        if (discoverResult.Discover == null)
        {
            throw new Exception($"Can't add OSM with ipAddress:port={ipAddress}:{port}, because it's not available");
        }

        return await AddOtau(ocmPortIndex, OtauType.Oxc, discoverResult.Discover, new OxcOtauParameters(ipAddress, port), ct);
    }

    private async Task<Otau> AddOtau(int ocmPortIndex, OtauType type, OtauDiscover discover,
        IOtauParameters parameters, CancellationToken ct)
    {
        ThrowIfOcmPortIndexNotValidOrTaken(ocmPortIndex);

        using var scope = _serviceScopeFactory.CreateScope();
        var otauRepository = scope.ServiceProvider.GetRequiredService<IOtauRepository>();

        var otauId = await otauRepository.AddOtau(type, ocmPortIndex,
            discover.SerialNumber, discover.PortCount, parameters);
        var otau = await otauRepository.GetOtau(otauId, CancellationToken.None);
        await CreateControllerAndInitializeOtau(otau, discover, CancellationToken.None);
        return otau;
    }

    private void ThrowIfOcmPortIndexNotValidOrTaken(int ocmPortIndex)
    {
        var ocmOtauManager = GetOcmOtauManager();
        if (ocmPortIndex < 1 || ocmPortIndex > ocmOtauManager.Otau.PortCount)
        {
            throw new Exception($"OcmPortIndex={ocmPortIndex} is not valid");
        }

        if (_otauMapByOcmPortIndex.ContainsKey(ocmPortIndex))
        {
            throw new Exception($"OcmPortIndex={ocmPortIndex} has already taken");
        }
    }

    public async Task<List<ChangedProperty>> UpdateOtau(int otauId, OtauPatch patch, CancellationToken ct)
    {
        using var scope = _serviceScopeFactory.CreateScope();
        var otauRepository = scope.ServiceProvider.GetRequiredService<IOtauRepository>();

        var changedProperties = await otauRepository.UpdateOtau(otauId, patch, ct);
        await UpdateOtauInOtauManager(otauRepository, otauId, ct);

        return changedProperties;
    }

    private async Task UpdateOtauInOtauManager(IOtauRepository otauRepository, int otauId, CancellationToken ct)
    {
        var otauManager = GetOtauManagerOrThrow(otauId);
        otauManager.Otau = await otauRepository.GetOtau(otauId, ct);
    }

    public Task<CombinedOtau> GetOtau(int otauId, CancellationToken ct)
    {
        var otauManager = GetOtauManagerOrThrow(otauId);
        var combinedOtau = new CombinedOtau(otauManager.Otau,
            new OtauInfo
            {
                IsConnected = otauManager.IsConnected,
                OnlineAt = otauManager.OnlineAt,
                OfflineAt = otauManager.OfflineAt
            });

        return Task.FromResult(combinedOtau);
    }

    public async Task<Otau> RemoveOtau(int otauId, CancellationToken ct)
    {
        var otauManager = GetOtauManagerOrThrow(otauId);
        if (otauManager.Otau.Type == OtauType.Ocm)
        {
            throw new Exception("OCM otau cannot be removed");
        }

        using var scope = _serviceScopeFactory.CreateScope();
        var otauRepository = scope.ServiceProvider.GetRequiredService<IOtauRepository>();

        using (await otauManager.Semaphore.LockAsync(ct))
        {
            await otauRepository.RemoveOtau(otauId, ct);
            await otauManager.Controller.Disconnect(ct);
            _otauMapById.TryRemove(otauId, out _);
            _otauMapByOcmPortIndex.TryRemove(otauManager.Otau.OcmPortIndex, out _);
            return otauManager.Otau;
        }
    }
}