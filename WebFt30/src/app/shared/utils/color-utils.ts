import { FiberState } from 'src/app/core/store/models/ft30/ft-enums';

export class ColorUtils {
  static fiberStateToTextColor(state: FiberState): string {
    switch (state) {
      case FiberState.Ok:
        return 'text-black';
      case FiberState.Suspicion:
        return 'text-yellow-500';
      case FiberState.Minor:
        return 'text-[#8080c0]';
      case FiberState.Major:
        return 'text-[#ff69b4]';
      case FiberState.Critical:
      case FiberState.FiberBreak:
      case FiberState.NoFiber:
        return 'text-red-500';
      case FiberState.User:
        return 'text-[#008000]';
    }
    return 'text-black';
  }
}
