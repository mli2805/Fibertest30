import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import {
  AppSettingsService,
  AppState,
  GlobalUiSelectors,
  NavigationService,
  TreeNavigationService,
  LocalStorageService,
  WindowRefService
} from '../core';
import { environment } from 'src/environments/environment';

const HIDE_DEBUG_TOOLBAR_KEY = 'DEBUG-HideDebugToolbar';

@Component({
  selector: 'rtu-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  debugToolbarEnabled = !environment.production;
  hideDebugToolbar!: boolean;
  loading$!: Observable<boolean>;

  get isDemoActive(): boolean {
    return this.router.isActive('/demo', {
      paths: 'subset',
      queryParams: 'subset',
      fragment: 'ignored',
      matrixParams: 'ignored'
    });
  }

  get isErrorActive(): boolean {
    return this.router.isActive('/error', {
      paths: 'subset',
      queryParams: 'subset',
      fragment: 'ignored',
      matrixParams: 'ignored'
    });
  }

  constructor(
    private storageService: LocalStorageService,
    private store: Store<AppState>,
    public router: Router,
    private localStorageService: LocalStorageService,
    private highlightService: TreeNavigationService, // keep the service here to initialize it on application start
    private navigationService: NavigationService, // keep the service here to initialize it on application start
    private appSettingsService: AppSettingsService // keep the service here to initialize it on application start
  ) {}

  ngOnInit() {
    this.loading$ = this.store.select(GlobalUiSelectors.selectLoading);
    this.storageService.testLocalStorage();

    this.hideDebugToolbar = this.localStorageService.getItem(HIDE_DEBUG_TOOLBAR_KEY) ?? true;
  }

  toggleDebugToolbar() {
    this.hideDebugToolbar = !this.hideDebugToolbar;
    this.localStorageService.setItem(HIDE_DEBUG_TOOLBAR_KEY, this.hideDebugToolbar);
  }
}
