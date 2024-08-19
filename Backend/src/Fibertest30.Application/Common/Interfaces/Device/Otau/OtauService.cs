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

   
   

  
  
  
 
  
}