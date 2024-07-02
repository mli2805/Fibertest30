import { Injectable } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { filter, pairwise } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HighlightNavigationService {
  monitoringHistoryMonitoringId: number | null = null;
  //   alarmsAlarmEventId: number | null = null;

  constructor(private router: Router) {
    this.subscribeToRouterEvents();
  }

  public resetMonitoringHistoryMonitoringId() {
    // remove highlight, so when cdk virtual scroll recreates the item it won't highlighted again
    // give some time before resetting, to show the animation
    setTimeout(() => {
      this.monitoringHistoryMonitoringId = null;
    }, 1000);
  }

  private subscribeToRouterEvents() {
    this.router.events
      .pipe(
        filter((evt: any) => evt instanceof RoutesRecognized),
        pairwise()
      )
      .subscribe((events: RoutesRecognized[]) => {
        const prev = events[0].urlAfterRedirects;
        const curr = events[1].urlAfterRedirects;

        // reset all
        this.monitoringHistoryMonitoringId = null;
        // this.alarmsAlarmEventId = null;

        if (
          prev.startsWith('/reporting/monitoring-history/') &&
          curr === '/reporting/monitoring-history'
        ) {
          this.monitoringHistoryMonitoringId = +this.getIdFromUrl(prev);
        }

        // if (prev.startsWith('/reporting/alarms/') && curr === '/reporting/alarms') {
        //   this.alarmsAlarmEventId = +this.getIdFromUrl(prev);
        // }
      });
  }

  private getIdFromUrl(url: string) {
    const parts = url.split('/');
    const id = parts[parts.length - 1];
    return id;
  }
}
