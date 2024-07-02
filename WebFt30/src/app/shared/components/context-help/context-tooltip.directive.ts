import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  Renderer2,
  ViewContainerRef
} from '@angular/core';
import { EofThresholdHelpComponent } from './components/eof-threshold-help/eof-threshold-help.component';
import { TestPortHelpComponent } from './components/test-port-help/test-port-help.component';
import {
  HeaderMessageHelpComponent,
  HeaderMessageTooltip
} from './components/header-message-help/header-message-help.component';
import { BluePointComponent } from './components/blue-point/blue-point.component';

@Directive({
  selector: '[rtuContextTooltip]'
})
export class ContextTooltipDirective implements OnDestroy {
  private _rtuContextTooltip!: string | HeaderMessageTooltip;
  @Input() set rtuContextTooltip(section: string | HeaderMessageTooltip) {
    this.createOverlay(section);
    this._rtuContextTooltip = section;

    this.embedBluePoint();
  }

  overElement = false;
  overOverlay = false;

  private overlayRef!: OverlayRef;
  private portal: ComponentPortal<any> | null = null;
  constructor(
    private el: ElementRef,
    private overlay: Overlay,
    private renderer: Renderer2,
    private vr: ViewContainerRef
  ) {}

  createOverlay(section: string | HeaderMessageTooltip) {
    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(this.el)
        .withPositions([
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top'
          }
        ])
    });

    const component = this.getComponent(section);
    if (component == null) {
      return;
    }

    this.portal = new ComponentPortal(component!);

    this.overlayRef.hostElement.addEventListener('mouseover', this.mouseOverOverlay);
    this.overlayRef.hostElement.addEventListener('mouseleave', this.mouseLeaveOverlay);
  }

  mouseOverOverlay = () => {
    this.overOverlay = true;
  };

  mouseLeaveOverlay = () => {
    this.overOverlay = false;
    setTimeout(this.detachOverlay, 100);
  };

  @HostListener('mouseover')
  mouseover() {
    this.overElement = true;
    if (this.portal != null && !this.overlayRef.hasAttached()) {
      const component = this.overlayRef.attach(this.portal);
      if (component.instance instanceof HeaderMessageHelpComponent) {
        component.instance.header = (<HeaderMessageTooltip>this._rtuContextTooltip).header;
        component.instance.message = (<HeaderMessageTooltip>this._rtuContextTooltip).message;
      }
    }
  }

  @HostListener('mouseleave')
  mouseleave() {
    this.overElement = false;
    setTimeout(this.detachOverlay, 100);
  }

  detachOverlay = () => {
    if (!this.overElement && !this.overOverlay) {
      this.overlayRef.detach();
    }
  };

  getComponent(section: string | HeaderMessageTooltip) {
    if (typeof section === 'string') {
      return this.getComponentBySection(section);
    } else {
      return HeaderMessageHelpComponent;
    }
  }

  getComponentBySection(section: string) {
    switch (section) {
      case 'TestPortHelpComponent':
        return TestPortHelpComponent;
      case 'EofThresholdHelpComponent':
        return EofThresholdHelpComponent;
      default:
        return null;
    }
  }

  private embedBluePoint() {
    const firstChild = this.el.nativeElement.firstChild;
    this.vr.clear();
    const ref = this.vr.createComponent(BluePointComponent);

    this.renderer.insertBefore(this.el.nativeElement, ref.location.nativeElement, firstChild);

    // this.renderer.appendChild(this.elementRef.nativeElement, this.ref.location.nativeElement);
  }

  ngOnDestroy(): void {
    this.overlayRef.detach();
  }
}
