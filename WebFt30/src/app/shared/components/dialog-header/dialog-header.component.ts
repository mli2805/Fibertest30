import { Component, inject } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
    selector: 'rtu-dialog-header',
    templateUrl: 'dialog-header.component.html',
    standalone: false
})
export class DialogHeaderComponent {
  public dialogRef: DialogRef = inject(DialogRef);

  get showClose(): boolean {
    return !this.dialogRef.disableClose;
  }

  close() {
    this.dialogRef.close(false);
  }
}
