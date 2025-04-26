import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom, forkJoin, Observable, ReplaySubject, Subscription, takeUntil } from 'rxjs';
import { AppState, RtuTreeSelectors } from 'src/app/core';
import { ExtensionUtils } from 'src/app/core/extension.utils';
import { RtuMgmtService } from 'src/app/core/grpc';
import { RtuMgmtMapping } from 'src/app/core/store/mapping/rtu-mgmt-mapping';
import {
  AssignBaseRefsDto,
  BaseRefFile
} from 'src/app/core/store/models/ft30/assign-base-refs-dto';
import { BaseRefsAssignedDto } from 'src/app/core/store/models/ft30/base-refs-assigned-dto';
import { BaseRefType } from 'src/app/core/store/models/ft30/ft-enums';
import { ReturnCode } from 'src/app/core/store/models/ft30/return-code';
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

  operationSuccess$ = this.store.select(RtuMgmtSelectors.selectRtuOperationSuccess);
  errorMessageId$ = this.store.select(RtuMgmtSelectors.selectErrorMessageId);
  inProgress$ = this.store.select(RtuMgmtSelectors.selectRtuOperationInProgress);

  rtuId!: string;
  rtu!: Rtu;
  rtu$ = this.store.select(RtuTreeSelectors.selectRtu(this.rtuId));
  traceId!: string;
  trace!: Trace;
  portName!: string;

  preciseFileInitialValue!: string;
  fastFileInitialValue!: string;
  additionalFileInitialValue!: string;
  preciseFile: File | null = null;
  fastFile: File | null = null;
  additionalFile: File | null = null;

  @ViewChild('preciseFileBox') preciseFileBox!: ElementRef;
  @ViewChild('fastFileBox') fastFileBox!: ElementRef;
  @ViewChild('additionalFileBox') additionalFileBox!: ElementRef;

  @Input() set data(value: any) {
    this.trace = value;
    this.traceId = value.traceId;
    this.rtuId = value.rtuId;
    this.rtu$ = this.store.select(RtuTreeSelectors.selectRtu(this.rtuId));
  }
  @Output() closeEvent = new EventEmitter();

  constructor(
    private ts: TranslateService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private rtuMgmtService: RtuMgmtService
  ) {
    super();
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
    this.portName = ExtensionUtils.PortOfOtauToString(this.trace.port);

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

  getFileInputAccept(): string {
    return '.sor';
  }

  onPreciseFileSelected(event: any) {
    this.preciseFile = event.target.files[0];
    this.preciseFileBox.nativeElement.value = this.preciseFile!.name;
  }

  onPreciseRemoveClicked() {
    this.preciseFileBox.nativeElement.value = '';
    this.preciseFile = null;
  }

  onFastFileSelected(event: any) {
    this.fastFile = event.target.files[0];
    this.fastFileBox.nativeElement.value = this.fastFile!.name;
  }

  onFastRemoveClicked() {
    this.fastFileBox.nativeElement.value = '';
    this.fastFile = null;
  }

  onAdditionalFileSelected(event: any) {
    this.additionalFile = event.target.files[0];
    this.additionalFileBox.nativeElement.value = this.additionalFile!.name;
  }

  onAdditionalRemoveClicked() {
    this.additionalFileBox.nativeElement.value = '';
    this.additionalFile = null;
  }

  subscription!: Subscription;

  composeDto() {
    const dto = new AssignBaseRefsDto();
    dto.rtuId = this.rtu.rtuId;
    dto.rtuMaker = this.rtu.rtuMaker;
    dto.traceId = this.trace.traceId;
    dto.portOfOtau = this.trace.port;

    dto.baseFiles = [];
    dto.deleteSors = this.composeDeleted();
    return dto;
  }

  composeDeleted() {
    const deleteSors = [];
    if (this.preciseFileBox.nativeElement.value === '' && this.preciseFileInitialValue !== '') {
      deleteSors.push(this.trace.preciseSorId);
    }
    if (this.fastFileBox.nativeElement.value === '' && this.fastFileInitialValue !== '') {
      deleteSors.push(this.trace.fastSorId);
    }
    if (
      this.additionalFileBox.nativeElement.value === '' &&
      this.additionalFileInitialValue !== ''
    ) {
      deleteSors.push(this.trace.additionalSorId);
    }
    return deleteSors;
  }

  readFileAsObservable(file: File | null): Observable<Uint8Array | null> {
    const subj = new ReplaySubject<Uint8Array | null>();

    if (file === null) {
      subj.next(null);
      subj.complete();
    } else {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const bytes = new Uint8Array(<ArrayBuffer>reader.result);
        subj.next(bytes);
        subj.complete();
      };
      reader.onerror = (er: any) => {
        console.log(`can't load file: ${er}`);
        subj.next(null);
        subj.complete();
      };
      reader.readAsArrayBuffer(file);
    }

    return subj.asObservable();
  }

  async onApplyClicked() {
    this.errorLine1 = '';
    this.errorLine2 = '';
    this.cdr.markForCheck;

    const dto = this.composeDto();

    this.store.dispatch(RtuMgmtActions.setSpinner({ value: true }));

    forkJoin({
      file1: this.readFileAsObservable(this.preciseFile),
      file2: this.readFileAsObservable(this.fastFile),
      file3: this.readFileAsObservable(this.additionalFile)
    })
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe(async (files) => {
        this.composeBaseFiles(files, dto);
        const resp = await firstValueFrom(this.rtuMgmtService.assignBaseRefs(dto));
        const answer = RtuMgmtMapping.fromGrpcBaseRefsAssignedDto(resp.dto!);
        this.store.dispatch(RtuMgmtActions.setSpinner({ value: false }));

        if (answer.returnCode === ReturnCode.BaseRefAssignedSuccessfully) {
          this.router.navigate(['/rtus/rtu-tree']);
          // еще придет событие BaseRefsAssigned по которому будет пречитан RTU
        } else {
          // написать что неправильно
          this.composeErrorLines(answer);
        }

        this.closeEvent.emit();
      });
  }

  errorLine1 = '';
  errorLine2 = '';

  // prettier-ignore
  composeErrorLines(answer: BaseRefsAssignedDto){
    switch (answer.baseRefType) {
      case BaseRefType.Precise: this.errorLine1 = "i18n.ft.precise-base"; break;
      case BaseRefType.Fast: this.errorLine1 = "i18n.ft.fast-base"; break;
      case BaseRefType.Additional: this.errorLine1 = "i18n.ft.additional-base"; break;
    }

    switch (answer.returnCode) {
      case ReturnCode.BaseRefAssignmentFailed: this.errorLine2 =  "i18n.ft.failed-to-assign-base-refs"; break;
      case ReturnCode.BaseRefAssignmentParamNotAcceptable: this.errorLine2 =  "i18n.ft.parameters-not-acceptable"; break;
      case ReturnCode.BaseRefAssignmentNoThresholds: this.errorLine2 =  "i18n.ft.no-thresholds-set"; break;
      case ReturnCode.BaseRefAssignmentLandmarkCountWrong: this.errorLine2 =  "i18n.ft.wrong-landmarks-count"; break;
      case ReturnCode.BaseRefAssignmentEdgeLandmarksWrong: this.errorLine2 =  "i18n.ft.wrong-edge-landmarks"; break;
      default: this.errorLine2 = "i18n.ft.failed"; break;
    }
    this.cdr.markForCheck();
  }

  composeBaseFiles(files: any, dto: AssignBaseRefsDto) {
    const deletePrecise =
      this.preciseFileBox.nativeElement.value === '' && this.preciseFileInitialValue !== '';
    const bf1 = new BaseRefFile(BaseRefType.Precise, files.file1, deletePrecise);
    dto.baseFiles.push(bf1);

    const deleteFast =
      this.fastFileBox.nativeElement.value === '' && this.fastFileInitialValue !== '';
    const bf2 = new BaseRefFile(BaseRefType.Fast, files.file2, deleteFast);
    dto.baseFiles.push(bf2);

    const deleteAdditional =
      this.additionalFileBox.nativeElement.value === '' && this.additionalFileInitialValue !== '';
    const bf3 = new BaseRefFile(BaseRefType.Additional, files.file3, deleteAdditional);
    dto.baseFiles.push(bf3);
  }
}
