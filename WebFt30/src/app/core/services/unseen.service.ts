import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UnseenService {
  public opEvents: number[] = [];

  public removeOpEventIfExists(eventId: number) {
    const index = this.opEvents.indexOf(eventId);
    if (index > -1) {
      this.opEvents.splice(index, 1);
    }
  }
}
