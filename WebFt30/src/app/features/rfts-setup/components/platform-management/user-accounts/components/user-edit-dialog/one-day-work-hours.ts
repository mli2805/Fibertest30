export class OneDayWorkHours {
  isOn: boolean;
  dayOfWeek: string;
  startTime: Date;
  finishTime: Date;

  get totalStartTimeMinutes(): number {
    return this.getTotalMinutes(this.startTime);
  }

  set totalStartTimeMinutes(totalMinutes: number) {
    this.setTotalMinutes(this.startTime, totalMinutes);
  }

  get totalFinishTimeMinutes(): number {
    return this.getTotalMinutes(this.finishTime);
  }

  set totalFinishTimeMinutes(totalMinutes: number) {
    this.setTotalMinutes(this.finishTime, totalMinutes);
  }

  constructor(isOn: boolean, dayOfWeek: string, startTime: Date, finishTime: Date) {
    this.isOn = isOn;
    this.dayOfWeek = dayOfWeek;
    this.startTime = startTime;
    this.finishTime = finishTime;
  }

  private getTotalMinutes(date: Date) {
    return date.getHours() * 60 + date.getMinutes();
  }

  private setTotalMinutes(date: Date, totalMinutes: number): Date {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    date.setHours(hours);
    date.setMinutes(minutes);

    return date;
  }
}
