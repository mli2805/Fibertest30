import { NgModule } from '@angular/core';

import { GisComponent } from './gis/gis.component';
import { GisRoutingModule } from './gis-routing';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [GisRoutingModule, SharedModule],
  exports: [],
  declarations: [GisComponent],
  providers: []
})
export class GisModule {}
