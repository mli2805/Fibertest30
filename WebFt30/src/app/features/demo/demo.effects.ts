import { Injectable } from '@angular/core';
import { distinctUntilChanged, tap } from 'rxjs';
import { createEffect } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { AppState, SettingsSelectors } from 'src/app/core';

@Injectable()
export class DemoEffects {
  setTranslateLanguage = createEffect(
    () =>
      this.store.pipe(
        select(SettingsSelectors.selectLanguage),
        distinctUntilChanged(),
        tap((language) => this.translate.use(language))
      ),
    { dispatch: false }
  );

  constructor(private store: Store<AppState>, private translate: TranslateService) {}
}
