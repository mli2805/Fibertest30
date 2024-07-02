using Microsoft.Extensions.Logging;

namespace Fibertest30.Infrastructure.Device;
public class OcmController : IOtauController
{
    private readonly ILogger _logger;
    private readonly OcmProtocol _protocol;

    // TODO: Consider extracting sysfs code to a separate class
    private string? TryReadSysfs(string path)
    {
        try
        {
            return File.ReadAllText(path, System.Text.Encoding.ASCII);
        }
        catch { return null; }
    }

    private bool TryWriteSysfs(string path, string content)
    {
        // E.g. may give System.IO.IOException: Device or resource busy : '/sys/class/gpio/export'
        // in case pin already exported.
        try
        {
            File.WriteAllText(path, content, System.Text.Encoding.ASCII);
            return true;
        }
        catch { return false; }
    }

    private void EnableChip(bool reset)
    {
        // GPIO pins according to RFTS-400-OCM-board-resource-V3.doc.
        // NOTE: Using deprecated sysfs. Consider switching to libgpiod.

        const int pin = 15;
        const string exportPath = "/sys/class/gpio/export";
        string directionPath = $"/sys/class/gpio/gpio{pin}/direction";
        string valuePath = $"/sys/class/gpio/gpio{pin}/value";
        const string resetDisabled = "1";
        const string resetEnabled = "0";

        string? currentValue = TryReadSysfs(valuePath);

        // If pin already in the needed state and we don't need reset
        if (currentValue == resetDisabled && !reset)
            return;

        // If there is no current value, then probably pin is not yet exported to sysfs
        if (currentValue == null)
        {
            TryWriteSysfs(exportPath, $"{pin}");
            TryWriteSysfs(directionPath, "out");
        }

        // If we need to reset, and pin is not yet in reset state
        if (reset && currentValue != resetEnabled)
        {
            // Reset the chip, give it some time to reset.
            TryWriteSysfs(valuePath, resetEnabled);
            Thread.Sleep(100);
        }

        // Enable chip and give it some time to get up.
        TryWriteSysfs(valuePath, resetDisabled);
        Thread.Sleep(1000);
    }

    public OcmController(IOcmSerialPort serialPort, IDelayService delayService, ILogger logger)
    {
        _logger = logger;

        _logger.LogDebug("Enabling OCM OTAU chip...");
        EnableChip(reset: true);

        _protocol = new OcmProtocol(serialPort, delayService);
    }

    public OtauType OtauType => OtauType.Ocm;

    public Task<bool> Blink(CancellationToken ct)
    {
        throw new NotImplementedException();
    }

    public Task<bool> Connect(CancellationToken ct)
    {
        return Ping(ct);
    }

    public Task Disconnect(CancellationToken ct)
    {
        return Task.CompletedTask;
    }

    private async Task ReadAndLogOcmTechnicalInfo(CancellationToken ct)
    {
        ct.ThrowIfCancellationRequested();
        Tuple<UInt16, UInt16> manufacturerId = await _protocol.QueryManufacturerId();
        _logger.LogDebug($"OCM OTAU manufacturer ID: {manufacturerId.Item1:X}:{manufacturerId.Item2:X}");

        ct.ThrowIfCancellationRequested();
        string manufacturerName = await _protocol.QueryManufacturerName();
        _logger.LogDebug($"OCM OTAU manufacturer name: {manufacturerName}");

        ct.ThrowIfCancellationRequested();
        string firmwareVersion = await _protocol.QueryFirmwareVersion();
        _logger.LogDebug($"OCM OTAU firmware version: {firmwareVersion}");

        ct.ThrowIfCancellationRequested();
        string hardwareVersion = await _protocol.QueryHardwareVersion();
        _logger.LogDebug($"OCM OTAU hardware version: {hardwareVersion}");

        ct.ThrowIfCancellationRequested();
        string productionDate = await _protocol.QueryProductionDate();
        _logger.LogDebug($"OCM OTAU production date: {productionDate}");
    }

    private async Task<bool> TrySetPort(int port)
    {
        _logger.LogDebug($"Trying to change port of OCM OTAU to {port}...");
        try
        {
            await _protocol.SetChannel(port-1); // Protocol expected 0-based index
            _logger.LogDebug($"{port} is valid OCM OTAU port");
            return true;
        }
        catch (ArgumentException)
        {
            _logger.LogDebug($"{port} is NOT valid OCM OTAU port");
        }
        return false;
    }

    private async Task<int> DeterminePortCount(CancellationToken ct)
    {
        /// NOTE: There is no command to query the number of OCM OTAU ports.
        ///       Instead, we use the binary search algorithm by trying to set
        ///       to i-th port and check if it succeeds.

        _logger.LogDebug("Trying to determine OCM OTAU port count...");

        ct.ThrowIfCancellationRequested();
        const int minPossiblePortIndex = 1; // 1-based
        if (!await TrySetPort(minPossiblePortIndex))
        {
            throw new Exception($"Failed to change OCM port to {minPossiblePortIndex}." + 
                " Unable to determine port count.");
        }

        /// NOTE: According to Bonnie, built-in OCM M1 or M2 switches can have 4, 8 or 16
        ///       output ports, depending on customer's choice. The binary search 
        ///       below is pretty quick, so we can afford ourselves to have some
        ///       safe margin for future upgrades - let's use 32 ports for maximum.
        ct.ThrowIfCancellationRequested();
        const int maxPossiblePortIndex = 32; // 1-based
        if (await TrySetPort(maxPossiblePortIndex))
        {
            return maxPossiblePortIndex;
        }

        int lastGoodPort = minPossiblePortIndex;
        int lastBadPort = maxPossiblePortIndex;
        while (lastBadPort - lastGoodPort >= 2)
        {
            ct.ThrowIfCancellationRequested();
            int currentPort = (lastBadPort + lastGoodPort) / 2;
            if (await TrySetPort(currentPort))
                lastGoodPort = currentPort;
            else
                lastBadPort = currentPort;
        }
        return lastGoodPort;
    }

    public async Task<OtauDiscover?> Discover(CancellationToken ct)
    {
        try
        {
            _logger.LogDebug("Discovering OCM OTAU...");

            await ReadAndLogOcmTechnicalInfo(ct);

            string serialNumber = await _protocol.QuerySerialNumber();

            int portCount = await DeterminePortCount(ct);

            _logger.LogDebug($"OCM OTAU discovered: s/n {serialNumber}, port count {portCount}");

            return new OtauDiscover
            {
                SerialNumber = serialNumber,
                PortCount = portCount
            };
        }
        catch (Exception ex)
        {
            _logger.LogDebug($"Exception while discovering OCM OTAU: {ex}");
            return null;
        }
    }

    public async Task<bool> Ping(CancellationToken ct)
    {
        try
        {
            _logger.LogDebug("Pinging OCM OTAU...");
            await _protocol.QueryChannel();
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogDebug($"Exception while pinging OCM OTAU: {ex}");
            return false;
        }
    }

    public Task SetPort(int port, CancellationToken ct)
    {
        _logger.LogDebug($"Changing port of OCM OTAU to {port}...");
        return _protocol.SetChannel(port-1); // protocol expected 0-based index
    }
}
