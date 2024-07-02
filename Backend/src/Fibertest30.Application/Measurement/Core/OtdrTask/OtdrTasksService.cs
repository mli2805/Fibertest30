using System.Collections.Concurrent;
using System.Diagnostics.CodeAnalysis;
using System.Reactive;
using System.Reactive.Linq;
using System.Reactive.Subjects;
using System.Threading.Channels;

namespace Fibertest30.Application;

public class OtdrTasksService : IOtdrTasksService
{
    private readonly Dictionary<OtdrTaskPriority, Channel<OtdrTask>> _channels  =
        new()
        {
            { OtdrTaskPriority.UserTask, Channel.CreateUnbounded<OtdrTask>() },
            { OtdrTaskPriority.AutoTask, Channel.CreateUnbounded<OtdrTask>() },
            { OtdrTaskPriority.Monitoring, Channel.CreateUnbounded<OtdrTask>() },
        };
    
    private readonly ConcurrentDictionary<string, OtdrTask> _tasks  = new();
    private readonly Subject<Unit> _queuePositionSubject = new();
    
    public IObservable<Unit> QueuePositionChanged => _queuePositionSubject.AsObservable();

    public async Task<OtdrTaskPriority> WaitForOtdrTask(CancellationToken ct)
    {
        var userTask = _channels[OtdrTaskPriority.UserTask].Reader.WaitToReadAsync(ct).AsTask();
        var autoTask = _channels[OtdrTaskPriority.AutoTask].Reader.WaitToReadAsync(ct).AsTask();
        var monitoring = _channels[OtdrTaskPriority.Monitoring].Reader.WaitToReadAsync(ct).AsTask();
        var readyTask = await Task.WhenAny(userTask, autoTask, monitoring);

        if (readyTask == userTask)
        {
            return OtdrTaskPriority.UserTask;
        } 
        
        if (readyTask == autoTask)
        {
            return OtdrTaskPriority.AutoTask;
        }

        return OtdrTaskPriority.Monitoring;

    }

    public OtdrTask? ReadOtdrTaskFromChannel(OtdrTaskPriority priority)
    {
        _channels[priority].Reader.TryRead(out var task);
        return task;
    }

    public bool WriteOtdrTaskToChannel(OtdrTask task)
    {
        return _channels[task.Priority].Writer.TryWrite(task);
    }

    public bool TryAdd(OtdrTask task)
    {
        var result = _tasks.TryAdd(task.Id, task);
        if (result)
        {
            _queuePositionSubject.OnNext(Unit.Default);
        }
        return result;
    }

    public bool TryGetValue(string taskId, [MaybeNullWhen(false)] out OtdrTask task)
    {
        return _tasks.TryGetValue(taskId, out task);
    }

    public bool TryRemoveTask(string taskId, [MaybeNullWhen(false)] out OtdrTask task)
    {
        var result = _tasks.TryRemove(taskId, out task);
        if (result)
        {
            _queuePositionSubject.OnNext(Unit.Default);
        }
        return result;
    }
    
    public ICollection<OtdrTask> GetTasksCopy()
    {
        return _tasks.Values;
    }
}