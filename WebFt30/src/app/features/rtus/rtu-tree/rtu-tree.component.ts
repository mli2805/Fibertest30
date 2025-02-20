import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, RtuTreeSelectors } from 'src/app/core';
import { RtuMgmtSelectors } from 'src/app/core/store/rtu-mgmt/rtu-mgmt.selectors';
import { GisMapService } from '../../gis/gis-map.service';

@Component({
  selector: 'rtu-rtu-tree',
  templateUrl: './rtu-tree.component.html',
  providers: [GisMapService],
  styles: [':host { overflow-y: auto; display: flex; width: 100%; height: 100%; }']
})
export class RtuTreeComponent {
  rtus$ = this.store.select(RtuTreeSelectors.selectRtuArray);
  inProgress$ = this.store.select(RtuMgmtSelectors.selectRtuOperationInProgress);
  loading$ = this.store.select(RtuTreeSelectors.selectLoading);

  treeWidth = 384;

  constructor(private store: Store<AppState>, public gisMapService: GisMapService) {}

  sliderMouseDown($event: MouseEvent) {
    this.gisMapService.sliderMouseDown = $event;
  }

  sliderMouseUp($event: MouseEvent) {
    this.gisMapService.sliderMouseDown = null;
  }

  mouseMove($event: MouseEvent) {
    if (this.gisMapService.sliderMouseDown !== null) {
      const delta = this.gisMapService.sliderMouseDown.clientX - $event.clientX;
      this.treeWidth = this.treeWidth - delta;
      this.gisMapService.sliderMouseDown = $event;
    }
  }

  mouseUp($event: MouseEvent) {
    this.gisMapService.sliderMouseDown = null;
  }
}
