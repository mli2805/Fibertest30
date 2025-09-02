import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { LogOperationCode } from 'src/app/core/store/models/ft30/user-action-line';
import { logOperationGroups } from './log-operation-groups';

@Component({
    selector: 'rtu-log-operation-filter',
    templateUrl: './log-operation-filter.component.html',
    standalone: false
})
export class LogOperationFilterComponent {
  public dialogRef: DialogRef<LogOperationCode[] | null> = inject(
    DialogRef<LogOperationCode[] | null>
  );
  private initialSelectedCodes: LogOperationCode[] = inject(DIALOG_DATA) ?? [];

  readonly groups = logOperationGroups.map((group) => ({
    ...group,
    options: group.options.map((option) => ({
      ...option,
      selected: this.initialSelectedCodes.includes(option.code)
    }))
  }));

  get anySelected(): boolean {
    return this.groups.some((group) => group.options.some((option) => option.selected));
  }

  get allSelected(): boolean {
    return this.groups.every((group) => group.options.every((option) => option.selected));
  }

  toggleAll(): void {
    const checked = !this.allSelected;
    this.groups.forEach((group) => group.options.forEach((option) => (option.selected = checked)));
  }

  get selectedCodes(): LogOperationCode[] {
    return this.groups.flatMap((g) => g.options.filter((o) => o.selected).map((o) => o.code));
  }

  isApplyDisabled() {
    return !this.anySelected;
  }

  onApply() {
    this.dialogRef.close(this.selectedCodes);
  }

  onClose() {
    this.dialogRef.close(null);
  }
}
