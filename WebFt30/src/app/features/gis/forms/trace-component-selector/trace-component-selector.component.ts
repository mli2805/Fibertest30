import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GraphService } from 'src/app/core/grpc';
import { RadioButton } from 'src/app/shared/components/svg-buttons/radio-button/radio-button';

@Component({
  selector: 'rtu-trace-component-selector',
  templateUrl: './trace-component-selector.component.html'
})
export class TraceComponentSelectorComponent {
  public dialogRef: DialogRef<number | null> = inject(DialogRef<number | null>);
  buttons!: RadioButton[];
  nodeTitle!: string;

  constructor(
    @Inject(DIALOG_DATA) private data: any,
    private ts: TranslateService,
    private graphService: GraphService
  ) {
    this.buttons = data.buttons;
    const index = this.buttons.length;
    this.buttons.push({
      id: index,
      title: this.ts.instant('i18n.ft.do-not-use-equipment'),
      isSelected: false
    });
    this.nodeTitle = data.nodeTitle;
  }

  onRadioButtonClick(id: number) {
    this.buttons.forEach((b) => {
      b.isSelected = b.id === id;
    });
  }

  onNext() {
    const result = this.buttons.find((b) => b.isSelected)!.id;
    this.dialogRef.close(result);
  }

  onExit() {
    this.dialogRef.close(null);
  }
}
