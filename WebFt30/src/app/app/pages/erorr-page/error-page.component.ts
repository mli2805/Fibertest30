import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState, GlobalUiSelectors, WindowRefService } from 'src/app/core';

@Component({
  selector: 'rtu-error-page',
  templateUrl: 'error-page.component.html',
  styles: [
    `
      :host {
        width: 100%;
        height: 100%;
      }
    `
  ]
})
export class ErrorPageComponent {
    error$: Observable<string | null>;
  constructor(private store: Store<AppState>
    , private router: Router
    , private windowRef: WindowRefService) {
    this.error$ = this.store.select(GlobalUiSelectors.selectError);
  }

  navigateToRootAndReload() {
    this.windowRef.reload();
  }
}
