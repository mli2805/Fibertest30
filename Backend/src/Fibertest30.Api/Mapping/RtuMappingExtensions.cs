namespace Fibertest30.Api;

public static class RtuMappingExtensions
{
    public static AppTimeZone ToProto(this Fibertest30.Application.AppTimeZone timeZone)
    {
        return new AppTimeZone
        {
            IanaId = timeZone.IanaId,
            DisplayName =  timeZone.DisplayName,
            DisplayBaseUtcOffset = timeZone.DisplayBaseUtcOffset
        };
    }

    public static Application.AppTimeZone FromProto(this AppTimeZone appTimeZone)
    {
        return new Application.AppTimeZone
        {
            IanaId = appTimeZone.IanaId, 
            DisplayName = appTimeZone.DisplayName, 
            DisplayBaseUtcOffset = appTimeZone.DisplayBaseUtcOffset
        };
    }
    
  
  
 
   

}