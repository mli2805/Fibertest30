import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { SharedModule } from '../../shared/shared.module';
import { EmulatorComponent } from './emulator/emulator.component';
import { EmulatorRoutingModule } from './emulator-routing.module';
import { OtauEmulatorComponent } from './otau-emulator/otau-emulator.component';
import { EmulatorPortChangesComponent } from './port-changes/emulator-port-changes.component';

@NgModule({
  imports: [SharedModule, EmulatorRoutingModule, HttpClientModule],
  exports: [],
  declarations: [EmulatorComponent, OtauEmulatorComponent, EmulatorPortChangesComponent],
  providers: []
})
export class EmulatorModule {}
