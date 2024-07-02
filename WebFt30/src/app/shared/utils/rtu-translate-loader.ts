import { TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { TranslateLoader as FiberizerTranslateLoader } from '@veex/common';
import { languages } from '@veex/common';

export class RtuTranslateLoader implements TranslateLoader {
  constructor(private http: HttpClient, private module: string | null = null) {}

  getTranslation(lang: string): Observable<any> {
    return this.getModuleTranslations(lang).pipe(
      map((moduleStrings) => {
        const fiberizerStrings = FiberizerTranslateLoader.getLanguageStrings(languages, lang);
        return { ...moduleStrings, ...fiberizerStrings };
      })
    );
  }

  getModuleTranslations(lang: string): Observable<any> {
    const debugMode = lang == 'debug';
    const moduleUrl = this.getModuleUrl(debugMode ? 'en' : lang);

    return this.httpGetIgnoreErrors(moduleUrl).pipe(
      tap((translations) => {
        if (debugMode) {
          Object.keys(translations).forEach((key) => {
            translations[key] = translations[key].replace(/[^#{}, -!.]/g, '*');
          });
        }
      })
    );
  }

  private getModuleUrl(lang: string) {
    const moduleUrl =
      this.module == null ? `assets/i18n/${lang}.json` : `assets/i18n/${this.module}/${lang}.json`;
    return moduleUrl;
  }

  httpGetIgnoreErrors(url: string): Observable<any> {
    return this.http.get(url).pipe(catchError(() => of({})));
  }
}
