using System.Text.Json;

namespace Fibertest30.Infrastructure.Emulator;

public abstract class EmulatedController : IOtauController 
{
    protected readonly OtauEmulatorProvider _emulatorProvider = new();

    private readonly EmulatorSsePublisher _ssePublisher;
    private readonly IEmulatorDelayService _delayService;

    protected EmulatedController(EmulatorSsePublisher ssePublisher, IEmulatorDelayService delayService,  OtauType otauType)
    {
        _ssePublisher = ssePublisher;
        _delayService = delayService;
        OtauType = otauType;
    }
    
    public OtauType OtauType { get; }

    protected abstract OtauEmulatorProvider.OtauEmulatorSettings? GetSettings();
    public async Task<OtauDiscover?> Discover(CancellationToken ct)
    {
        var settings = GetSettings();
        if (settings?.Exceptions?.UnknownOsmModel ?? false)
        {
            throw new UnsupportedOsmModuleConnectedException($"Unknown OSM OTAU part number XXX-XXX-XXX." +
                " Upgrade the application by hardcoding port count for this part number.");
        }
        if (settings?.Exceptions?.Discover ?? false)
        {
            throw new Exception($"Emulated OTAU {OtauType} discover exception");
        }
        
        await _delayService.EmulateDelay(ct);
        if (settings == null || settings.Offline)
        {
            return null;
        }
        
        await _ssePublisher.SendSeeUpdate(JsonSerializer.Serialize(new        {
            Type = "OtauController",
            Action = OtauControllerAction.Discover.ToString(),
            EmulatedOtauId = settings.EmulatedOtauId,
        }));
        
        return new OtauDiscover
        {
            // change serial number if port are changed to emulate new otau
            SerialNumber = GetSerialNumber(OtauType, settings.PortCount), 
            PortCount = settings.PortCount
        };
        
    }

    public async Task<bool> Ping(CancellationToken ct)
    {
        var settings = GetSettings();
        if (settings?.Exceptions?.Ping == true)
        {
            throw new Exception($"Emulated OTAU {OtauType} ping exception");
        }
        
        await _delayService.EmulateDelay(ct);
        if (settings == null || settings.Offline)
        {
            return false;
        }
        
        await _ssePublisher.SendSeeUpdate(JsonSerializer.Serialize(new        {
            Type = "OtauController",
            Action = OtauControllerAction.Ping.ToString(),
            EmulatedOtauId = settings.EmulatedOtauId,
        }));
        
        return true;
    }

    public async Task<bool> Connect(CancellationToken ct)
    {
        var settings = GetSettings();
        if (settings?.Exceptions?.Connect ?? false)
        {
            throw new Exception($"Emulated OTAU {OtauType} connect exception");
        }
        
        await _delayService.EmulateDelay(ct);
        if (settings == null || settings.Offline)
        {
            return false;
        }
        
        await _ssePublisher.SendSeeUpdate(JsonSerializer.Serialize(new        {
            Type = "OtauController",
            Action = OtauControllerAction.Connect.ToString(),
            EmulatedOtauId = settings.EmulatedOtauId,
        }));
        
        return true;
    }

    public async Task Disconnect(CancellationToken ct)
    {
        var settings = GetSettings();
        if (settings?.Exceptions?.Disconnect ?? false)
        {
            throw new Exception($"Emulated OTAU {OtauType} disconnect exception");
        }
        
        await _delayService.EmulateDelay(ct);
        if (settings == null )
        {
            return;
        }
        
        await _ssePublisher.SendSeeUpdate(JsonSerializer.Serialize(new        {
            Type = "OtauController",
            Action = OtauControllerAction.Disconnect.ToString(),
            EmulatedOtauId = settings.EmulatedOtauId
        }));
    }

    public async Task SetPort(int port, CancellationToken ct)
    {
        var settings = GetSettings();
        if (settings?.Exceptions?.SetPort ?? false)
        {
            throw new Exception($"Emulated OTAU {OtauType} setPort exception");
        }
        
        await _delayService.EmulateDelay(ct);
        if (settings == null || settings.Offline)
        {
            throw new Exception($"Emulated OTAU {OtauType} setPort exception. Otau is offline");
        }
        
        await _ssePublisher.SendSeeUpdate(JsonSerializer.Serialize(new        {
            Type = "OtauController",
            Action = OtauControllerAction.SetPort.ToString(),
            EmulatedOtauId = settings.EmulatedOtauId,
            Port = port
        }));
    }

    public async Task<bool> Blink(CancellationToken ct)
    {
        var settings = GetSettings();
        if (settings?.Exceptions?.Blink ?? false)
        {
            throw new Exception($"Emulated OTAU {OtauType} blink exception");
        }

        await _delayService.EmulateDelay(ct);
        if (settings == null || settings.Offline)
        {
            return false;
        }
       
        if (settings.SupportBlink)
        {
            await _ssePublisher.SendSeeUpdate(JsonSerializer.Serialize(new        {
                Type = "OtauController",
                Action = OtauControllerAction.Blink.ToString(),
                EmulatedOtauId = settings.EmulatedOtauId
            }));
        }

        return settings.SupportBlink;
    }

    public static string GetSerialNumber(OtauType otauType, int portCount)
    {
        return $"Emulated{otauType}{portCount}";
    }
}