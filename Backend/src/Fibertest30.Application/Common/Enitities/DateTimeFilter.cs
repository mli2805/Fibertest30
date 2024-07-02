namespace Fibertest30.Application;

public class DateTimeFilter
{
    /// <summary>
    /// Defines a time range for filtering search results. Only one of SearchWindow or RelativeFromNow should be set.
    /// Start is inclusive. End is exclusive.
    /// </summary>
    public DateTimeRange? SearchWindow { get; set; }

    /// <summary>
    /// Specifies a time span relative to the current time for filtering, providing an alternative to SearchWindow.
    /// RelativeFromNow creates End from UtcNow and Start as a result of "End - RelativeFromNow".
    /// Start is exclusive. End is inclusive.
    /// </summary>
    public TimeSpan? RelativeFromNow { get; set; }

    /// <summary>
    /// Sets a specific start time to begin loading new entries, useful for pagination in data fetching.
    /// LoadSince is exclusive and changing direction depending on OrderDescending.
    /// </summary>
    public DateTime? LoadSince { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether the order is descending or ascending.
    /// </summary>
    public bool OrderDescending { get; set; }
}