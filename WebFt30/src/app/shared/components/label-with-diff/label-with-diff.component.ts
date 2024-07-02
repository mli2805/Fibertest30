import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

export class LabelWithDiff {
  labelId!: string;
  oldValue!: string | number;
  newValue!: string | number;
}

@Component({
  selector: 'rtu-label-with-diff',
  template: `
    <div class="grid grid-cols-[auto_minmax(0,_1fr)]">
      <ng-container *ngFor="let diff of diffs">
        <span class="text-data-highlight mr-2 flex items-center">
          {{ diff.labelId | translate }}:
        </span>
        <div class="flex items-center">
          <span class="text-red-500 dark:text-red-300">{{ diff.oldValue }}</span>
          <span *ngIf="diff.oldValue === ''" class="inline-block h-4 w-3 bg-red-500 dark:bg-red-300"
            >&nbsp;</span
          >
          <span class="mx-2">
            <!-- prettier-ignore -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.25 8.25 18 12m0 0-2.75 3.75M18 12H5" />
          </svg>
          </span>
          <span class="text-green-500 dark:text-green-300">{{ diff.newValue }}</span>
          <span
            *ngIf="diff.newValue === ''"
            class="inline-block h-4 w-3 bg-green-500 dark:bg-green-300"
            >&nbsp;</span
          >
        </div>
      </ng-container>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LabelWithDiffComponent {
  @Input() diffs!: LabelWithDiff[];
}
