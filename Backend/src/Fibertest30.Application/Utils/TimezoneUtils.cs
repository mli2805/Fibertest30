namespace Fibertest30.Application;

public static class TimezoneUtils
{
    public static AppTimeZone ToAppTimeZone(this TimeZoneInfo timeZone)
    {
        return new AppTimeZone
        {
            IanaId = timeZone.ToIanaId(),
            DisplayName = timeZone.DisplayName,
            DisplayBaseUtcOffset = timeZone.BaseUtcOffset.ToBaseUtcOffsetString()
        };
    }

    public static string DateTimeToString(this DateTime dateTime, TimeZoneInfo timeZone)
    {
        dateTime = TimeZoneInfo.ConvertTimeFromUtc(dateTime, timeZone);
        return dateTime.ToString("yyyy-MM-dd HH:mm:ss");
    }

    public static string DateTimeToStringWithTimeZone(this DateTime dateTime, TimeZoneInfo timeZone)
    {
        dateTime = TimeZoneInfo.ConvertTimeFromUtc(dateTime, timeZone);
        return dateTime.ToString("yyyy-MM-dd HH:mm:ss (K)");
    }

    public static string ToBaseUtcOffsetString(this TimeSpan offset)
    {
        return $"UTC{(offset >= TimeSpan.Zero ? "+" : "-")}{offset:hh\\:mm}";
    }

    public static string ToIanaId(this TimeZoneInfo timeZone)
    {
        if (timeZone.HasIanaId)
        {
            // unix use IANA ID
            return timeZone.Id;
        }

        // windows use windows ID
        if (TimeZoneInfo.TryConvertWindowsIdToIanaId(timeZone.Id, out string? ianaId))
        {
            return ianaId;
        }

        // we shouldn't be here
        throw new Exception("Can't convert windows timezone to IANA ID, windows ID: " + timeZone.Id);
    }

    public static TimeZoneInfo FromAppTimeZone(this AppTimeZone appTimeZone)
    {
        // Throws TimeZoneNotFoundException if IanaId is unknown
        return TimeZoneInfo.FindSystemTimeZoneById(appTimeZone.IanaId);
    }
}