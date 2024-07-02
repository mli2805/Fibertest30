import { Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Directive()
export abstract class OnDestroyBase implements OnDestroy {
  protected ngDestroyed$ = new Subject();

  public ngOnDestroy() {
    this.ngDestroyed$.next(null);
    this.ngDestroyed$.complete();
  }
}
