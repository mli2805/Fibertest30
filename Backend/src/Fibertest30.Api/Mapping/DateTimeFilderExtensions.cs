namespace Fibertest30.Api;

public static class DateTimeFilterExtensions
{
    public static Fibertest30.Application.DateTimeRange FromProto(this DateTimeRange dateTimeRange)
    {
        return new Application.DateTimeRange()
        {
            Start = dateTimeRange.Start.ToDateTime(),
            End = dateTimeRange.End.ToDateTime()
        };
    }
    
    public static Fibertest30.Application.DateTimeFilter FromProto(this DateTimeFilter? dateTimeFilter)
    {
        if (dateTimeFilter == null)
        {
            // return default DateTimeFilter, which is invalid (both SearchWindow and RelativeFromNow are null)
            // will be validated later by application validation pipeline
            // to get meaningful error message
            return new Application.DateTimeFilter();
        }
        
        return new Application.DateTimeFilter()
        {
            SearchWindow = dateTimeFilter.SearchWindow?.FromProto(),
            RelativeFromNow = dateTimeFilter.RelativeFromNow?.ToTimeSpan(),
            LoadSince = dateTimeFilter.LoadSince?.ToDateTime(),
            OrderDescending = dateTimeFilter.OrderDescending
        };
    }
}