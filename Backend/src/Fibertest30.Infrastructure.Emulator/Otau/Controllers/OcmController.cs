namespace Fibertest30.Infrastructure.Emulator;

public class OcmController : EmulatedController
{
    public OcmController(EmulatorSsePublisher ssePublisher, IEmulatorDelayService delayService)
    :base(ssePublisher, delayService, OtauType.Ocm)
    {
    }

    protected override OtauEmulatorProvider.OtauEmulatorSettings? GetSettings()
    {
        return _emulatorProvider.GetOcmSettings();
    }
}
