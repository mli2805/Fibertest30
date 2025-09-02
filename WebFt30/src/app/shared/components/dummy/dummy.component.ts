import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AppState } from 'src/app/core';
import { RouterSelectors } from 'src/app/core/router/router.selectors';
import { RouterStateUrl } from 'src/app/core/router/router.state';

@Component({
    selector: 'rtu-dummy',
    template: `<div class="flex flex-1 flex-col items-center justify-center">
    <div>Nothing is implemented here yet</div>
    <div class="text-sm">{{ (routerStateUrl$ | async)?.url }}</div>
  </div> `,
    styles: [':host { display: flex; flex-grow: 1; }'],
    standalone: false
})
export class DummyComponent {
  routerStateUrl$: Observable<RouterStateUrl>;

  constructor(private store: Store<AppState>) {
    this.routerStateUrl$ = this.store.select(RouterSelectors.selectRouterStateUrl);
  }
}
