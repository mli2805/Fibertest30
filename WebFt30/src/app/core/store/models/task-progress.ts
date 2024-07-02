import { ServerError } from '../../models/server-error';

export class OtdrTask {
  otdrTaskId!: string | null;
  monitoringPortId!: number;
  starting!: boolean; // Start is pressed, but not yet completed
  stopping!: boolean; // Stop is pressed, but not yet completed
  finished!: boolean;
  finishedDate!: Date | null;

  progress!: OtdrTaskProgress | null;
  error!: ServerError | string | null;

  public static getStarting(otdrTask: OtdrTask | null): boolean {
    if (otdrTask === null) {
      return false;
    }
    return otdrTask.starting;
  }

  public static getStarted(otdrTask: OtdrTask | null): boolean {
    if (otdrTask === null) {
      return false;
    }
    return otdrTask?.otdrTaskId !== null && otdrTask.finished === false;
  }

  public static getOtdrTaskId(otdrTask: OtdrTask | null): string | null {
    if (otdrTask === null) {
      return null;
    }
    return otdrTask.otdrTaskId;
  }

  public static getProgress(otdrTask: OtdrTask | null): OtdrTaskProgress | null {
    if (otdrTask === null) {
      return null;
    }
    return otdrTask.progress;
  }

  public static getError(otdrTask: OtdrTask | null): ServerError | string | null {
    if (otdrTask === null) {
      return null;
    }
    return otdrTask.error;
  }

  public static getShowStart(otdrTask: OtdrTask | null): boolean {
    if (otdrTask === null) {
      return true;
    }

    return (
      otdrTask.otdrTaskId === null ||
      (otdrTask.finished == true &&
        (otdrTask.error !== null ||
          otdrTask.progress?.status === 'completed' ||
          otdrTask.progress?.status === 'failed' ||
          otdrTask.progress?.status === 'cancelled'))
    );
  }

  public static getCancelling(task: OtdrTask | null): boolean {
    if (task === null) {
      return false;
    }
    if (task.stopping === true) {
      return true;
    }

    return task.progress?.status === 'cancelled' && task.finished == false;
  }

  public static getCancelled(task: OtdrTask | null): boolean {
    if (task === null) {
      return false;
    }
    return task.progress?.status === 'cancelled' && task.finished == true;
  }

  public static getPending(task: OtdrTask | null): boolean {
    if (task === null) {
      return false;
    }
    return task.progress?.status === 'pending';
  }

  public static getRunning(task: OtdrTask | null): boolean {
    if (task === null) {
      return false;
    }
    return task.progress?.status === 'running';
  }

  public static getCompleted(task: OtdrTask | null): boolean {
    if (task === null) {
      return false;
    }
    return task.progress?.status === 'completed';
  }

  public static getFinishedDate(task: OtdrTask | null): Date | null {
    if (task === null) {
      return null;
    }
    return task.finishedDate;
  }

  public static create(
    starting: boolean,
    monitoringPortId: number,
    otdrTaskId: string | null = null
  ): OtdrTask {
    return {
      otdrTaskId: otdrTaskId,
      monitoringPortId: monitoringPortId,
      starting: starting,
      stopping: false,
      finished: false,
      finishedDate: null,
      error: null,
      progress: null
    };
  }
}

export class OtdrTaskProgress {
  otdrTaskId!: string;
  taskType!: 'ondemand' | 'baseline' | 'monitoring';
  monitoringPortId!: number;
  createdByUserId!: string;
  queuePosition!: number;
  status!: 'pending' | 'cancelled' | 'running' | 'completed' | 'failed';
  progress!: number;
  completedAt!: Date | null;
  stepName!: string | null;
  failReason: string | null = null;
}
