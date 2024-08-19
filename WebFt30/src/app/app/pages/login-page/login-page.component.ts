import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  AppState,
  AuthActions,
  AuthSelectors,
  LocalStorageService,
  SettingsSelectors
} from 'src/app/core';
import { AppSettingsService } from 'src/app/core/services';

class DemoUser {
  name!: string;
  role!: string;
}

@Component({
  selector: 'rtu-login-page',
  templateUrl: 'login-page.component.html',
  styles: [
    `
      :host {
        width: 100%;
        height: 100%;
      }
    `
  ]
})
export class LoginPageComponent {
  private store: Store<AppState> = inject(Store<AppState>);
  private localStorageService: LocalStorageService = inject(LocalStorageService);

  passwordInputType: 'password' | 'text' = 'password';

  get currentYear(): number {
    return new Date().getFullYear();
  }

  public demoUsers: DemoUser[] = [
    {
      name: 'root',
      role: 'Root'
    },
    {
      name: 'mdavis',
      role: 'Operator'
    },
    {
      name: 'wjones',
      role: 'Supervisor'
    },
    {
      name: 'gmartin',
      role: 'NotificationReceiver'
    }
  ];

  // auth$ = this.store.select(AuthSelectors.selectAuth);
  errorMessageId$ = this.store.select(AuthSelectors.selectErrorMessageId);
  theme$ = this.store.select(SettingsSelectors.selectTheme);

  lastLoginUserName: string | null = null;

  form!: FormGroup;

  constructor(public appSettingsService: AppSettingsService) {
    this.form = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  get defaultPassword() {
    return `root`;
  }

  onLoginClick(demoUser: DemoUser) {
    this.lastLoginUserName = demoUser.name;

    this.store.dispatch(
      AuthActions.login({ username: demoUser.name, password: this.defaultPassword })
    );
  }

  tooglePasswordInputType() {
    this.passwordInputType = this.passwordInputType == 'text' ? 'password' : 'text';
  }

  signIn() {
    if (!this.form.valid) {
      return;
    }

    this.store.dispatch(
      AuthActions.login({
        username: this.form.controls['username'].value,
        password: this.form.controls['password'].value
      })
    );
  }
}
