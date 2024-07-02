import { Dialog } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { Store } from '@ngrx/store';
import { Observable, filter, switchMap, takeUntil } from 'rxjs';
import {
  AppState,
  AuthSelectors,
  MonitoringPortSelectors,
  OtausActions,
  OtausSelectors
} from 'src/app/core';
import { ConvertUtils } from 'src/app/core/convert.utils';
import { AddOtauDialogComponent } from './components/add-otau-dialog/add-otau-dialog.component';
import { ConfirmationComponent } from 'src/app/shared/components/confirmation/confirmation.component';
import { TranslateService } from '@ngx-translate/core';
import { OtauTitleComponent } from 'src/app/shared/system-events/system-event-viewers';
import { OnDestroyBase } from 'src/app/shared/components/on-destroy-base/on-destroy-base';
import { Otau } from 'src/app/core/store/models';
import { CombinedPort } from 'src/app/core/store/models/combined-port';
import { MonitoringPortStatus } from 'src/grpc-generated';

@Component({
  selector: 'rtu-otau-management',
  templateUrl: './otau-management.component.html',
  styles: [':host { width: 100%; height: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OtauManagementComponent extends OnDestroyBase {
  store: Store<AppState> = inject(Store<AppState>);
  ocmOtau$ = this.store.select(OtausSelectors.selectOcmOtau);
  ocmOtauCombinedPorts$: Observable<CombinedPort[]>;
  errorMessageId$ = this.store.select(OtausSelectors.selectErrorMessageId);
  loading$ = this.store.select(OtausSelectors.selectLoading);
  convertUtils = ConvertUtils;
  otausActions = OtausActions;
  monitoringPortStatus = MonitoringPortStatus;
  hasOtauConfigurationPermission$ = this.store.select(
    AuthSelectors.selectHasOtauConfigurationPermisson
  );

  constructor(private dialog: Dialog, private ts: TranslateService) {
    super();

    this.ocmOtauCombinedPorts$ = this.ocmOtau$.pipe(
      takeUntil(this.ngDestroyed$),
      filter((otau: any) => otau !== null),
      switchMap((otau: Otau) => {
        return this.store.select(MonitoringPortSelectors.selectCombinedOtauPorts(otau));
      })
    );
  }

  onAddOtauClick(portIndex: number) {
    this.dialog.open(AddOtauDialogComponent, {
      maxHeight: '95vh',
      maxWidth: '95vw',
      // width: '50ch',
      disableClose: true,
      data: { portIndex }
    });
  }

  removeOtau(otauType: string, portIndex: number, otauId: number) {
    const confirmation = this.dialog.open(ConfirmationComponent, {
      maxHeight: '95vh',
      maxWidth: '95vw',
      disableClose: true,
      data: {
        // title: `${otauType.toUpperCase()} ${portIndex}`,
        title: OtauTitleComponent,
        titleInput: { otauId },
        message: this.ts.instant('i18n.otau-management.confirm-remove'),
        mode: 'remove'
      }
    });

    confirmation.closed.subscribe((result) => {
      if (result) {
        this.store.dispatch(OtausActions.removeOtau({ otauId }));
      }
    });
  }

  oxcParametersToAddress(oxcParameters: string): string {
    return ConvertUtils.oxcParametersToAddress(oxcParameters);
  }
}
