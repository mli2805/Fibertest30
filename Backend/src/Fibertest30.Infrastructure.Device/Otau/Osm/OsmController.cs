using Microsoft.Extensions.Logging;

namespace Fibertest30.Infrastructure.Device;

// NOTE: Similarly to other OTAU controllers, this class is not multi-threaded. I.e., it does not
//       support simultaneous access. Additionally, OsmController uses shared OsmSerialPort
//       to communicate with OSM. I.e., all OSMs communicate via the same serial port. 
//       Thus, simultaneous access to different OsmControllers instances is also not supported.
//       It's expected that all the needed locks are performed at the upper level.

internal class OsmController : IOtauController
{
    // OSM communication proved to be unstable, therefore we perform
    // several attempts before failing.
    private const int _operationMaxAttempts = 6;

    private readonly ILogger _logger;
    private readonly OsmSerialPort _serialPort;
    private readonly OsmControllerProtocol _controllerProtocol;
    private readonly int _chainAddress;
    private bool _lastOperationFailed;

    public OsmController(OsmSerialPort serialPort, int chainAddress, IDelayService delayService, ILogger logger)
    {
        _logger = logger;
        _serialPort = serialPort;
        _chainAddress = chainAddress;
        _controllerProtocol = new OsmControllerProtocol(_serialPort, delayService, logger);
        _lastOperationFailed = false;
    }
    public OtauType OtauType => OtauType.Osm;

    public Task<bool> Blink(CancellationToken ct)
    {
        throw new NotImplementedException();
    }

    public Task<bool> Connect(CancellationToken ct)
    {
        // Removed Ping from here, since it takes significant amount of time
        // due to slow OSM communication, and makes Otau addition procedure slower.
        return Task.FromResult(true);
    }

    public Task Disconnect(CancellationToken ct)
    {
        return Task.CompletedTask;
    }

    public async Task<OtauDiscover?> Discover(CancellationToken ct)
    {
        var message = "Discovering OSM OTAU";
        var throwIfFailed = false;
        Func<CancellationToken, Task<OtauDiscover>> operation = async (ct) =>
        {
            ct.ThrowIfCancellationRequested();
            await _controllerProtocol.SelectSwitch(_chainAddress);

            // The code below is commented, since it adds about 5 seconds for each OSM at app start.
            //ct.ThrowIfCancellationRequested();
            //string controllerFirmwareVersion = await _controllerProtocol.GetFirmwareVersion();
            //_logger.LogDebug($"OSM OTAU controller FW version: {controllerFirmwareVersion}");

            ct.ThrowIfCancellationRequested();
            string response = await _controllerProtocol.PerformCommand(M3Protocol.GetInfo.Command());
            var info = M3Protocol.GetInfo.ParseResponse(response);
            _logger.LogDebug($"OSM OTAU discovered: {info.ModelOrPartNumber}, ver={info.Version}," +
                             $" sn={info.SerialNumber}, product={info.ProductNumber}");

            int portCount = DeducePortCountFromPartNumber(info.ModelOrPartNumber);

            return new OtauDiscover
            {
                SerialNumber = info.SerialNumber,
                PortCount = portCount
            };
        };

        return await Attempt(operation, message, _operationMaxAttempts, throwIfFailed, ct);
    }

