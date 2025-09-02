import { Component, HostListener, Inject, inject } from '@angular/core';
import { RadioButton } from 'src/app/shared/components/svg-buttons/radio-button/radio-button';
import { GisMapService } from '../../gis-map.service';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';

@Component({
    selector: 'rtu-next-step-selector',
    templateUrl: './next-step-selector.component.html',
    standalone: false
})
export class NextStepSelectorComponent {
  buttons!: RadioButton[];
  public dialogRef: DialogRef<number | null> = inject(DialogRef<number | null>);

  constructor(@Inject(DIALOG_DATA) private data: any, private gisMapService: GisMapService) {
    this.buttons = data.buttons;
  }

  onRadioButtonClick(id: number) {
    this.buttons.forEach((b) => {
      b.isSelected = b.id === id;
    });

    this.gisMapService.setHighlightNode((<any>this.buttons[id]).nodeId);
  }

  onSelect() {
    const result = this.buttons.find((b) => b.isSelected)!.id;
    this.dialogRef.close(result);
  }

  onDiscard() {
    this.dialogRef.close(null);
  }

  close() {
    this.dialogRef.close(null);
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape() {
    this.close();
  }
}
