import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageLine } from './message-line';

@Component({
  selector: 'rtu-message-box',
  templateUrl: './message-box.component.html'
})
export class MessageBoxComponent {
  public dialogRef: DialogRef<boolean> = inject(DialogRef<boolean>);
  type!: 'Error' | 'Information' | 'Confirmation';
  title!: string;
  lines!: MessageLine[];

  constructor(
    @Inject(DIALOG_DATA)
    private data: {
      type: 'Error' | 'Information' | 'Confirmation';
      lines: MessageLine[];
    },
    private ts: TranslateService
  ) {
    this.type = data.type;
    this.title = this.getTitle(data.type);
    this.lines = data.lines;
  }

  private getTitle(type: 'Error' | 'Information' | 'Confirmation'): string {
    switch (type) {
      case 'Error':
        return this.ts.instant('i18n.ft.error');
      case 'Information':
        return this.ts.instant('i18n.ft.information');
      case 'Confirmation':
        return this.ts.instant('i18n.ft.confirmation');
    }
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  onOk() {
    this.dialogRef.close(true);
  }
}