    private int DeducePortCountFromPartNumber(string partNumber)
    {
        // NOTE: According to the HC M3 optical switch documentation, the model in the 
        //       response for <INFO_?> request should contain port count, e.g. MEMS-SM-1X288.
        //       But in production HC actually writes part number instead of model
        //       info this field. Part number does not contain parseable port count,
        //       and we need to get this info from the known part numbers list.
        // NOTE: The part numbers below are from email from Bonnie Chang, 05.02.2024 05:24,
        //       "RFTS-400 OSM part numbers" (original version was from the email from Cathy Tung,
        //       15.02.2022 04:05, "RFTS-400 OCM/OSM SW development for India demo").
        //       The table in the email also contained other info, like model name, supported wavelengths,
        //       connector types, but we don't use it for now.
        //       The same grouping used, as in the source table.
        switch (partNumber)
        {
        case "312-00-011G" : return 4;
        case "312-00-012G" : return 8;
        case "312-00-013G" : return 16;
        case "312-00-014G" : return 32;
        case "312-00-015G" : return 32;
        case "312-00-016G" : return 32;
        case "312-00-017G" : return 64;
        case "312-00-018G" : return 64;
        case "312-00-019G" : return 64;
        case "312-00-020G" : return 144;
        case "312-00-021G" : return 128;
        case "312-00-022G" : return 256;
        case "312-00-023G" : return 16;
        case "312-00-024G" : return 24;
        case "312-00-025G" : return 24;
        case "312-00-026G" : return 288;

        case "312-00-027G" : return 16;
        case "312-00-028G" : return 4;
        case "312-00-029G" : return 8;

        case "312-00-030G" : return 64;
        
        case "312-00-033G" : return 64;
        case "312-00-034G" : return 32;
        case "312-00-035G" : return 8;
        }

        // NOTE: We just throw an exception if the part number is not known.
        //       It means that we need to update the software with every new part number added.
        //       Alternatively we might also fallback to detecting actual port count by trying
        //       to actually switch, by binary search algorithm, as in OcmController class -
        //       but since OSM protocol is much slower and prove unreliable, such detection can take
        //       somewhat half a minute or more with retries.
        throw new UnsupportedOsmModuleConnectedException($"Unknown OSM OTAU part number {partNumber}." +
            " Upgrade the application by hardcoding port count for this part number.");
    }

    public async Task<bool> Ping(CancellationToken ct)
    {
        // NOTE: We use the same <INFO_?> request as a ping.
        //       There is another readonly (safe) operation, which we may use,
        //       <OSW_A_?>, which queries current channel, but then we need
        //       to implement it in M3Protocol just for ping.

        var message = $"Pinging OSM OTAU at address {_chainAddress}";
        var throwIfFailed = false;
        Func<CancellationToken, Task<bool>> operation = async (ct) =>
        {
            ct.ThrowIfCancellationRequested();
            await _controllerProtocol.SelectSwitch(_chainAddress);

            ct.ThrowIfCancellationRequested();
            string response = await _controllerProtocol.PerformCommand(M3Protocol.GetInfo.Command());
            M3Protocol.GetInfo.ParseResponse(response);

            return true;
        };

        // Don't speed too much time retrying in case OTAU failed previous time.
        int maxAttempts = _lastOperationFailed ? 1 : _operationMaxAttempts;

        return await Attempt(operation, message, maxAttempts, throwIfFailed, ct);
    }

    public async Task SetPort(int port, CancellationToken ct)
    {
        var message = $"Setting port of OSM OTAU at address {_chainAddress} to {port}";
        var throwIfFailed = true;
        Func<CancellationToken, Task<bool>> operation = async (ct) =>
        {
            ct.ThrowIfCancellationRequested();
            await _controllerProtocol.SelectSwitch(_chainAddress);

            ct.ThrowIfCancellationRequested();
            string response = await _controllerProtocol.PerformCommand(M3Protocol.SetPort.Command(port));
            M3Protocol.SetPort.CheckResponse(response, port);

            return true;
        };

        await Attempt(operation, message, _operationMaxAttempts, throwIfFailed, ct);
    }

    private async Task<T?> Attempt<T>(
        Func<CancellationToken, Task<T>> func, string message, 
        int maxAttempts, bool throwIfFailed,
        CancellationToken ct)
    {
        int attempt = 1;
        while (true)
        {
            try
            {
                _logger.LogDebug(attempt == 1 ? $"{message}..." : $"{message} (attempt {attempt} of {maxAttempts})...");
                T result = await func(ct);
                _lastOperationFailed = false;
                return result;
            }
            catch (OperationCanceledException) when (ct.IsCancellationRequested)
            {
                _logger.LogDebug($"{message} (attempt {attempt} of {maxAttempts}) was cancelled");
                throw; // rethrowing OperationCanceledException, since this is not 'normal' failure
            }
            catch (Exception ex)
            {
                _logger.LogDebug($"{message} (attempt {attempt} of {maxAttempts}) failed with exception: {ex}");
                ++attempt;
                _lastOperationFailed = true;
                if (attempt > maxAttempts)
                {
                    if (throwIfFailed)
                    {
                        throw;
                    }
                    else
                    {
                        return default;
                    }
                }
            }
        }
    }
}
