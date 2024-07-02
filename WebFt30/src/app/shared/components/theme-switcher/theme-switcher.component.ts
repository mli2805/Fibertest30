import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AppState, AppThemes, AppTheme, SettingsSelectors, SettingsActions } from 'src/app/core';

@Component({
  selector: 'rtu-theme-switcher',
  templateUrl: './theme-switcher.component.html'
})
export class RtuThemeSwitcherComponent implements OnInit {
  themes = <any>AppThemes;
  selectedTheme$!: Observable<AppTheme>;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.selectedTheme$ = this.store.select(SettingsSelectors.selectTheme);
  }

  isDark(theme: AppTheme) {
    return theme === 'dark';
  }

  setTheme(theme: AppTheme) {
    this.store.dispatch(SettingsActions.changeTheme({ theme }));
  }

  getThemeNameId(theme: AppTheme) {
    if (theme === 'light') {
      return 'i18n.theme.light';
    } else {
      return 'i18n.theme.dark';
    }
  }
}
