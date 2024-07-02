namespace Fibertest30.Application;

public class TimeSpanMaxMinAverage
{
    private TimeSpan? _min;
    private TimeSpan? _max;
    private TimeSpan _sum;
    private int _count;

    public TimeSpan Min
    {
        get
        {
            if (_min == null)
            {
                throw new Exception("No values added");
            }
            return _min.Value;
        }
    }

    public TimeSpan Max
    {
        get
        {
            if (_max == null)
            {
                throw new Exception("No values added");
            }

            return _max.Value;
        }
    }

    public TimeSpan Average
    {
        get
        {
            if (_count == 0)
            {
                return TimeSpan.Zero;
            }
            
            return _sum / _count;
        }
    }
    
    public void Add(TimeSpan value)
    {
        if (!_min.HasValue || value < _min.Value)
        {
            _min = value;
        }
        
        if (!_max.HasValue || value > _max.Value)
        {
            _max = value;
        }
        
        _sum += value;
        _count++;
    }
}