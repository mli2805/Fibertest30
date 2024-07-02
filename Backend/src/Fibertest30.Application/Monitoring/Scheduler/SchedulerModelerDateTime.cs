namespace Fibertest30.Application;

public class SchedulerModelerDateTime : IDateTime
{
    private DateTime _dateTime;
    
    public  static DateTime InitialTime => new DateTime(2020, 1, 1, 10, 00, 0, DateTimeKind.Utc);

    public SchedulerModelerDateTime()
    {
        _dateTime = InitialTime;
    }

    public DateTime UtcNow
    {
        get
        {
            return _dateTime;
            // var dateTime = _dateTime;
            // _dateTime = _dateTime.AddMilliseconds(1);
            // return dateTime;
        }

        set => _dateTime = value;
    }



    public void Add(TimeSpan span)
    {
        _dateTime = _dateTime.Add(span);
    }
    
    public void Set(DateTime dateTime)
    {
        _dateTime = dateTime;
    }
}