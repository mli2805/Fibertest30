import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs';
import { AppState, RtuTreeSelectors } from 'src/app/core';
import { Rtu } from 'src/app/core/store/models/ft30/rtu';
import { Trace } from 'src/app/core/store/models/ft30/trace';
import { RtuMgmtActions } from 'src/app/core/store/rtu-mgmt/rtu-mgmt.actions';
import { RtuMgmtSelectors } from 'src/app/core/store/rtu-mgmt/rtu-mgmt.selectors';
import { OnDestroyBase } from 'src/app/shared/components/on-destroy-base/on-destroy-base';

@Component({
  selector: 'rtu-trace-assign-base',
  templateUrl: './trace-assign-base.component.html',
  styleUrls: ['./trace-assign-base.component.css']
})
export class TraceAssignBaseComponent extends OnDestroyBase implements OnInit, AfterViewInit {
  rtuMgmtActions = RtuMgmtActions;
  store: Store<AppState> = inject(Store<AppState>);

  inProgress$ = this.store.select(RtuMgmtSelectors.selectRtuOperationInProgress);
  operationSuccess$ = this.store.select(RtuMgmtSelectors.selectRtuOperationSuccess);
  errorMessageId$ = this.store.select(RtuMgmtSelectors.selectErrorMessageId);

  rtu!: Rtu;
  rtu$;
  traceId!: string;
  trace!: Trace;
  portName!: string;

  preciseFileInitialValue!: string;
  fastFileInitialValue!: string;
  additionalFileInitialValue!: string;

  @ViewChild('preciseFileBox') preciseFileBox!: ElementRef;
  @ViewChild('fastFileBox') fastFileBox!: ElementRef;
  @ViewChild('additionalFileBox') additionalFileBox!: ElementRef;

  constructor(private route: ActivatedRoute, private ts: TranslateService) {
    super();

    const rtuId = this.route.snapshot.paramMap.get('rtuId')!;
    this.traceId = this.route.snapshot.paramMap.get('traceId')!;
    // подписка на рту. если подписаться пока rtuId не определен ничего не получишь
    this.rtu$ = this.store.select(RtuTreeSelectors.selectRtu(rtuId));
  }

  ngOnInit(): void {
    // еще одна подписка на рту, так я могу запустить свою функции, когда поменялся рту (при старте и при перечитывании)
    // в данном случае нужно обновить переменные для темплейта (которые не rtu.XXX, а трассы переключателей)
    this.rtu$.pipe(takeUntil(this.ngDestroyed$)).subscribe((rtu) => this.updateView(rtu));
  }

  updateView(rtu: Rtu | null) {
    if (!rtu) return;
    this.rtu = rtu;
    this.initializeControls();
  }

  initializeControls() {
    this.trace = this.findTrace()!;
    this.portName = this.getPortName(this.trace);

    this.preciseFileInitialValue =
      this.trace.preciseDuration > 0 ? this.ts.instant('i18n.ft.saved-in-db') : '';
    this.fastFileInitialValue =
      this.trace.fastDuration > 0 ? this.ts.instant('i18n.ft.saved-in-db') : '';
    this.additionalFileInitialValue =
      this.trace.additionalDuration > 0 ? this.ts.instant('i18n.ft.saved-in-db') : '';
  }

  ngAfterViewInit(): void {
    this.preciseFileBox.nativeElement.value = this.preciseFileInitialValue;
    this.fastFileBox.nativeElement.value = this.fastFileInitialValue;
    this.additionalFileBox.nativeElement.value = this.additionalFileInitialValue;
  }

  findTrace(): Trace | undefined {
    const trace = this.rtu.traces.find((t) => t.traceId === this.traceId);
    if (trace !== undefined) return trace;
    return this.rtu.bops
      .map((b) => b.traces)
      .flat()
      .find((t) => t.traceId === this.traceId);
  }

  getPortName(trace: Trace): string {
    if (trace.port === null) return 'i18n.ft.not-attached';
    if (trace.port.isPortOnMainCharon) return trace.port.opticalPort.toString();
    return trace.port.mainCharonPort!.toString() + '-' + trace.port.opticalPort.toString();
  }

  getFileInputAccept(): string {
    return '.sor';
  }

  onPreciseFileSelected(event: any) {
    const files: FileList = event.target.files;
    this.preciseFileBox.nativeElement.value = files[0].name;
  }

  onPreciseRemoveClicked() {
    this.preciseFileBox.nativeElement.value = '';
  }

  onFastFileSelected(event: any) {
    const files: FileList = event.target.files;
    this.fastFileBox.nativeElement.value = files[0].name;
  }

  onFastRemoveClicked() {
    this.fastFileBox.nativeElement.value = '';
  }

  onAdditionalFileSelected(event: any) {
    const files: FileList = event.target.files;
    this.additionalFileBox.nativeElement.value = files[0].name;
  }

  onAdditionalRemoveClicked() {
    this.additionalFileBox.nativeElement.value = '';
  }

  onApplyClicked() {
    //
  }
}
