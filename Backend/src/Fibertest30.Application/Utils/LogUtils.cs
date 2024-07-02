namespace Fibertest30.Application;

public static class LogUtils
{
    public static string ToLogDateTime(this DateTime dateTime)
    {
        return dateTime.ToString("yyyy-MM-dd HH:mm:ss");
    }
}