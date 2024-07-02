namespace Fibertest30.Infrastructure.Emulator;

public class OxcController : EmulatedController
{
    public string Ip { get; set; }
    public int Port { get; set; }
    public OxcController(string ip, int port, EmulatorSsePublisher ssePublisher, IEmulatorDelayService delayService)
    :base(ssePublisher, delayService, OtauType.Oxc)
    {
        Ip = ip;
        Port = port;
    }
    protected override OtauEmulatorProvider.OtauEmulatorSettings? GetSettings()
    {
        return _emulatorProvider.GetOxcSettings(Ip, Port);
    }
}