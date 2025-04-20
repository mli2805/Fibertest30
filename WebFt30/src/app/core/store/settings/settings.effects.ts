import { Injectable } from '@angular/core';
import { ofType, createEffect, Actions } from '@ngrx/effects';
import {
  catchError,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  tap,
  withLatestFrom
} from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Store, select } from '@ngrx/store';

import { LocalStorageService } from '../../local-storage/local-storage.service';
import { SettingsActions } from './settings.actions';
import { SettingsSelectors } from './settings.selectors';
import { AppState } from '../../core.state';
import { IdentityService } from '../../grpc/services/identity.service';
import { MapUtils } from '../../map.utils';
import { AuthActions } from '../../auth/auth.actions';
import { of } from 'rxjs';
import { AuthSelectors } from '../../auth/auth.selectors';
import { AppDateTimeLanguageFormat, AppLanguage, AppTheme, LatLngFormat } from './settings.state';

@Injectable()
export class SettingsEffects {
  // Save it to the local storage too
  // This way we can load a proper settigns before the user is logged in
  persistLocalStorageSettings = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          SettingsActions.changeTheme,
          SettingsActions.changeLanguage,
          SettingsActions.changeDateTimeFormat,
          SettingsActions.changeLatLngFormat,
          SettingsActions.changeSwitchOffSuspicionSignalling,
          SettingsActions.changeSwitchOffRtuStatusEventsSignalling,
          SettingsActions.changeTimeZone
        ),
        withLatestFrom(this.store.pipe(select(SettingsSelectors.selectSettings))),
        tap(([action, settings]) => {
          this.localStorageService.setSettings({
            theme: settings.theme,
            language: settings.language,
            dateTimeFormat: settings.dateTimeFormat,
            latLngFormat: settings.latLngFormat,
            timeZone: settings.timeZone,
            switchOffSuspicionSignalling: settings.switchOffSuspicionSignalling,
            switchOffRtuStatusEventsSignalling: settings.switchOffRtuStatusEventsSignalling
          });
        })
      ),
    { dispatch: false }
  );

  persistLocalStorageSettingsAfterLoginOrGetCurrentUser = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess, AuthActions.loadCurrentUserSuccess),
        filter(({ settings }) => !!settings),
        tap(({ settings }) => {
          this.localStorageService.setSettings({
            theme: <AppTheme>settings!.theme,
            language: <AppLanguage>settings!.language,
            dateTimeFormat: <AppDateTimeLanguageFormat>settings!.dateTimeFormat,
            latLngFormat: <LatLngFormat>settings!.latLngFormat,
            switchOffSuspicionSignalling: settings!.switchOffSuspicionSignalling,
            switchOffRtuStatusEventsSignalling: settings!.switchOffRtuStatusEventsSignalling
          });
        })
      ),
    { dispatch: false }
  );

  persistDatabaseSettings = createEffect(() =>
    this.actions$.pipe(
      ofType(
        SettingsActions.changeTheme,
        SettingsActions.changeLanguage,
        SettingsActions.changeDateTimeFormat,
        SettingsActions.changeLatLngFormat,
        SettingsActions.changeSwitchOffSuspicionSignalling,
        SettingsActions.changeSwitchOffRtuStatusEventsSignalling,
        SettingsActions.changeTimeZone
      ),
      withLatestFrom(
        this.store.pipe(select(SettingsSelectors.selectSettings)),
        this.store.pipe(select(AuthSelectors.selectIsAuthenticated))
      ),
      // skip saving settings when debug toolbar is used to change them before user is authenicated
      filter(([action, settings, isAuthenticated]) => isAuthenticated),
      map(([action, settings, isAuthenticated]) => SettingsActions.saveUserSettings({ settings }))
    )
  );

  persistGisSettings = createEffect(() =>
    this.actions$.pipe(
      ofType(
        SettingsActions.changeZoom,
        SettingsActions.changeCenter,
        SettingsActions.changeShowNodesFromZoom,
        SettingsActions.changeSourceMapId
      ),
      withLatestFrom(this.store.pipe(select(SettingsSelectors.selectSettings))),
      map(([action, settings]) => SettingsActions.saveUserSettings({ settings }))
    )
  );

  saveUserSettings = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsActions.saveUserSettings),
      switchMap(({ settings }) => {
        const grpcUserSettings = MapUtils.toGprcUserSettings(settings);
        return this.identityService.saveUserSettings(grpcUserSettings).pipe(
          map((response) => {
            return SettingsActions.saveUserSettingsSuccess();
          }),
          catchError((error) => {
            return of(SettingsActions.saveUserSettingsFailure({ error }));
          })
        );
      })
    )
  );

  setTheme = createEffect(
    () =>
      this.store.pipe(
        select(SettingsSelectors.selectTheme),
        distinctUntilChanged(),
        tap((theme) => {
          if (theme === 'dark') {
            document.documentElement.classList.add('dark', 'dark-fiberizer-libs');
          } else {
            document.documentElement.classList.remove('dark', 'dark-fiberizer-libs');
          }
        })
      ),
    { dispatch: false }
  );

  setTranslateLanguage = createEffect(
    () =>
      this.store.pipe(
        select(SettingsSelectors.selectLanguage),
        distinctUntilChanged(),
        tap((language) => {
          this.translate.use(language);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private localStorageService: LocalStorageService,
    private translate: TranslateService,
    private identityService: IdentityService
  ) {}
}
