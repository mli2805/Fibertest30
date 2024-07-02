import { Injectable } from '@angular/core';
import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';

export interface OnAttach {
  onAttach(): void;
}

@Injectable()
export class AppRouteReuseStrategy implements RouteReuseStrategy {
  private handlers = new Map<string, DetachedRouteHandle | null>();

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return !!route.data['reuseRouteId'];
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
    if (route.data['reuseRouteId']) {
      this.handlers.set(route.data['reuseRouteId'], handle);
    }
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return !!route.data['reuseRouteId'] && this.handlers.has(route.data['reuseRouteId']);
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    if (!route.data['reuseRouteId']) {
      return null;
    }

    const handle = this.handlers.get(route.data['reuseRouteId']) || null;
    const instance = (<any>handle)?.componentRef?.instance as OnAttach;
    if (handle && instance?.onAttach) {
      setTimeout(() => instance.onAttach(), 0);
    }
    return handle;
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }
}
