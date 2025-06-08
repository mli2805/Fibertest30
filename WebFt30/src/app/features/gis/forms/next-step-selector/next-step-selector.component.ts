import { AfterViewInit, Component, HostListener, ViewChild } from '@angular/core';
import { RadioButton } from 'src/app/shared/components/svg-buttons/radio-button/radio-button';
import { GisMapService } from '../../gis-map.service';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { DragWatcher } from 'src/app/shared/utils/drag-watcher';

@Component({
  selector: 'rtu-next-step-selector',
  templateUrl: './next-step-selector.component.html'
})
export class NextStepSelectorComponent implements AfterViewInit {
  @ViewChild(CdkDrag) dragRef!: CdkDrag;
  dragWatcher = DragWatcher;

  buttons!: RadioButton[];

  constructor(private gisMapService: GisMapService) {
    this.buttons = this.gisMapService.nextStepButtons;
  }

  ngAfterViewInit() {
    this.dragRef.setFreeDragPosition({ x: 190, y: 80 });
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

  close() {
    this.gisMapService.closeNextStepSelector(null);
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape() {
    this.close();
  }
}
