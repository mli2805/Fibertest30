namespace Fibertest30.Application;

// Should we add something like estimated time-to-completion (or time-to-start) here?
public record OtdrTaskProgress(int QueuePosition, string Status, double Progress, DateTime CompletedAt, string StepName = "");