import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { ConvertUtils } from 'src/app/core/convert.utils';
import { MonitoringPort } from 'src/app/core/store/models';
import { MonitoringSchedule } from 'src/app/core/store/models/monitoring-schedule';
import { ExpandedMonitoringTimeSlot } from 'src/app/core/store/models/monitoring-time-slot';
import { MonitoringSchedulerMode } from 'src/grpc-generated';

@Component({
  selector: 'rtu-schedule-select',
  templateUrl: './schedule-select.component.html',
  styles: [
    `
      :host {
        position: relative;
      }
    `
  ]
})
export class ScheduleSelectComponent implements OnInit {
  convertUtils = ConvertUtils;
  monitoringSchedulerMode = MonitoringSchedulerMode;

  @ViewChild('selectButton', { read: ElementRef, static: false }) selectButton!: ElementRef;
  @ViewChild('overlayList') overlayList!: ElementRef;

  @Input() minimalistic = false;
  @Input() public hasPermission!: boolean | null;
  @Input() public disabled = false;
  @Input() public port: MonitoringPort | null = null;
  @Input() public timeSlots: ExpandedMonitoringTimeSlot[] | null = null;
  @Output() public scheduleChanged = new EventEmitter<any>();

  scheduleModes = [
    MonitoringSchedulerMode.RoundRobin,
    MonitoringSchedulerMode.AtLeastOnceIn,
    MonitoringSchedulerMode.FixedTimeSlot
  ];
  selectedMode: any = null;
  overlayMode!: number;
  intervalItems = [
    { seconds: 600, value: 10, unit: 'i18n.monitoring.mins' },
    { seconds: 1200, value: 20, unit: 'i18n.monitoring.mins' },
    { seconds: 1800, value: 30, unit: 'i18n.monitoring.mins' },
    { seconds: 3600, value: 1, unit: 'i18n.monitoring.hour' },
    { seconds: 7200, value: 2, unit: 'i18n.monitoring.hours' },
    { seconds: 10800, value: 3, unit: 'i18n.monitoring.hours' },
    { seconds: 21600, value: 6, unit: 'i18n.monitoring.hours' },
    { seconds: 43200, value: 12, unit: 'i18n.monitoring.hours' },
    { seconds: 86400, value: 1, unit: 'i18n.monitoring.day' }
  ];

  selectedInterval!: any;

  selectedSlotsString!: string;

  public open = false;
  public get selectButtonWidth(): number {
    return this.selectButton.nativeElement.offsetWidth;
  }

  constructor(private elementRef: ElementRef, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.initialize();
  }

  initialize() {
    if (this.port === null || this.timeSlots === null) return;

    this.selectedMode = this.port.schedule.schedulerMode;
    this.overlayMode = this.port.schedule.schedulerMode;
    this.selectedInterval = undefined;
    if (this.port.schedule.schedulerMode === MonitoringSchedulerMode.AtLeastOnceIn) {
      this.selectedInterval = ConvertUtils.scheduleIntervalToObject(
        this.port.schedule.intervalSeconds!
      );
    }
    if (this.port.schedule.schedulerMode === MonitoringSchedulerMode.FixedTimeSlot) {
      const slot = this.timeSlots[this.port.schedule.timeSlotIds[0] - 1];
      this.selectedSlotsString = '' + slot.name;
      if (this.port.schedule.timeSlotIds.length > 1)
        this.selectedSlotsString = this.selectedSlotsString + ' ...';
    }
  }

