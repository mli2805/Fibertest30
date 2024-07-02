import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { Input, HostListener, ElementRef, EventEmitter, Output, Directive } from '@angular/core';

@Directive()
export class OverlayBase {
  @Input() overlayOrigin: CdkOverlayOrigin = null!;
  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();

  constructor(protected elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const clickedInsideComponent = this.elementRef.nativeElement.contains(event.target);
    const clickedInsideOverlayOrigin = this.overlayOrigin.elementRef.nativeElement.contains(
      event.target
    );

    if (!clickedInsideComponent && !clickedInsideOverlayOrigin) {
      if (this.open === true) {
        this.openChange.emit(false);
      }
    }
  }

  suppressClick(event: MouseEvent): void {
    event.stopPropagation();
  }
}
