import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { MessageBoxComponent } from './message-box.component';
import { firstValueFrom } from 'rxjs';
import { MessageLine } from './message-line';

export class MessageBoxUtils {
  public static async show(
    dialog: Dialog,
    type: 'Error' | 'Information' | 'Confirmation',
    lines: MessageLine[]
  ): Promise<boolean> {
    const subscription: DialogRef<boolean, MessageBoxComponent> = dialog.open(MessageBoxComponent, {
      maxHeight: '95vh',
      maxWidth: '95vw',
      disableClose: true,
      data: { type, lines }
    });

    return (await firstValueFrom(subscription.closed)) || false;
  }
}
