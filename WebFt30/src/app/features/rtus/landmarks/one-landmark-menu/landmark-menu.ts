import { Dialog } from '@angular/cdk/dialog';
import { Injector } from '@angular/core';
import { OneLandmark } from 'src/app/core/store/models/ft30/one-landmark';
import { GisMapService } from 'src/app/features/gis/gis-map.service';

export class LandmarkMenu {
  private static dialog: Dialog;
  private static gisMapService: GisMapService;
  static initialize(injector: Injector) {
    this.gisMapService = injector.get(GisMapService);
    this.dialog = injector.get(Dialog);
  }

  static handleMenuAction(action: string, landmark: OneLandmark | null) {
    if (!landmark) return;

    switch (action) {
      case 'equipment':
        this.equipmentOfLandmark(landmark);
        break;
      case 'node':
        this.nodeOfLandmark(landmark);
        break;
      case 'section':
        this.sectionOfLandmark(landmark);
        break;
    }
  }

  static equipmentOfLandmark(landmark: OneLandmark) {
    console.log('equipmentOfLandmark:', landmark.number);
  }

  static nodeOfLandmark(landmark: OneLandmark) {
    this.gisMapService.showNodeInfoDialog.next(landmark.nodeId);
  }

  static sectionOfLandmark(landmark: OneLandmark) {
    this.gisMapService.showSectionInfoDialog.next(landmark.fiberId);
  }
}
