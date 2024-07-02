using Google.Protobuf.WellKnownTypes;

namespace Fibertest30.Api;

public static class TimestampMappingExtensions
{
    public static Timestamp ToTimestamp(this DateTime dateTime)
    {
        return Timestamp.FromDateTime(DateTime.SpecifyKind(dateTime, DateTimeKind.Utc));
    }
    
    public static Timestamp? ToTimestamp(this DateTime? dateTime)
    {
        return dateTime?.ToTimestamp();
    }
}