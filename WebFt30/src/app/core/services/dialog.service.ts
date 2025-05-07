import { Injectable } from '@angular/core';
import { IDialogService } from '@veex/common';

@Injectable({ providedIn: 'root' })
export class DialogService implements IDialogService {

  askYesNo(message: string): Promise<boolean> {
    const result = confirm(message);
    return Promise.resolve(result);
  }

  async showFilterDialog(
    data: { key: string; isSelected: boolean }[]
  ): Promise<{ key: string; isSelected: boolean }[]> {
    throw new Error('Method not implemented.'); // this is for optical tester viewer, not used by VeSion
  }
}
