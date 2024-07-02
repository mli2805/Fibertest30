using System.Text.Json;

namespace Fibertest30.Application;
public class EmailServer
{
    public bool Enabled { get; set; }
    public string ServerAddress { get; set; } = null!;
    public int ServerPort { get; set; }
    public string OutgoingAddress { get; set; } = null!;
    public bool IsAuthenticationOn { get; set; } = true;
    public string ServerUserName { get; set; } = null!;
    public bool IsPasswordSet { get; set; }
    public string ServerPassword { get; set; } = null!;
    public bool VerifyCertificate { get; set; }
    public bool FloodingPolicy { get; set; }
    public bool SmsOverSmtp { get; set; }

    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}