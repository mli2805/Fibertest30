import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { EMPTY, Observable } from 'rxjs';
import { AppState, OpticalEventsSelectors } from 'src/app/core';
import { UnseenService } from 'src/app/core/services/unseen.service';
import { OpticalEvent } from 'src/app/core/store/models/ft30/optical-event';

@Component({
  selector: 'rtu-optical-event-view',
  templateUrl: './optical-event-view.component.html',
  styleUrls: ['./optical-event-view.component.scss']
})
export class OpticalEventViewComponent implements OnInit {
  public opticalEvent$: Observable<OpticalEvent | null> = EMPTY;
  opticalEventId!: number;

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private unseenService: UnseenService
  ) {}

  ngOnInit(): void {
    this.opticalEventId = +this.route.snapshot.paramMap.get('id')!;
    this.opticalEvent$ = this.store.select(
      OpticalEventsSelectors.selectOpticalEventById(this.opticalEventId)
    );

    this.unseenService.removeOpEventIfExists(this.opticalEventId);
  }
}
