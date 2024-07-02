namespace Fibertest30.Infrastructure.Device.OtdrMeasEngine;

public class Settings
{
    public const string SectionName = "OtdrMeasEngine";

    public string? ServerHost { get; set; }
    public int ServerPort { get; set; }

    public Settings Validate()
    {
        // TODO: Consider using the required C#11 keyword and Microsoft.Extensions.Options.DataAnnotations for this instead
        if (ServerHost == null)
        {
            throw new ArgumentNullException(nameof(ServerHost));
        }
        if (ServerPort <= 0)
        {
            throw new ArgumentException(nameof(ServerPort));
        }
        return this;
    }
}