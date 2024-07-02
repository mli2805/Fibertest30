namespace Fibertest30.Application;
public class OtdrTraceSpanParameters
{
    /// <summary>
    /// Index of the event, which corresponds to the beginning of span.
    /// Raw (not merger) event indices here: 0 - beginning of fiber, 1 - second event,
    /// -1 - end of fiber, -2 - event before end of fiber.
    /// </summary>
    public int BeginningEventIndex { get; set; } = 0;

    /// <summary>
    /// Index of the event, which corresponds to the end of span.
    /// Same indexing scheme as BegginningEventIndex.
    /// </summary>
    public int EndEventIndex { get; set; } = -1;

    public bool IncludeBeginningEventLoss { get; set; } = true;

    public bool IncludeEndEventLoss { get; set; } = true;

    public double BeginningEventCompensatedLoss { get; set; }

    public double EndEventCompensatedLoss { get; set; }
}