  restoreWhenSaveFailed() {
    this.initialize();
    this.restoreTimeSlotSelections();
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      if (this.overlayMode === MonitoringSchedulerMode.FixedTimeSlot) {
        this.applyTimeSlots();
        return;
      }

      this.open = false;

      this.overlayMode = this.selectedMode;
    }
  }

  onOverlayClick(event: MouseEvent) {
    event.stopPropagation();
  }

  previousSelectedSlotIds!: number[] | undefined;
  cleanTimeSlotSelections() {
    for (const item of this.timeSlots!) {
      if (item.monitoringPortId === this.port!.id) item.monitoringPortId = -1;
    }
  }

  restoreTimeSlotSelections() {
    for (const slot of this.timeSlots!) {
      if (
        slot.monitoringPortId === -1 &&
        this.port!.schedule.timeSlotIds.find((i) => i === slot.id)
      )
        slot.monitoringPortId = this.port!.id;
      else if (
        slot.monitoringPortId === this.port!.id &&
        !this.port!.schedule.timeSlotIds.find((i) => i === slot.id)
      )
        slot.monitoringPortId = -1;
    }
  }

  previousMode!: MonitoringSchedulerMode;
  setMode(event: MouseEvent, mode: any) {
    // console.log(`setMode ${mode}`);
    // console.log(`selectedMode ${this.selectedMode}`);

    this.previousMode = this.selectedMode;
    this.overlayMode = mode;

    if (mode !== MonitoringSchedulerMode.RoundRobin) {
      this.open = false;
      if (mode === MonitoringSchedulerMode.FixedTimeSlot) {
        this.previousSelectedSlotIds = this.timeSlots!.filter((i) =>
          i.isSelectedFunc(this.port!.id)
        ).map((s) => s.id);
      }
      if (mode === MonitoringSchedulerMode.AtLeastOnceIn) {
        // clean slots only when interval selected (applied)
      }

      this.onMainButtonClicked();
    } else {
      // Round robin
      this.onMainButtonClicked();
      if (this.selectedMode !== MonitoringSchedulerMode.RoundRobin) {
        this.selectedMode = MonitoringSchedulerMode.RoundRobin;
        this.selectedInterval = undefined;
        this.cleanTimeSlotSelections();

        const schedule = new MonitoringSchedule();
        schedule.schedulerMode = MonitoringSchedulerMode.RoundRobin;
        schedule.timeSlotIds = [];
        this.scheduleChanged.emit(schedule);
      }
    }

    event.stopPropagation();
  }

  onMainButtonClicked() {
    if (!this.hasPermission) return;
    if (this.open === false) {
      this.open = true;
      if (this.selectedMode === MonitoringSchedulerMode.FixedTimeSlot) {
        this.previousSelectedSlotIds = this.timeSlots!.filter((i) =>
          i.isSelectedFunc(this.port!.id)
        ).map((s) => s.id);
      }
    } else {
      if (this.overlayMode === MonitoringSchedulerMode.RoundRobin) {
        this.open = false;
      }
      if (this.overlayMode === MonitoringSchedulerMode.AtLeastOnceIn) {
        this.overlayMode = MonitoringSchedulerMode.RoundRobin;
        this.open = false;
      }
      if (this.overlayMode === MonitoringSchedulerMode.FixedTimeSlot) {
        this.applyTimeSlots();
      }
    }
  }

  onFixedTimeSlotCaptionClick() {
    // console.log(`onFixedTimeSlotCaptionClick`);
    this.overlayMode = 0;
  }

  onAtLeastOnceCaptionClick() {
    this.overlayMode = 0;
  }

  setInterval(event: MouseEvent, item: any) {
    this.open = false;
    if (this.selectedInterval === item) return;

    this.cleanTimeSlotSelections(); // previous mode was FixedTimeSlots

    this.selectedMode = MonitoringSchedulerMode.AtLeastOnceIn;
    this.selectedInterval = item;
    event.stopPropagation();

    const schedule = new MonitoringSchedule();
    schedule.schedulerMode = MonitoringSchedulerMode.AtLeastOnceIn;
    schedule.intervalSeconds = this.selectedInterval.seconds;
    schedule.timeSlotIds = [];
    this.scheduleChanged.emit(schedule);
  }

  toggleTimeSlot(event: MouseEvent, slot: any) {
    if (!slot.isOccupiedByOtherFunc(this.port!.id))
      if (slot.monitoringPortId !== -1) slot.monitoringPortId = -1;
      else slot.monitoringPortId = this.port!.id;
    event.stopPropagation();
  }

  applyTimeSlots() {
    this.open = false;
    if (!this.isTimeSlotsChanged()) {
      // no slot changed

      if (this.timeSlots?.find((s) => s.isSelectedFunc(this.port!.id)) !== undefined) {
        // mode was and remained FixedSlots and there is at least one selected slot - nothing to do
        return;
      } else {
        // mode was changed to FixedSlots but no slot selected -
        // so return previous schedule mode
        this.overlayMode = this.previousMode;
        return;
      }
    }

    this.selectedInterval = undefined;
    const selectedSlotIds = this.timeSlots!.filter((s) => s.isSelectedFunc(this.port!.id)).map(
      (x) => x.id
    );
    if (selectedSlotIds.length > 0) {
      this.selectedSlotsString =
        '' + this.timeSlots!.find((i) => i.id === selectedSlotIds[0])!.name;
      this.selectedMode = MonitoringSchedulerMode.FixedTimeSlot;
    } else {
      this.selectedMode = MonitoringSchedulerMode.RoundRobin;
      this.overlayMode = MonitoringSchedulerMode.RoundRobin;
    }
    if (selectedSlotIds.length > 1) this.selectedSlotsString = this.selectedSlotsString + ' ...';

    const schedule = new MonitoringSchedule();
    schedule.schedulerMode = this.selectedMode;
    schedule.timeSlotIds = [];
    for (let index = 0; index < this.timeSlots!.length; index++) {
      if (this.timeSlots![index].isSelectedFunc(this.port!.id))
        schedule.timeSlotIds.push(this.timeSlots![index].id);
    }
    this.scheduleChanged.emit(schedule);

    this.previousSelectedSlotIds = undefined;
  }

  isTimeSlotsChanged() {
    const selectedSlotIds = this.timeSlots!.filter((s) => s.isSelectedFunc(this.port!.id)).map(
      (x) => x.id
    );
    if (this.previousSelectedSlotIds === undefined) return false;
    return !this.areEqual(selectedSlotIds, this.previousSelectedSlotIds!);
  }

  getModeDetailsString(mode: MonitoringSchedulerMode): string {
    switch (mode) {
      case MonitoringSchedulerMode.RoundRobin:
        return 'i18n.monitoring.schedule-mode-round-robin-details';
      case MonitoringSchedulerMode.AtLeastOnceIn:
        return 'i18n.monitoring.schedule-mode-at-least-once-in-details';
      case MonitoringSchedulerMode.FixedTimeSlot:
        return 'i18n.monitoring.schedule-mode-fixed-time-slot-details';
      default:
        throw new Error(`No matching monitoring mode ${mode}`);
    }
  }

  areEqual = (a1: any[], a2: any[]) =>
    a1.length == a2.length && a1.every((element: any, index: any) => element === a2[index]);
}
