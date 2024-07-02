using System.Text.Json;

namespace Fibertest30.Application;

public class TrapReceiver
{
    public bool Enabled { get; set; }
    public string SnmpVersion { get; set; } = "v1";
    public bool UseVeexOid { get; set; } = true;
    public string CustomOid { get; set; } = null!;
    public string Community { get; set; } = null!;
    public string AuthoritativeEngineId { get; set; } = null!;
    public string UserName { get; set; } = null!;
    public bool IsAuthPswSet { get; set; }
    public string AuthenticationPassword { get; set; } = null!;
    public string AuthenticationProtocol { get; set; } = null!;
    public bool IsPrivPswSet { get; set; }
    public string PrivacyPassword { get; set; } = null!;
    public string PrivacyProtocol { get; set; } = null!;
    public string TrapReceiverAddress { get; set; } = null!;
    public int TrapReceiverPort { get; set; }

    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}