import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { MeasurementSettignsService } from './measurement-settings.service';
import { OnDestroyBase } from 'src/app/shared/components/on-destroy-base/on-destroy-base';
import { takeUntil, tap } from 'rxjs';

@Component({
  selector: 'rtu-measurement-settings',
  templateUrl: 'measurement-settings.component.html',
  styleUrls: ['./measurement-settings.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MeasurementSettingsComponent extends OnDestroyBase {
  constructor(public settingsService: MeasurementSettignsService, private cd: ChangeDetectorRef) {
    super();

    settingsService.measurementSettingsSetExternally$
      .pipe(
        takeUntil(this.ngDestroyed$),
        tap(() => {
          this.cd.markForCheck();
        })
      )
      .subscribe();
  }
}
