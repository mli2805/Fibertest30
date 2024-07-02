import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AppState, AuthSelectors, OtausActions, OtausSelectors } from 'src/app/core';
import { Store } from '@ngrx/store';

@Component({
  selector: 'rtu-rfts-setup',
  templateUrl: 'rfts-setup.component.html',
  styles: [':host { display: flex; overflow-y: auto; flex-grow: 1; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RftsSetupComponent {
  otausActions = OtausActions;

  public store: Store<AppState> = inject(Store);
  loading$ = this.store.select(OtausSelectors.selectLoading);
  errorMessageId$ = this.store.select(OtausSelectors.selectErrorMessageId);
  otaus$ = this.store.select(OtausSelectors.selectOtausOtaus);

  hasOtauConfigurationPermission$ = this.store.select(
    AuthSelectors.selectHasOtauConfigurationPermisson
  );
}
