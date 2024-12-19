namespace Fibertest30.TestUtils;

// The intention of this class is to have a manageable time for tests
// Note: be aware that some of  external dependencies, like JwtSecurityTokenHandler.Validate use current system time
// That's why we disable lifetime token validation in tests
public class TestDateTime : IDateTime
{
    private readonly bool _autoAddSecondOnUtcNow;
    private DateTime _dateTime;

    public TestDateTime(bool autoAddSecondOnUtcNow = true)
    {
        _autoAddSecondOnUtcNow = autoAddSecondOnUtcNow;
        _dateTime = new DateTime(2020, 1, 2, 11, 30, 0, DateTimeKind.Utc);
    }

    public DateTime UtcNow
    {
        get
        {
            var dateTime = _dateTime;
            if (_autoAddSecondOnUtcNow)
            {
                _dateTime = _dateTime.AddSeconds(1);
            }
            return dateTime;
        }

        set
        {
            _dateTime = value;
        }
    } 
}
