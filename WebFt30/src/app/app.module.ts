import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app/app.component';
import { CoreModule } from './core/core.module';
import { DemoLoginComponent } from './core/auth/components/demo-login/demo-login.component';
import { SharedModule } from './shared/shared.module';
import { TestStandComponent } from './app/test-stand/test-stand.component';
import { AppRouteReuseStrategy } from './app-route-reuse-strategy';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AppComponent, DemoLoginComponent, TestStandComponent],
  imports: [BrowserModule, CoreModule, AppRoutingModule, SharedModule, BrowserAnimationsModule],
  providers: [{ provide: RouteReuseStrategy, useClass: AppRouteReuseStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule {}
