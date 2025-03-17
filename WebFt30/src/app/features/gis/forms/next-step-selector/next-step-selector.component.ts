import { Component } from '@angular/core';
import { RadioButton } from 'src/app/shared/components/svg-buttons/radio-button/radio-button';
import { GisMapService } from '../../gis-map.service';

@Component({
  selector: 'rtu-next-step-selector',
  templateUrl: './next-step-selector.component.html'
})
export class NextStepSelectorComponent {
  buttons!: RadioButton[];

  constructor(private gisMapService: GisMapService) {
    this.buttons = this.gisMapService.nextStepButtons;
  }

  onRadioButtonClick(id: number) {
    this.buttons.forEach((b) => {
      b.isSelected = b.id === id;
    });

    this.gisMapService.setHighlightNode((<any>this.buttons[id]).nodeId);
  }

  onSelect() {
    const result = this.buttons.find((b) => b.isSelected)!.id;
    this.gisMapService.closeNextStepSelector(result);
  }

  onDiscard() {
    this.gisMapService.closeNextStepSelector(null);
  }
}
