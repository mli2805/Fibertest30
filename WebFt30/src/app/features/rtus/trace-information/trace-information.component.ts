import { Component, inject, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState, RtuTreeSelectors, AuthSelectors } from 'src/app/core';
import { CoreUtils } from 'src/app/core/core.utils';
import { ExtensionUtils } from 'src/app/core/extension.utils';
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

  public store: Store<AppState> = inject(Store);
  constructor(private route: ActivatedRoute) {}

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
      return null;
    };
  }

  isTraceTitleValid() {
    return this.form.controls['title'].valid;
  }
}
