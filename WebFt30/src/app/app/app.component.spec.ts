import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { AppComponent } from './app.component';
import { DemoLoginComponent } from '../core/auth/components/demo-login/demo-login.component';
import { SharedModule } from '../shared/shared.module';
import { CoreModule } from '../core/core.module';
import { TestStandComponent } from './test-stand/test-stand.component';
import { TestUtils } from '../test/test.utils';

describe('AppComponent', () => {
  // let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, SharedModule, CoreModule],
      providers: [provideMockStore({ initialState: TestUtils.InitialAppState })],
      declarations: [AppComponent, DemoLoginComponent, TestStandComponent]
    }).compileComponents();

    // store = TestBed.inject(MockStore);
    // store.overrideSelector(selectIsAuthenticated, false);
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
