import { DialogRef } from '@angular/cdk/dialog';
import { Component } from '@angular/core';

@Component({
    selector: 'rtu-test-stand',
    templateUrl: 'test-stand.component.html',
    styles: [
        `
      :host {
        width: 100%;
        height: 100%;
      }
    `
    ],
    providers: [
        {
            provide: DialogRef,
            useValue: {
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                close: (dialogResult: any) => {
                    console.log('dialog close clicked. result= ' + dialogResult);
                },
                disableClose: false
            }
        }
    ],
    standalone: false
})
export class TestStandComponent {}
