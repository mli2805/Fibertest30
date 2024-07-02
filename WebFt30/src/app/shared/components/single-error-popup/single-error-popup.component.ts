import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { OnDestroyBase } from '../on-destroy-base/on-destroy-base';
import { Observable, takeUntil } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { AppState } from 'src/app/core';

@Component({
  selector: 'rtu-single-error-popup',
  templateUrl: 'single-error-popup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingeErrorPopupComponent extends OnDestroyBase implements OnInit {
  @Input(/*{ required: true }*/) errorMessageId$!: Observable<string | null>;
  @Input() resetErrorAction: Action | null = null;

  showError = false;
  errorMessageId: string | null = null;

  constructor(private cdr: ChangeDetectorRef, private store: Store<AppState>) {
    super();
  }
  ngOnInit(): void {
    this.errorMessageId$.pipe(takeUntil(this.ngDestroyed$)).subscribe((errorMessageId) => {
      this.errorMessageId = errorMessageId;
      this.cdr.markForCheck();

      // delay showError to show nice animation
      setTimeout(() => {
        this.showError = errorMessageId != null;
        this.cdr.markForCheck();
      }, 50);
    });
  }

  hideError() {
    this.showError = false;
    if (this.resetErrorAction) {
      this.store.dispatch(this.resetErrorAction);
    }
  }
}
