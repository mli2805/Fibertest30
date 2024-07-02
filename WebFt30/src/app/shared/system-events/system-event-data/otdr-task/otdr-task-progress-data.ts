export interface OtdrTaskProgressData {
  TaskId: string;
  TaskType: 'OnDemand' | 'Baseline' | 'Monitoring';
  MonitoringPortId: number;
  CreatedByUserId: string;
  QueuePosition: number;
  Status: 'Pending' | 'Cancelled' | 'Running' | 'Completed' | 'Failed';
  Progress: number;
  CompletedAt: string | null;
  StepName: string;
  FailReason: string;
}
