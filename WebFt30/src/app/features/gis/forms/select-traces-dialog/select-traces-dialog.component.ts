import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, inject, Input } from '@angular/core';
import { MultiSelectionButton } from 'src/app/shared/components/svg-buttons/multi-selection-button/multi-selection-button';

@Component({
  selector: 'rtu-select-traces-dialog',
  templateUrl: './select-traces-dialog.component.html'
})
export class SelectTracesDialogComponent {
  public dialogRef: DialogRef<string[] | null> = inject(DialogRef<string[] | null>);

  traceTable!: MultiSelectionButton[];

  constructor(@Inject(DIALOG_DATA) private data: any) {
    this.traceTable = data.traceTable;
  }

  onTraceClick(i: number) {
    this.traceTable[i].isSelected = !this.traceTable[i].isSelected;
  }

  onDiscardClicked() {
    this.dialogRef.close(null);
  }

  onApplyClicked() {
    const result = this.traceTable.filter((t) => t.isSelected).map((t) => (<any>t).traceId);
    this.dialogRef.close(result);
  }
}
