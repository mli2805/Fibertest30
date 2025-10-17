using System.Text.Json;

namespace Fibertest30.Application;

public class TrapReceiver
{
    public bool Enabled { get; set; }
    public string SnmpVersion { get; set; } = "v1";
    public bool UseIitOid { get; set; } = true;
    public string CustomOid { get; set; } = "";
    public string Community { get; set; } = "public";
    public string AuthoritativeEngineId { get; set; } = "";
    public string UserName { get; set; } = "";
    public bool IsAuthPswSet { get; set; }
    public string AuthenticationPassword { get; set; } = "";
    public string AuthenticationProtocol { get; set; } = "SHA";
    public bool IsPrivPswSet { get; set; }
    public string PrivacyPassword { get; set; } = "";
    public string PrivacyProtocol { get; set; } = "Aes256";
    public string TrapReceiverAddress { get; set; } = "192.168.96.21";
    public int TrapReceiverPort { get; set; } = 162;

    // влияет только на константы Состояние/Статус внутри трапов типа Fiber break / Обрыв волокна
    public string SnmpLanguage { get; set; } = "en-US";

    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}