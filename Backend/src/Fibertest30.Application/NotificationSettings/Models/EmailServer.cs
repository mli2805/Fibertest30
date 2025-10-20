using System.Text.Json;

namespace Fibertest30.Application;
public class EmailServer
{
    public bool Enabled { get; set; }
    public string ServerAddress { get; set; } = "";
    public int ServerPort { get; set; }
    public bool IsSslOn { get; set; }
    public string OutgoingAddress { get; set; } = "";
    public bool IsAuthenticationOn { get; set; } = true;
    public string ServerUserName { get; set; } = "";
    public bool IsPasswordSet { get; set; }
    public string ServerPassword { get; set; } = "";
    public bool VerifyCertificate { get; set; }
    public bool FloodingPolicy { get; set; }
    public bool SmsOverSmtp { get; set; }

    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}