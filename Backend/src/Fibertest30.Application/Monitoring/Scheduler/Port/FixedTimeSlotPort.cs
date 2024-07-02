namespace Fibertest30.Application;

public class FixedTimeSlotPort : ScheduledPort
{
    List<TimeSlot> TimeSlots { get; set; }

    public FixedTimeSlotPort(int portId, TimeSpan testTime, List<TimeSlot> timeSlots,
        DateTime? lastRun = null)
        : base(portId, testTime, lastRun)
    {
        if (timeSlots.Count == 0)
        {
            throw new ArgumentException($"{nameof(timeSlots)} list must not be empty.");
        }
        
        bool isInOrder =timeSlots.Select(x => x.Start)
            .SequenceEqual(timeSlots.Select(x => x.Start).OrderBy(x => x));
        
        if (!isInOrder)
        {
            throw new ArgumentException($"{nameof(timeSlots)} must be in order");
        }
        
        timeSlots.ForEach(x =>
        {
            if (x.End - x.Start < TestTime)
            {
                throw new ArgumentException($"Time slot must be greater than test time. TimeSlot: {x}, TestTime: {TestTime}");
            }
        });
        
        TimeSlots = timeSlots;
    }

    protected override DateTime CalculateNextRun(DateTime now)
    {
        foreach (var timeSlot in TimeSlots)
        {
            DateTime startTime = now.Date + timeSlot.Start.ToTimeSpan();
            
            DateTime endTime = 
                timeSlot.EndIsAnotherDayMidnight 
                    ? now.Date.AddDays(1) 
                    : now.Date + timeSlot.End.ToTimeSpan();

            if (now < startTime )
            {
                return startTime;
            }
            else if (now >= startTime 
                     && now < endTime 
                     && LastRun < startTime
                    )
            {
                return startTime;
            }
        }
            
        // If here, means there is no time slot at this day
        return now.Date.AddDays(1) + TimeSlots[0].Start.ToTimeSpan();
    }
}