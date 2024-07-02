export class TimeOnlyHourMinute {
  hour!: number;
  minute!: number;
}

export class MonitoringTimeSlot {
  id!: number;
  start!: TimeOnlyHourMinute;
  end!: TimeOnlyHourMinute;
}

export class ExpandedMonitoringTimeSlot {
  id: number;
  start: TimeOnlyHourMinute;
  end: TimeOnlyHourMinute;
  monitoringPortId = -1;
  name: string;

  constructor(ts: MonitoringTimeSlot, monitoringPortId: number) {
    this.id = ts.id;
    this.start = ts.start;
    this.end = ts.end;
    this.monitoringPortId = monitoringPortId;

    const start = ts.start.hour.toString().padStart(2, '0');
    const finish = ts.end.hour.toString().padStart(2, '0');
    this.name = `${start} - ${finish}`;
  }

  isSelectedFunc(currentPortId: number) {
    return this.monitoringPortId === currentPortId;
  }

  isOccupiedByOtherFunc(currentPortId: number) {
    return this.monitoringPortId !== -1 && this.monitoringPortId !== currentPortId;
  }
}
