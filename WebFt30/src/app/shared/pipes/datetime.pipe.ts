import { Pipe, PipeTransform, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import {
  AppDateTimeFormat,
  AppDateTimeLanguageFormat,
  AppState,
  SettingsSelectors
} from 'src/app/core';
import { AppTimezone } from 'src/app/core/store/models';

@Pipe({
  name: 'rtuDateTime',
  pure: false
})
export class RtuDateTimePipe implements PipeTransform, OnDestroy {
  private formatAndZoneSubscription: Subscription;

  private dateTimeLanguageFormat!: AppDateTimeLanguageFormat;
  private timezone!: AppTimezone;

  private static cache: Map<string, Intl.DateTimeFormat> = new Map();

  constructor(private store: Store<AppState>, private cdRef: ChangeDetectorRef) {
    this.formatAndZoneSubscription = this.store
      .select(SettingsSelectors.selectTimeZone)
      .subscribe(({ dateTimeFormat, timeZone }) => {
        this.dateTimeLanguageFormat = dateTimeFormat;
        this.timezone = timeZone; // "пустая", я не передаю с сервера
      });

    const tz = new AppTimezone();
    tz.ianaId = Intl.DateTimeFormat().resolvedOptions().timeZone; // берем таймзону браузера
    this.timezone = tz;
  }

  transform(
    value: Date,
    timeFormat: AppDateTimeFormat = 'short',
    mode: 'full' | 'date' | 'time' = 'full',
    overrideDataFormatLanguage: AppDateTimeLanguageFormat | null = null,
    ignoreTimeZone = false
  ): string {
    const timeFormatToUse = timeFormat;
    const timezoneIanaId = ignoreTimeZone ? undefined : this.timezone.ianaId;
    const dateTimeLanguageFormat = overrideDataFormatLanguage || this.dateTimeLanguageFormat;

    return RtuDateTimePipe.getDateString(
      value,
      dateTimeLanguageFormat,
      timezoneIanaId,
      mode,
      timeFormatToUse
    );
  }

  getDateTimeForFileName(
    value: Date,
    overrideDataFormatLanguage: AppDateTimeLanguageFormat | null = null
  ) {
    const dateTimeLanguageFormat = overrideDataFormatLanguage || this.dateTimeLanguageFormat;

    const dt = RtuDateTimePipe.getDateString(
      value,
      dateTimeLanguageFormat,
      this.timezone.ianaId,
      'full',
      'medium'
    );

    return dt
      .replaceAll('.', '-')
      .replaceAll(':', '-')
      .replaceAll('/', '-')
      .replaceAll(',', '')
      .replaceAll('AM', '')
      .replaceAll('PM', '');
  }

  static getDateString(
    value: Date,
    dateTimeLanguageFormat: AppDateTimeLanguageFormat,
    timezoneIanaId: string | undefined,
    mode: 'full' | 'date' | 'time' = 'full',
    timeFormatToUse: AppDateTimeFormat
  ): string {
    let dateFormatToUse: AppDateTimeFormat = 'short';

    if (mode === 'date') {
      timeFormatToUse = <any>undefined;
    }

    if (mode === 'time') {
      dateFormatToUse = <any>undefined;
    }

    const cacheKey = `${dateTimeLanguageFormat}-${dateFormatToUse}-${timeFormatToUse}-${timezoneIanaId}`;
    if (!this.cache.has(cacheKey)) {
      // no need to handle backward compatibility with old dateTimeLanguageFormat ('short', 'medium', 'long')
      // if language is not right, the default will be used
      const formatter = new Intl.DateTimeFormat(dateTimeLanguageFormat, {
        dateStyle: dateFormatToUse,
        timeStyle: timeFormatToUse,
        timeZone: timezoneIanaId
      });
      this.cache.set(cacheKey, formatter);
    }

    const formatter = this.cache.get(cacheKey)!;
    return formatter.format(value);
  }

  ngOnDestroy() {
    this.formatAndZoneSubscription.unsubscribe();
  }
}
