import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { AppState, OtausSelectors } from 'src/app/core';
import { CoreUtils } from 'src/app/core/core.utils';

@Component({
  template: ``
})
export class RouterSelectedOtauRedirectComponent implements OnInit {
  private store = inject(Store<AppState>);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    this.navigateToRouterSelectedOtau();
  }

  private navigateToRouterSelectedOtau() {
    const otau = CoreUtils.getCurrentState(
      this.store,
      OtausSelectors.selectRouterSelectedOtauOrDefault
    );
    this.router.navigate([otau.ocmPortIndex], { relativeTo: this.route });
  }
}
