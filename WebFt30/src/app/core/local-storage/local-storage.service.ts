import { Injectable } from '@angular/core';

import { AuthState } from '../auth/auth.state';
import { AuthUtils } from '../auth/auth.utils';
import {
  AppLanguage,
  AppLanguages,
  SettingsState
} from '../store/settings/settings.state';

const APP_PREFIX = 'RTU400-';

const AUTH_TOKEN_KEY = 'AuthToken';

const SETTINGS_KEY = 'Settings';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  static loadInitialAuthState(
    validateExpiration = true
  ): Partial<AuthState> | Record<string, never> {
    const storage = new LocalStorageService();

    const auth = storage.getAuth();
    if (!auth) {
      return {};
    }

    if (validateExpiration) {
      const jwtToken = AuthUtils.decodeToken(auth.token!);
      if (jwtToken.exp < Date.now() / 1000) {
        console.log('Token expired at ' + new Date(jwtToken.exp * 1000).toISOString());
        storage.removeAuth();
        return {};
      }
    }

    return auth;
  }

  static loadInitialSettingsState(): Partial<SettingsState> {
    const storage = new LocalStorageService();
    const settings = storage.getSettings();

    if (!settings.theme) {
      settings.theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    if (!settings.language) {
      const userLanguage = <AppLanguage>navigator.language.split('-')[0];
      if (AppLanguages.includes(userLanguage)) {
        settings.language = userLanguage;
      }
    }

    return settings;
  }

  setItem(key: string, value: any) {
    localStorage.setItem(`${APP_PREFIX}${key}`, JSON.stringify(value));
  }

  getItem(key: string) {
    const value = localStorage.getItem(`${APP_PREFIX}${key}`);
    if (!value) {
      return value;
    }
    return JSON.parse(value);
  }

  removeItem(key: string) {
    localStorage.removeItem(`${APP_PREFIX}${key}`);
  }

  clear() {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith(APP_PREFIX)) {
        localStorage.removeItem(key);
      }
    }
  }

  /** Tests that localStorage exists, can be written to, and read from. */
  testLocalStorage() {
    const testValue = 'testValue';
    const testKey = 'testKey';
    const errorMessage = 'localStorage did not return expected value';

    this.setItem(testKey, testValue);
    const retrievedValue = this.getItem(testKey);
    this.removeItem(testKey);

    if (retrievedValue !== testValue) {
      throw new Error(errorMessage);
    }
  }

  setAuth(token: string) {
    this.setItem(AUTH_TOKEN_KEY, token);
  }

  getAuth(): Partial<AuthState> | null {
    const token = this.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      return null;
    }
    return { token };
  }

  removeAuth() {
    this.removeItem(AUTH_TOKEN_KEY);
  }

  getSettings(): Partial<SettingsState> {
    const settings = this.getItem(SETTINGS_KEY);
    return settings || {};
  }

  setSettings(settings: Partial<SettingsState>) {
    this.setItem(SETTINGS_KEY, settings);
  }
}
