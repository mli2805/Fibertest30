namespace Iit.Fibertest.Dto;
public class UpdateRtuStationDto
{
    public Guid RtuGuid { get; set; }
    public string? Version { get; set; }
    public bool Success { get; set; }
    public DateTime? ConnectedAt { get; set; } // if failed to connect set to NULL
    public DateTime? LastMeasurementTimestamp { get; set; } // if failed to connect or has no measurement in lass polling set to NULL
}
