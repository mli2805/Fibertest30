using System.Diagnostics.CodeAnalysis;
using System.Reactive;

namespace Fibertest30.Application;

public interface IOtdrTasksService
{
    IObservable<Unit> QueuePositionChanged { get; }
    Task<OtdrTaskPriority> WaitForOtdrTask(CancellationToken ct);
    OtdrTask? ReadOtdrTaskFromChannel(OtdrTaskPriority priority);
    bool WriteOtdrTaskToChannel(OtdrTask task);
    bool TryAdd(OtdrTask task);
    bool TryGetValue(string taskId, [MaybeNullWhen(false)] out OtdrTask task);
    bool TryRemoveTask(string taskId, [MaybeNullWhen(false)] out OtdrTask task);
    ICollection<OtdrTask> GetTasksCopy();
}