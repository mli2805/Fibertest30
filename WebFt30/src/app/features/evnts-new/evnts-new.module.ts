import { SharedModule } from 'src/app/shared/shared.module';
import { EvntsNewComponent } from './evnts-new/evnts-new.component';
import { NgModule } from '@angular/core';
import { NewEventsTableComponent } from './new-events-table/new-events-table.component';
import { EvntsNewRoutingModule } from './evnts-new-routing';

@NgModule({
  imports: [EvntsNewRoutingModule, SharedModule],
  exports: [],
  declarations: [EvntsNewComponent, NewEventsTableComponent],
  providers: []
})
export class EvntsNewModule {}
