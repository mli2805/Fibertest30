import { Directive, HostBinding } from '@angular/core';

@Directive()
export class AvailableActionBase {
  @HostBinding('class')
  protected readonly classes = 'available-action action-non-active';
}
