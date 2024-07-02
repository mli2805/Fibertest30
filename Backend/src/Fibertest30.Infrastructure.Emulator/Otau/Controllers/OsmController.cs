namespace Fibertest30.Infrastructure.Emulator;

public class OsmController : EmulatedController
{
    public int ChainAddress { get; }
    public OsmController(int chainAddress, EmulatorSsePublisher ssePublisher, IEmulatorDelayService delayService)
    :base(ssePublisher, delayService, OtauType.Osm)
    {
        ChainAddress = chainAddress;
    }
    protected override OtauEmulatorProvider.OtauEmulatorSettings? GetSettings()
    {
        return _emulatorProvider.GetOsmSettings(ChainAddress);
    }
}