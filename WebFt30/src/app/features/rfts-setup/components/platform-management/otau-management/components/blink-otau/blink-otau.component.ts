import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit
} from '@angular/core';
import {
  firstValueFrom,
  tap,
  switchMap,
  timer,
  take,
  Observable,
  of,
  delay,
  catchError
} from 'rxjs';
import { CoreService } from 'src/app/core/grpc/services/core.service';

@Component({
  selector: 'rtu-blink-otau',
  templateUrl: 'blink-otau.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlinkOtauComponent {
  // The blink time must be syncronized with the blink time in the real OTAU (and the Emulater)
  private BlinkTimeMs = 15000;

  @Input() otauId!: number;

  started = false;
  blinking = false;

  constructor(private coreService: CoreService, private cdr: ChangeDetectorRef) {}

  async blinkOtau() {
    if (this.started == true) {
      return;
    }

    this.started = true;
    this.blinking = false;

    this.coreService
      .blinkOtau(this.otauId)
      .pipe(
        switchMap(({ success }) => {
          if (success) {
            this.blinking = true;
            this.cdr.detectChanges();
            return of(null).pipe(delay(this.BlinkTimeMs));
          } else {
            return of(null);
          }
        }),
        catchError((error) => {
          // do nothing, just catch it
          return of(null);
        })
      )
      .subscribe(() => {
        this.blinking = false;
        this.started = false;
        this.cdr.detectChanges();
      });
  }
}
