namespace Fibertest30.Infrastructure.Emulator;

public class OtauControllerFactory : IOtauControllerFactory
{
    private readonly EmulatorSsePublisher _ssePublisher;
    private readonly IEmulatorDelayService _delayService;

    public OtauControllerFactory(EmulatorSsePublisher ssePublisher, IEmulatorDelayService delayService)
    {
        _ssePublisher = ssePublisher;
        _delayService = delayService;
    }
    
    public IOtauController CreateOcm()
    {
        return new OcmController(_ssePublisher, _delayService);
    }

    public IOtauController CreateOsm(int chainAddress)
    {
        return new OsmController(chainAddress, _ssePublisher, _delayService);
    }

    public IOtauController CreateOxc(string ip, int port)
    {
        return new OxcController(ip, port, _ssePublisher, _delayService);
    }
}