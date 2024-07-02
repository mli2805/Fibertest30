namespace Fibertest30.Application;

public interface IDeviceInfoProvider
{
    public string GetSerialNumber();
    public string GetIpV4Address();
    public TimeZoneInfo GetTimeZone();
    public void UpdateTimeZone(AppTimeZone timeZone);
}