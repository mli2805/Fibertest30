using System.Text.Json;
namespace Fibertest30.Application;

public class OtdrTaskProgressData : ISystemEventData
{
    public string TaskId { get; }
    public string TaskType { get; }
    public int MonitoringPortId { get; }
    public string CreatedByUserId { get; }
    public int QueuePosition { get; }
    public string Status { get; }
    public double Progress { get; }
    public DateTime? CompletedAt { get; }
    public string StepName { get; }
    public string? FailReason { get; }

    public OtdrTaskProgressData(
        string taskId,
        OtdrTaskType taskType,
        int monitoringPortId, 
        string createdByUserId,
        int queuePosition, 
        string status, 
        double progress, 
        DateTime completedAt,
        string stepName, 
        string? failReason = null)
    {
        TaskId = taskId;
        TaskType = taskType.ToString();
        MonitoringPortId = monitoringPortId;
        CreatedByUserId = createdByUserId;
        QueuePosition = queuePosition;
        Status = status;
        Progress = progress;
        CompletedAt = completedAt == DateTime.MinValue ? null : completedAt;
        StepName = stepName;
        FailReason = failReason;
    }
    
    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}