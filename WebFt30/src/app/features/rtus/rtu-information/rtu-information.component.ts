import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { AppState, AuthSelectors, RtuTreeActions, RtuTreeSelectors } from 'src/app/core';
import { CoreUtils } from 'src/app/core/core.utils';
import { GraphService } from 'src/app/core/grpc';
import { Rtu } from 'src/app/core/store/models/ft30/rtu';

@Component({
  selector: 'rtu-rtu-information',
  templateUrl: './rtu-information.component.html',
  styleUrls: ['./rtu-information.component.scss']
})
export class RtuInformationComponent implements OnInit {
  rtuId!: string;
  rtu!: Rtu;

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
    this.rtuId = this.route.snapshot.paramMap.get('id')!;
    this.rtu = CoreUtils.getCurrentState(this.store, RtuTreeSelectors.selectRtu(this.rtuId))!;
    this.hasPermission = CoreUtils.getCurrentState(
      this.store,
      AuthSelectors.selectHasEditGraphPermission
    );

    this.form = new FormGroup({
      title: new FormControl(this.rtu.title, [this.rtuTitleValidator()]),
      comment: new FormControl(this.rtu.comment)
    });
  }

  isDisabled() {
    return !this.hasPermission;
  }

  rtuTitleValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.pristine) return null;
      if (control.value === '') return { invalidTitle: { value: 'required' } };
      // еще надо проверить уникальность
      return null;
    };
  }

  isRtuTitleValid() {
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
      RtuId: this.rtuId,
      Title: this.form.controls['title'].value,
      Comment: this.form.controls['comment'].value
    };
    const json = JSON.stringify(cmd);
    const response = await firstValueFrom(this.graphService.sendCommand(json, 'UpdateRtu'));
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
      this.router.navigate(['rtus/information', this.rtuId]);
    });
  }
}
