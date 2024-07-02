namespace Fibertest30.Application;

public static class TimeUtils
{
    private static readonly DateTime _dateTimeOrigin = new(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);

    public static long ToPrometheusTimestamp(this DateTime dt)
    {
        return ToPrometheusTimestampSeconds(dt) * 1000;
    }

    public static long ToPrometheusTimestampSeconds(this DateTime dt)
    {
        var diff = dt - _dateTimeOrigin;
        return (long)diff.TotalSeconds;
    }

    public static DateTime FromUnixTime(this long unixTime)
    {
        return _dateTimeOrigin.AddSeconds(unixTime);
    }

    public static long ToUnixTime(this DateTime date)
    {
        return Convert.ToInt64((date - _dateTimeOrigin).TotalSeconds);
    } 

}