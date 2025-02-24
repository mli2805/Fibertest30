import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, interval, combineLatest } from 'rxjs';
import { startWith, map, withLatestFrom } from 'rxjs/operators';
import { AppState } from '../core.state';
import { SettingsSelectors } from '../store/settings/settings.selectors';
import { AppLanguage } from '../store/settings/settings.state';

// If any new language is added, we should add a corresponding regex pattern here
const StripAgoPatterns: Record<AppLanguage, string> = {
  en: 'ago',
  ru: 'назад',

  debug: 'ago' // we pass 'en' as a language for the debug mode
};

@Injectable({
  providedIn: 'root'
})
export class TimeAgoService {
  language$ = this.store.select(SettingsSelectors.selectLanguage);

  constructor(private store: Store<AppState>) {}

  getRelativeTime(date: Date, skipFirstMinute = true, stripAgo = false): Observable<string> {
    const updateInterval = skipFirstMinute ? 5000 : 1000;

    return combineLatest([interval(updateInterval).pipe(startWith(0)), this.language$]).pipe(
      map(([_, language]) => this.relativeTime(date, skipFirstMinute, stripAgo, language))
    );
  }

  private relativeTime(
    date: Date,
    skipFirstMinute: boolean,
    stripAgo: boolean,
    language: AppLanguage
  ): string {
    const currentDate = new Date();
    const targetDate = date;

    if (language === 'debug') {
      language = 'en';
    }

    const relative = new Intl.RelativeTimeFormat(language, { numeric: 'always' });
    const diffInSeconds = Math.floor((currentDate.getTime() - targetDate.getTime()) / 1000);

    if (skipFirstMinute && diffInSeconds <= 60) {
      return '';
    }

    const timeIntervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1
    };

    for (const i in timeIntervals) {
      // + 1 second to avoid sending '', let's start from 1 second
      const counter = Math.floor((diffInSeconds + 1) / (<any>timeIntervals)[i]);
      if (counter > 0) {
        const result = relative.format(-counter, <any>i);
        if (stripAgo) {
          return this.stripAgo(result, language);
        } else {
          return result;
        }
      }
    }

    return '';
  }

  private stripAgo(relativeTime: string, language: AppLanguage): string {
    const pattern = StripAgoPatterns[language];
    if (pattern) {
      return relativeTime.replace(pattern, '').trim();
    }
    return relativeTime;
  }
}
