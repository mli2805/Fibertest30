import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AppState, AppTheme, SettingsSelectors, SettingsActions } from 'src/app/core';

@Component({
  selector: 'rtu-theme-switcher-simple',
  templateUrl: './theme-switcher-simple.component.html'
})
export class RtuThemeSwitcherSimpleComponent implements OnInit {
  theme$: Observable<AppTheme> | undefined;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.theme$ = this.store.select(SettingsSelectors.selectTheme);
  }

  isDark(theme: AppTheme) {
    return theme === 'dark';
  }

  toggleTheme(currentTheme: AppTheme) {
    this.store.dispatch(
      SettingsActions.changeTheme({ theme: this.isDark(currentTheme) ? 'light' : 'dark' })
    );
  }
}
