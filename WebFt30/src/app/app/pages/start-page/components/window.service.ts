import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WindowService {
  showRtuState = new BehaviorSubject<string | null>(null);
  showRtuState$ = this.showRtuState.asObservable();
}
