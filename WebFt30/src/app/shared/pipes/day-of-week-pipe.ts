import { Pipe, PipeTransform, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { AppLanguage, AppState, SettingsSelectors } from 'src/app/core';

@Pipe({
  name: 'rtuDateName',
  pure: false
})
export class RtuDateToDayOfWeekPipe implements PipeTransform, OnDestroy {
  private dateFormatSubscription: Subscription;
  private language!: AppLanguage;

  constructor(private store: Store<AppState>) {
    this.dateFormatSubscription = this.store
      .select(SettingsSelectors.selectLanguage)
      .subscribe((language) => {
        this.language = language;
      });
  }

  transform(value: Date): string {
    return value.toLocaleDateString(this.language, { weekday: 'long' });
  }

  ngOnDestroy() {
    this.dateFormatSubscription.unsubscribe();
  }
}
