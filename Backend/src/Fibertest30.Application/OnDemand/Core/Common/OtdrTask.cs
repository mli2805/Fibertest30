using System.Reactive.Linq;
using System.Reactive.Subjects;

namespace Fibertest30.Application;

public enum OtdrTaskStatus
{
    Unknown,
    Pending,
    Cancelled,
    Running,
    Completed,
    Failed
}

public class OtdrTask : IDisposable
{
    public IObservable<OtdrTaskStatus> StatusObservable { get; init; } 
    private readonly Subject<OtdrTaskStatus> _statusSubject = new();
    
    public string Id { get; init; }
    
    public OtdrTaskPriority Priority { get; init; }
    public int MonitoringPortId { get; set; }
    public string CreatedByUserId { get; init; }
    public DateTime CreatedAt { get; set; }
    public DateTime StartedAt { get; set; }
    public DateTime CompletedAt { get; set; }
    public Measurement Measurement { get; private set; }
    public OtdrTaskStatus Status { get; private set; }
    public string? FailReason { get; private set; }
    public IDisposable? ObserveProgress { get; set; }
    
    private readonly CancellationTokenSource _cts = new();
    public CancellationToken CancellationToken => _cts.Token;

    public OtdrTask(string id, OtdrTaskPriority priority, int monitoringPortId, DateTime createdAt, string userId)
    {
        Id = id;
        Priority = priority;
        MonitoringPortId = monitoringPortId;
        CreatedAt = createdAt;
        CreatedByUserId = userId;
        StatusObservable = _statusSubject.AsObservable();
        Measurement = new Measurement(monitoringPortId);
        Status = OtdrTaskStatus.Pending;
    }
    

    public void SetStatus(OtdrTaskStatus status, string? failReason = null)
    {
        Status = status;
        FailReason = failReason;
        _statusSubject.OnNext(status);
        
        if (status == OtdrTaskStatus.Completed 
            || status == OtdrTaskStatus.Failed
            || status == OtdrTaskStatus.Cancelled)
        {
            _statusSubject.OnCompleted();
            ObserveProgress?.Dispose();
        }
    }
    
    public void Cancel()
    {
        _cts.Cancel();
    }

    public void Dispose()
    {
        _cts.Dispose();
    }
    
    public OtdrTaskType ToTaskType()
    {
        return this switch
        {
            OnDemandOtdrTask _ => OtdrTaskType.OnDemand,
            BaselineSetupOtdrTask _ => OtdrTaskType.Baseline,
            MonitoringOtdrTask _ => OtdrTaskType.Monitoring,
            _ => throw new ArgumentOutOfRangeException($"Unknown OtdrTask type: {GetType().Name}")
        };
    }
}


public class OnDemandOtdrTask : OtdrTask
{
    public OnDemandOtdrTask(string id, OtdrTaskPriority priority, int monitoringPortId, DateTime createdAt, string userId) 
        : base(id, priority, monitoringPortId, createdAt, userId)
    {
    }
}

public class BaselineSetupOtdrTask : OtdrTask
{
    public int? BaselineId { get; set; }
    
    public BaselineSetupOtdrTask(string id, OtdrTaskPriority priority, int monitoringPortId, DateTime createdAt, string userId) 
        : base(id, priority, monitoringPortId, createdAt, userId)
    {
    }
}

public class MonitoringOtdrTask : OtdrTask
{
    public MonitoringBaseline? Baseline { get; set; }
    public MonitoringOtdrTask(string id, OtdrTaskPriority priority, int monitoringPortId, DateTime createdAt, string userId) 
        : base(id, priority, monitoringPortId, createdAt, userId)
    {
    }
}