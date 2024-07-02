import { TestBed } from '@angular/core/testing';
import { AppModule } from './app.module';

// Add this file to avoid code coverage being too optimistic
// https://medium.com/angular-in-depth/the-angular-devops-series-ct-and-code-coverage-with-teamcity-21e3d0ed77eb

describe('AppModule', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule]
    }).compileComponents();
  });

  it('should create the app module', () => {
    const appModule = TestBed.inject(AppModule);
    expect(appModule).toBeTruthy();
  });
});
