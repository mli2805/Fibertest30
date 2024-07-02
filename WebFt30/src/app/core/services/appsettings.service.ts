import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, EMPTY, catchError, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GrpcUtils } from '../grpc/grpc.utils';

export interface AppSettings {
  showQuickSignIn: boolean;
  debugLanguage: boolean;
  logGrpcExecutionTime: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AppSettingsService {
  private appSettingsSubject = new BehaviorSubject<AppSettings | null>(null);
  public readonly settings$ = this.appSettingsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadDemoSettings();
  }

  private loadDemoSettings(): void {
    if (!environment.production) {
      this.setAppSettings({
        showQuickSignIn: true,
        debugLanguage: true,
        logGrpcExecutionTime: false // set to true to log grpc execution time in development mode
      });

      return;
    }

    this.http
      .get<AppSettings>('assets/appsettings.json')
      .pipe(
        tap((settings) => {
          this.setAppSettings(settings);
        }),
        catchError((error) => {
          return EMPTY;
        })
      )
      .subscribe();
  }

  private setAppSettings(settings: AppSettings) {
    this.appSettingsSubject.next(settings);
    GrpcUtils.logGrpcExecutionTime = settings.logGrpcExecutionTime;
  }
}
