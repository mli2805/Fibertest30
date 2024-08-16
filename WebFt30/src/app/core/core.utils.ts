import { Action, ActionCreator, Creator, MemoizedSelector, Store } from '@ngrx/store';
import { first, firstValueFrom, take, race, Observable } from 'rxjs';
import { AppState } from './core.state';
import { Actions, ofType } from '@ngrx/effects';
import { SystemEventSource } from './store/models';
import { UsersSelectors } from './store/users/users.selectors';
import { ServerError } from './models/server-error';
import { GrpcUtils } from './grpc/grpc.utils';

export class CoreUtils {
  public static getCurrentState<State, Result, ProjectorFn>(
    store: Store<State>,
    selector: MemoizedSelector<State, Result, ProjectorFn>
  ): Result {
    let value: Result;
    store
      .select(selector)
      .pipe(first())
      .subscribe((x) => (value = x));
    return value!;
  }

  public static errorToMessage(error: any): string {
    if (error.rejection && error.rejection instanceof Error) {
      // This is an unhandled Promise rejection. The actual Error is stored in the `rejection` property.
      return error.rejection.message;
    } else if (error instanceof Error) {
      // This is a standard JavaScript Error.
      return error.message;
    } else if (typeof error.message === 'string') {
      // This error has a `message` property, so we'll use that.
      return error.message;
    } else {
      // We don't know how to extract the message from this error, so we'll convert it to a string as a fallback.
      return error.toString();
    }
  }

  public static dispatchAndWaitObservable<T extends string, S extends Creator, F extends Creator>(
    store: Store<AppState>,
    actions$: Actions,
    action: Action,
    successAction: ActionCreator<T, S>,
    failureAction: ActionCreator<T, F>
  ): Observable<ReturnType<ActionCreator<T, S>> | ReturnType<ActionCreator<T, F>>> {
    store.dispatch(action);
    const success = actions$.pipe(ofType(successAction));
    const failure = actions$.pipe(ofType(failureAction));
    return race(success, failure).pipe(take(1));
  }

  public static async dispatchAndWaitPromise<
    T extends string,
    S extends Creator,
    F extends Creator
  >(
    store: Store<AppState>,
    actions$: Actions,
    action: Action,
    successAction: ActionCreator<T, S>,
    failureAction: ActionCreator<T, F>
  ) {
    const observable = this.dispatchAndWaitObservable(
      store,
      actions$,
      action,
      successAction,
      failureAction
    );
    const dispatchedAction = await firstValueFrom(observable);
    return dispatchedAction;
  }

  public static getSystemEventSource(store: Store<AppState>, source: SystemEventSource) {
    if (source.userId) {
      const user = CoreUtils.getCurrentState(store, UsersSelectors.selectUserById(source.userId));
      return user?.fullName;
    }
    return source.source;
  }

  public static getErrorMessageId(error: ServerError | string): string | null {
    if (typeof error === 'string') {
      // assume the error is messageId
      return <string>error;
    }

    if (error instanceof ServerError) {
      const commonError = GrpcUtils.getCommonServerErrorMessageId(error);
      if (commonError) {
        return commonError;
      }
    }

    return null;
  }

  public static commonErrorToMessageId(
    error: ServerError | string | null,
    defaultErrorMessageId: string
  ): string | null {
    if (error === null) {
      return null;
    }

    const otauError = CoreUtils.otauFailReasonToMessageId(error);
    if (otauError !== null) {
      return otauError;
    }

    const serverError = CoreUtils.serverErrorToMessageId(error);
    if (serverError !== null) {
      return serverError;
    }

    return defaultErrorMessageId;
  }

  public static otauFailReasonToMessageId(failReason: any): string | null {
    switch (failReason) {
      case 'OtauIsNotConnected':
        return 'i18n.otau.error.otau-is-not-connected';
      case 'OtauPortMaintenance':
        return 'i18n.otau.error.otau-port-maintenance';
      case 'OtauPortUnavailable':
        return 'i18n.otau.error.otau-port-unavailable';
      case 'OtauSetPortFailed':
        return 'i18n.otau.error.otau-set-port-failed';
    }

    return null;
  }

  public static serverErrorToMessageId(error: ServerError | string | null): string | null {
    if (error instanceof ServerError) {
      if (error.code == 'INVALID_ARGUMENT') {
        return 'i18n.common.grpc.error.invalid-arguments';
      }

      if (error.message === 'OnDemandAlreadyStarted') {
        return 'i18n.error.on-demand.already-started';
      }

      if (error.message === 'BaselineAlreadyStarted') {
        return 'i18n.error.baseline-already-started';
      }

      if (error.message === 'FailedToConnectEmailServer') {
        return 'i18n.error.failed-connect-email-server';
      }

      if (error.message === 'UnauthorizedAccess') {
        return 'i18n.error.unauthorized-access';
      }

      if (error.message === 'FailedToSendEmail') {
        return 'i18n.error.failed-send-email-server';
      }

      if (error.message === 'FailedToVerifySmtpServerCertificate') {
        return 'i18n.error.failed-verify-email-server-certificate';
      }

      if (error.message === 'FailedToConnectRtu') {
        return 'i18n.error.failed-to-connect-rtu';
      }
      if (error.message === 'RtuIsBusy') {
        return 'i18n.error.rtu-is-busy';
      }
      if (error.message === 'NoSuchRtu') {
        return 'i18n.error.no-such-rtu';
      }
    }

    return null;
  }
}
