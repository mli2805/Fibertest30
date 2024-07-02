namespace Fibertest30.Application;

public class TimeSlot
{
    public static TimeSlot Parse(string timeSlotString)
    {
        var times = timeSlotString.Split('-');
        var start = TimeOnly.Parse(times[0]);
        var end = TimeOnly.Parse(times[1]);
        return new TimeSlot(start, end);
    }
    
    public TimeOnly  Start { get; }
    public TimeOnly  End { get; }
    public bool EndIsAnotherDayMidnight => End == TimeOnly.MinValue;

    public TimeSlot(TimeOnly  start, TimeOnly  end)
    {
        if (start >= end && end != TimeOnly.MinValue)
        {
            throw new ArgumentException("Start must be greater than end.");
        }
        
        Start = start;
        End = end;
    }
    
    public override string ToString()
    {
        return $"{Start:HH:mm}-{End:HH:mm}";
    }
}