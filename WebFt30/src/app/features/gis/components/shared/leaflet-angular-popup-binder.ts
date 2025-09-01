import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  EnvironmentInjector,
  Type
} from '@angular/core';
import L from 'leaflet';

interface LastPopup {
  componentRef: ComponentRef<any>;
  marker: L.Marker<any>;
}

export class LeafletAngularPopupBinder {
  private lastPopup: LastPopup | null = null;

  constructor(private appRef: ApplicationRef, private envInjector: EnvironmentInjector) {}

  dynamicBindPopup<C>(
    marker: L.Marker<any>,
    component: Type<C>,
    setInstanceData: (instance: C) => void,
    popupOptions?: L.PopupOptions
  ): void {
    marker.on('click', () => {
      if (this.lastPopup) {
        const sameMarkerClicked = this.lastPopup.marker === marker;

        this.lastPopup.marker.closePopup();
        this.destroyLastPopup();

        if (sameMarkerClicked) {
          // just hide popup
          return;
        }
      }

      const popupRef = createComponent(component, {
        environmentInjector: this.envInjector
      });
      this.lastPopup = { componentRef: popupRef, marker };

      // attach to application, to include in change detection
      this.appRef.attachView(popupRef.hostView);
      setInstanceData(popupRef.instance);
      popupRef.changeDetectorRef.detectChanges();

      // create and open popup
      const popup = marker.bindPopup(popupRef.location.nativeElement, popupOptions).openPopup();
    });

    marker.on('popupclose', () => {
      this.destroyLastPopup();
    });
  }

  private destroyLastPopup(): void {
    if (this.lastPopup) {
      this.lastPopup.marker.unbindPopup();

      // after getting popupclose, the marker shows some kind of fade down animation
      // let's remove the component a bit later, to avoid UI glitches
      const removedPopup = this.lastPopup;
      setTimeout(() => {
        this.appRef.detachView(removedPopup.componentRef.hostView);
        removedPopup.componentRef.destroy();
      }, 200);

      this.lastPopup = null;
    }
  }

  destroy(): void {
    this.destroyLastPopup();
  }
}
