import {
  Component,
  OnInit,
  Inject,
  ChangeDetectorRef,
  OnDestroy,
  inject,
} from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ScreenState } from '@core/state/screen/ScreenState';
import { TagsService } from '@core/service/tags.service';
import { UserService } from '@core/service/user.service';
import { ScreenService } from '@core/service/screen.service';
import { CORE_CONFIG, USER } from '@core/token/token-providers';
import type { ICoreConfig } from '@core/interface/IAppConfig';
import type { IUser } from '@core/interface/IUser';
import { Observable, Subject, Subscription, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  host: { ngSkipHydration: 'true' },
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  hide = true;
  loading: boolean;
  error: string;
  userForm: UntypedFormGroup;
  phoneForm: UntypedFormGroup;
  public countdown: number;
  private subscription: Subscription;
  destroy$: Subject<boolean> = new Subject<boolean>();

  fb = inject(UntypedFormBuilder);
  router = inject(Router);
  route = inject(ActivatedRoute);
  screenState = inject(ScreenState);
  tagsService = inject(TagsService);
  userService = inject(UserService);
  screenService = inject(ScreenService);
  cd = inject(ChangeDetectorRef);
  constructor(
    @Inject(CORE_CONFIG) public coreConfig: ICoreConfig,
    @Inject(USER) public user$: Observable<IUser>,
  ) {
    if (this.screenService.isPlatformBrowser()) {
      this.userService.userSub$
        .pipe(takeUntil(this.destroy$))
        .subscribe((currentUser: any) => {
          // login
          if (currentUser) {
            setTimeout(() => {
              const returnUrl =
                this.route.snapshot.queryParams.returnUrl ||
                this.coreConfig.login.loginRedirect;
              this.router.navigate([returnUrl]);
            }, 2000);
          }
        });
    }
  }

  ngOnInit(): void {
    this.tagsService.setTitle('欢迎登录！');
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      pass: ['', Validators.required],
    });

    this.phoneForm = this.fb.group({
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern('1(3|4|5|7|8)\\d{9}'),
          Validators.minLength(11),
          Validators.maxLength(11),
        ],
      ],
      code: ['', Validators.required],
    });
  }

  get f(): any {
    return this.userForm.controls;
  }

  get formPhone(): any {
    return this.phoneForm.controls;
  }

  login(): void {
    if (this.userForm.invalid) {
      return;
    }
    this.loading = true;
    this.userService
      .login(this.userForm.value.name, this.userForm.value.pass)
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        this.onLogin(state, '登录出现问题，请联系管理员！');
      });
  }

  loginByPhone(): void {
    this.loading = true;
    this.userService
      .loginByPhone(this.phoneForm.value.phone, this.phoneForm.value.code)
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        this.onLogin(state, '请检查手机号或者验证码！');
      });
  }

  onLogin(state: any, errorMessage: string): void {
    if (state) {
      this.loading = false;
      this.cd.detectChanges();
    }
    if (!state) {
      this.loading = false;
      this.error = errorMessage;
      this.cd.detectChanges();
    }
  }

  getCode(event: any): any {
    event.preventDefault();
    if (!this.phoneForm.value.phone) {
      this.error = '请输入手机号码';
      this.cd.detectChanges();
      return false;
    }
    this.userService
      .getCode(this.phoneForm.value.phone)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const { leftTime } = this.coreConfig.login.phoneLogin;
        this.countdown = leftTime;
        const source = interval(1000);
        this.subscription = source.subscribe((val) => {
          if (this.countdown > 0) {
            this.countdown--;
          } else {
            this.subscription.unsubscribe();
          }
        });
        this.cd.detectChanges();
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
