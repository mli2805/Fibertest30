import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, AuthSelectors } from 'src/app/core';

@Component({
  selector: 'rtu-gis',
  templateUrl: 'gis.component.html',
  styles: [':host { display: flex; flex-grow: 1; }']
})
export class GisComponent {
  public store: Store<AppState> = inject(Store);
  hasEditPermission$ = this.store.select(AuthSelectors.selectHasEditGraphPermission);
}
