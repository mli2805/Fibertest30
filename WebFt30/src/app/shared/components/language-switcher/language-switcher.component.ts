import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';

import {
  AppLanguage,
  AppLanguages,
  AppState,
  SettingsActions,
  SettingsSelectors
} from 'src/app/core';
import { AppSettingsService } from 'src/app/core/services';

@Component({
  selector: 'rtu-language-switcher',
  templateUrl: 'language-switcher.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RtuLanguageSwitcherComponent {
  languages$: Observable<AppLanguage[]>;
  selectedLanguage$: Observable<AppLanguage>;

  constructor(
    private store: Store<AppState>,
    readonly cd: ChangeDetectorRef,
    private appSettingsService: AppSettingsService
  ) {
    this.selectedLanguage$ = this.store.select(SettingsSelectors.selectLanguage);
    this.languages$ = this.appSettingsService.settings$.pipe(
      map((settings) => {
        const result = [...AppLanguages];
        if (settings?.debugLanguage) {
          return result;
        } else {
          return result.filter((x) => x !== 'debug');
        }
      })
    );
  }

  setLanguage(lang: AppLanguage) {
    this.store.dispatch(SettingsActions.changeLanguage({ language: lang }));
  }

  getFlagIcon(language: AppLanguage) {
    const flag = this.getFlagByLanguage(language);
    return `assets/icons/flags/${flag}.svg`;
  }

  getFlagByLanguage(language: AppLanguage) {
    switch (language) {
      case 'en':
        return 'us';
      default:
        return language;
    }
  }

  getLanguageName(language: AppLanguage) {
    switch (language) {
      case 'en':
        return 'English';
      case 'ru':
        return 'Russian';

      default:
        return language;
    }
  }
}
