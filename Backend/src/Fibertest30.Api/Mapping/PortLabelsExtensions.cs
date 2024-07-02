namespace Fibertest30.Api;

public static class PortLabelsExtensions
{
    public static PortLabel ToProto(this Fibertest30.Application.PortLabel portLabel)
    {
        return new PortLabel
        {
            Id = portLabel.Id,
            Name = portLabel.Name,
            HexColor = portLabel.HexColor,
            MonitoringPortIds = { portLabel.MonitoringPortIds }
        };
    }
}