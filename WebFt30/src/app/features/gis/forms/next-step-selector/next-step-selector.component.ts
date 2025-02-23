import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, inject } from '@angular/core';
import { RadioButton } from 'src/app/shared/components/svg-buttons/radio-button/radio-button';

@Component({
  selector: 'rtu-next-step-selector',
  templateUrl: './next-step-selector.component.html'
})
export class NextStepSelectorComponent {
  public dialogRef: DialogRef<number | null> = inject(DialogRef<number | null>);
  buttons!: RadioButton[];
  service!: any;

  constructor(@Inject(DIALOG_DATA) private data: any) {
    this.buttons = data.buttons;
    this.service = data.service;
  }

  onRadioButtonClick(id: number) {
    this.buttons.forEach((b) => {
      b.isSelected = b.id === id;
    });

    this.service.setHighlightNode((<any>this.buttons[id]).nodeId);
  }

  onSelect() {
    const result = this.buttons.find((b) => b.isSelected)!.id;
    this.dialogRef.close(result);
  }

  onDiscard() {
    this.dialogRef.close(null);
  }
}
