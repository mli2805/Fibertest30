import { Component, inject, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { WindowService } from 'src/app/app/pages/start-page/components/window.service';
import { AppState, AuthSelectors } from 'src/app/core';
import { CoreUtils } from 'src/app/core/core.utils';
import { GisService } from 'src/app/core/grpc/services/gis.service';
import { GisMapping } from 'src/app/core/store/mapping/gis-mappings';
import { OneLandmark } from 'src/app/core/store/models/ft30/geo-data';

interface LandmarksModel {
  landmarks: OneLandmark[];
}

@Component({
  selector: 'rtu-landmarks',
  templateUrl: './landmarks.component.html',
  styleUrls: ['./landmarks.component.scss']
})
export class LandmarksComponent implements OnInit {
  spinning = new BehaviorSubject<boolean>(false);
  spinning$ = this.spinning.asObservable();

  @Input() traceId!: string;

  public store: Store<AppState> = inject(Store);
  private hasEditGraphPermission = CoreUtils.getCurrentState(
    this.store,
    AuthSelectors.selectHasEditGraphPermission
  );

  landmarksModel = new BehaviorSubject<LandmarksModel | null>(null);
  model$ = this.landmarksModel.asObservable();

  constructor(private windowService: WindowService, private gisService: GisService) {}

  async ngOnInit(): Promise<void> {
    this.spinning.next(true);
    const response = await firstValueFrom(this.gisService.getLandmarks(this.traceId));
    this.spinning.next(false);
    if (response === null) this.close();

    const landmarks = response.landmarks.map((l) => GisMapping.fromOneLandmark(l));
    console.log(landmarks);
    this.landmarksModel.next({ landmarks: landmarks });
  }

  zIndex = 1;
  bringToFront() {
    this.windowService.bringToFront(this.traceId, 'Landmarks');
    this.updateZIndex();
  }

  private updateZIndex() {
    const windowData = this.windowService.getWindows().find((w) => w.id === this.traceId);
    // Обновляем только если значение изменилось
    if (windowData?.zIndex !== this.zIndex) {
      this.zIndex = windowData?.zIndex || 1;
    }
  }

  close() {
    this.windowService.unregisterWindow(this.traceId, 'Landmarks');
  }
}
