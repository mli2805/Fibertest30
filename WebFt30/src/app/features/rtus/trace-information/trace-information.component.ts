import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { AppState, RtuTreeSelectors, AuthSelectors, RtuTreeActions } from 'src/app/core';
import { CoreUtils } from 'src/app/core/core.utils';
import { ExtensionUtils } from 'src/app/core/extension.utils';
import { GraphService } from 'src/app/core/grpc';
import { Rtu } from 'src/app/core/store/models/ft30/rtu';
import { Trace } from 'src/app/core/store/models/ft30/trace';

@Component({
  selector: 'rtu-trace-information',
  templateUrl: './trace-information.component.html',
  styleUrls: ['./trace-information.component.scss']
})
export class TraceInformationComponent implements OnInit {
  traceId!: string;
  trace!: Trace;
  rtuId!: string;
  rtu!: Rtu;
  port!: string;

  hasPermission!: boolean;
  form!: FormGroup;

  loading$ = new BehaviorSubject<boolean>(false);

  public store: Store<AppState> = inject(Store);
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private graphService: GraphService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.traceId = this.route.snapshot.paramMap.get('id')!;
    this.trace = CoreUtils.getCurrentState(this.store, RtuTreeSelectors.selectTrace(this.traceId))!;
    this.rtuId = this.trace.rtuId;
    this.rtu = CoreUtils.getCurrentState(this.store, RtuTreeSelectors.selectRtu(this.rtuId))!;
    this.port = ExtensionUtils.PortOfOtauToString(this.trace.port);
    this.hasPermission = CoreUtils.getCurrentState(
      this.store,
      AuthSelectors.selectHasEditGraphPermission
    );

    this.form = new FormGroup({
      title: new FormControl(this.trace.title, [this.traceTitleValidator()]),
      comment: new FormControl(this.trace.comment)
    });
  }

  isDisabled() {
    return !this.hasPermission;
  }

  traceTitleValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.pristine) return null;
      if (control.value === '') return { invalidTitle: { value: 'required' } };
      // еще надо проверить уникальность
      return null;
    };
  }

  isTraceTitleValid() {
    return this.form.controls['title'].valid;
  }

  isApplyDisabled() {
    if (this.form.pristine) return true;
    if (!this.form.valid) return true;

    return false;
  }

  async onApplyClicked() {
    this.loading$.next(true);
    const cmd = {
      Id: this.traceId,
      Title: this.form.controls['title'].value,
      Comment: this.form.controls['comment'].value
    };
    const json = JSON.stringify(cmd);
    const response = await firstValueFrom(this.graphService.sendCommand(json, 'UpdateTrace'));
    if (response.success) {
      this.store.dispatch(RtuTreeActions.getOneRtu({ rtuId: this.rtuId }));
      this.form.markAsPristine();
      this.cdr.markForCheck();
    }
    this.loading$.next(false);
  }

  isDiscardDisabled() {
    if (this.form.pristine) return true;

    return false;
  }

  onDiscardClicked() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['rtus/trace-information', this.traceId]);
    });
  }
}
