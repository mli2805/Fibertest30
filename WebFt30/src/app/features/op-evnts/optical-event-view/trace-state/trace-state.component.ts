import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { AppState, AuthSelectors, RtuTreeSelectors } from 'src/app/core';
import { CoreUtils } from 'src/app/core/core.utils';
import { AccidentLine, OpticalEvent } from 'src/app/core/store/models/ft30/optical-event';
import { AccidentConvertor } from './accident-convertor';
import { ExtensionUtils } from 'src/app/core/extension.utils';
import { AccidentPlace, EventStatus } from 'src/app/core/store/models/ft30/ft-enums';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GraphService } from 'src/app/core/grpc';

@Component({
    selector: 'rtu-trace-state',
    templateUrl: './trace-state.component.html',
    styleUrls: ['./trace-state.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class TraceStateComponent {
  accidentPlace = AccidentPlace;
  _opticalEvent!: OpticalEvent;

  @Input() set opticalEvent(value: OpticalEvent) {
    this._opticalEvent = value;
    const trace = CoreUtils.getCurrentState(
      this.store,
      RtuTreeSelectors.selectTrace(value.traceId!)
    );

    this.traceTitle = trace!.title;
    this.port = ExtensionUtils.PortOfOtauToString(trace!.port);
    const rtu = CoreUtils.getCurrentState(this.store, RtuTreeSelectors.selectRtu(trace!.rtuId));
    this.rtuTitle = rtu!.title;
    this.stateAt = this.ts.instant('i18n.ft.trace-state-at', {
      0: value.registeredAt,
      1: value.eventId
    });
    this.isAccident = value.eventStatus > EventStatus.EventButNotAnAccident;

    this.accidents = value.accidents.map((a, i) => this.accidentConvertor.toAccidentLine(a, i + 1));

    this.initializeForm(value);
  }

  accidents!: AccidentLine[];

  //
  traceTitle!: string;
  port!: string;
  rtuTitle!: string;
  stateAt!: string;
  traceState!: string;
  //

  eventStatuses: EventStatus[] = [
    EventStatus.Confirmed,
    EventStatus.NotConfirmed,
    EventStatus.Planned,
    EventStatus.Suspended,
    EventStatus.NotImportant,
    EventStatus.Unprocessed
  ];

  isAccident!: boolean;

  form!: FormGroup;

  constructor(
    private store: Store<AppState>,
    private ts: TranslateService,
    private fb: FormBuilder,
    private accidentConvertor: AccidentConvertor,
    private graphService: GraphService,
    private cd: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      eventStatus: [''],
      comment: ['']
    });
  }

  initializeForm(value: OpticalEvent) {
    const patch = { eventStatus: value.eventStatus, comment: value.comment };
    this.form.patchValue(patch);
    this.form.markAsPristine();
  }

  isApplyDisabled() {
    return this.form.pristine;
  }

  async onApplyClicked() {
    const newStatus = this.form.controls['eventStatus'].value;
    let command = null;
    if (this.isAccident && this._opticalEvent.eventStatus !== newStatus) {
      command = {
        SorFileId: this._opticalEvent.eventId,
        EventStatus: newStatus,
        StatusChangedTimestamp: new Date(),
        StatusChangedByUser: this.getUserName(),
        Comment: this.form.controls['comment'].value
      };
    } else {
      command = {
        SorFileId: this._opticalEvent.eventId,
        EventStatus: this._opticalEvent.eventStatus,
        StatusChangedTimestamp: this._opticalEvent.statusChangedAt,
        StatusChangedByUser: this._opticalEvent.statusChangedByUser,
        Comment: this.form.controls['comment'].value
      };
    }

    const json = JSON.stringify(command);
    const response = await this.graphService.sendCommandAsync(json, 'UpdateMeasurement');
    if (response.success) {
      this._opticalEvent.eventStatus = command.EventStatus;
      this._opticalEvent.statusChangedAt = command.StatusChangedTimestamp;
      this._opticalEvent.statusChangedByUser = command.StatusChangedByUser;
      this._opticalEvent.comment = command.Comment;

      this.opticalEvent = this._opticalEvent;
      this.cd.detectChanges();
    }
  }

  getUserName(): string {
    const user = CoreUtils.getCurrentState(this.store, AuthSelectors.selectUser)!;
    if (user.fullName !== '') return user.fullName;

    return user.id;
  }
}
