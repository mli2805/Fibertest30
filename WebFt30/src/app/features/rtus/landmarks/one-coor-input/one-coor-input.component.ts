import { Component, inject, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { AppState, SettingsSelectors } from 'src/app/core';
import { CoreUtils } from 'src/app/core/core.utils';
import { OnDestroyBase } from 'src/app/shared/components/on-destroy-base/on-destroy-base';
import { Utils } from 'src/app/shared/utils/utils';

@Component({
  selector: 'rtu-one-coor-input',
  templateUrl: './one-coor-input.component.html'
})
export class OneCoorInputComponent extends OnDestroyBase implements OnInit {
  private store: Store<AppState> = inject(Store<AppState>);
  latLngFormatName$ = this.store.select(SettingsSelectors.selectLanLngFormatName);

  private originalCoor!: number;
  form!: FormGroup;

  degrees!: number;
  minutes!: number;
  seconds!: number;

  flag = new BehaviorSubject<boolean>(false);
  flag$ = this.flag.asObservable();

  @Input() set coor(value: number) {
    this.flag.next(false);
    Utils.delay(100);

    this.originalCoor = value;
    this.initializeForm(value);

    this.flag.next(true);
  }

  ngOnInit(): void {
    this.latLngFormatName$
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((f) => this.initializeForm(this.originalCoor));
  }

  format!: string;
  initializeForm(value: number) {
    this.format = CoreUtils.getCurrentState(this.store, SettingsSelectors.selectLanLngFormatName);
    this.parse(value);
    this.form = new FormGroup({
      degrees: new FormControl(this.degrees),
      minutes: new FormControl(this.minutes),
      seconds: new FormControl(this.seconds)
    });
  }

  parse(value: number) {
    switch (this.format) {
      case 'degrees':
        this.degrees = +value.toFixed(6);
        this.minutes = 0;
        this.seconds = 0;
        break;
      case 'minutes':
        this.degrees = Math.trunc(value);
        this.minutes = +((value - this.degrees) * 60).frmt(2, 5);
        this.seconds = 0;
        break;
      case 'seconds':
        this.degrees = Math.trunc(value);
        this.minutes = Math.trunc((value - this.degrees) * 60);
        this.seconds = +(((value - this.degrees) * 60 - this.minutes) * 60).frmt(2, 3);
        break;
    }
  }

  isDegreesValid(): boolean {
    const value = this.form.controls['degrees'].value;

    if (value === null || value === undefined || value === '') {
      return false;
    }

    if (this.format === 'degrees') {
      return !isNaN(Number(value)) && isFinite(Number(value));
    } else {
      const num = Number(value);
      return !isNaN(num) && Number.isInteger(num);
    }
  }

  isMinutesValid(): boolean {
    const value = this.form.controls['minutes'].value;

    if (value === null || value === undefined || value === '') {
      return false;
    }

    if (this.format === 'minutes') {
      const num = Number(value);
      return !isNaN(num) && isFinite(num) && num < 60 && num >= 0;
    } else {
      const num = Number(value);
      return !isNaN(num) && Number.isInteger(num) && num < 60 && num > -1;
    }
  }

  isSecondsValid(): boolean {
    const value = this.form.controls['seconds'].value;

    if (value === null || value === undefined || value === '') {
      return false;
    }

    const num = Number(value);
    return !isNaN(num) && isFinite(num) && num < 60 && num >= 0;
  }

  getInput(): number | null {
    // debugger;
    if (!this.isDegreesValid() || !this.isMinutesValid() || !this.isSecondsValid()) return null;
    // const d = +this.form.controls['degrees'].value;
    // const m = +this.form.controls['minutes'].value / 60;
    // const s = +this.form.controls['seconds'].value / 3600;

    // return d + m + s;

    return (
      +this.form.controls['degrees'].value +
      +this.form.controls['minutes'].value / 60 +
      +this.form.controls['seconds'].value / 3600
    );
  }
}
