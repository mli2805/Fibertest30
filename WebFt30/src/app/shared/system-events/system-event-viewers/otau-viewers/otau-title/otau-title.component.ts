import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { EMPTY, Observable } from 'rxjs';
import { AppState, OtausSelectors } from 'src/app/core';
import { ConvertUtils } from 'src/app/core/convert.utils';
import { Otau } from 'src/app/core/store/models';

@Component({
  selector: 'rtu-otau-title',
  template: `
    <ng-container *ngIf="otau$ | async as otau">
      <span
        *ngIf="otau.name; else noOtauName"
        class="inline-block max-w-[30ch] truncate align-bottom"
      >
        {{ otau.name }}
      </span>
      <ng-template #noOtauName>
        <span class="uppercase"> {{ converterUtils.otauTypeToString(otau.type) }}</span>
        <span
          *ngIf="otau.ocmPortIndex > 0 && !showOnlyType"
          class="ml-1 font-bold text-blue-600 dark:text-blue-400"
          >{{ otau.ocmPortIndex }}</span
        >
      </ng-template>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OtauTitleComponent {
  public otau$: Observable<Otau | null> = EMPTY;
  converterUtils = ConvertUtils;

  @Input() showOnlyType = false;

  @Input() set otauId(value: number) {
    this.otau$ = this.store.select(OtausSelectors.selectOtauById(value));
  }

  constructor(private store: Store<AppState>) {}
}
