using Google.Protobuf.WellKnownTypes;

namespace Fibertest30.Api;

public static class OtauMappingExtensions
{
    public static OtauDiscover? ToProto(this Fibertest30.Application.OtauDiscover? discover)
    {
        if (discover == null) { return null; }
        return new OtauDiscover { SerialNumber = discover.SerialNumber, PortCount = discover.PortCount };
    }

    public static OtauDiscoverResult ToProto(this Application.OtauDiscoverResult discoverResult)
    {
        var result = new OtauDiscoverResult();
        result.Discover = discoverResult.Discover.ToProto();
        result.Error = (OtauDiscoverError)discoverResult.Error;
        return result;
    }

    public static Otau ToProto(this CombinedOtau otau)
    {
        return new Otau()
        {
            Id = otau.Otau.Id,
            Type = otau.Otau.Type.ToString(),
            OcmPortIndex = otau.Otau.OcmPortIndex,
            PortCount = otau.Otau.PortCount,
            SerialNumber = otau.Otau.SerialNumber,
            Name = otau.Otau.Name,
            Location = otau.Otau.Location,
            Rack = otau.Otau.Rack,
            Shelf = otau.Otau.Shelf,
            Note = otau.Otau.Note,
            JsonParameters = otau.Otau.Parameters.ToJsonData(),
            IsConnected = otau.OtauInfo.IsConnected,
            OnlineAt = otau.OtauInfo.OnlineAt.ToTimestamp(),
            OfflineAt = otau.OtauInfo.OfflineAt.ToTimestamp(),
            Ports = { otau.Otau.Ports.Select(x => x.ToProto()) }
        };
    }

    public static OtauPort ToProto(this Fibertest30.Application.OtauPort otauPort)
    {
        return new OtauPort
        {
            Id = otauPort.Id,
            PortIndex = otauPort.PortIndex,
            Unavailable = otauPort.Unavailable,
            MonitoringPortId = otauPort.MonitoringPortId,
            OtauId = otauPort.OtauId
        };
    }

  
    public static MonitoringPort ToProto(this Fibertest30.Application.MonitoringPort port)
    {
        var proto = new MonitoringPort
        {
            Id = port.Id,
            Note = port.Note,
            OtauPortId = port.OtauPortId,
            OtauId = port.OtauId,
            Status = (MonitoringPortStatus)port.Status, 
            SchedulerMode = (MonitoringSchedulerMode)port.Mode,
            Baseline = port.Baseline?.ToProto(),
            TimeSlotIds = { port.TimeSlots.Select(x => x.Id) },
        };
        
        if (port.Interval.HasValue)
        {
            proto.Interval = Duration.FromTimeSpan(port.Interval.Value);
        }
        
        return proto;
    }

    public static MonitoringTimeSlot ToProto(this Fibertest30.Application.MonitoringTimeSlot timeSlot)
    {
        return new MonitoringTimeSlot
        {
            Id = timeSlot.Id,
            Start = timeSlot.StartTime.ToProtoTimeOnlyHourMinute(),
            End = timeSlot.EndTime.ToProtoTimeOnlyHourMinute()
        };
    }
    
    public static TimeOnlyHourMinute ToProtoTimeOnlyHourMinute(this TimeOnly time)
    {
        return new TimeOnlyHourMinute
        {
            Hour = time.Hour,
            Minute = time.Minute
        };
    }
}