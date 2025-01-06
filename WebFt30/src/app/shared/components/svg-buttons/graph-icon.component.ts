import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'rtu-graph-icon',
  styles: [':host { display: inline-block; }'],
  template: ` <!-- prettier-ignore -->
    <svg x="0px" y="0px" viewBox="0 0 40 40" enable-background="new 0 0 40 40">
              <path fill="currentColor" d="M19,33V7c0-2.757-2.243-5-5-5h-4C7.244,2,5,4.244,5,7v18H3V7c0-3.859,3.14-7,7-7h4c3.86,0,7,3.141,7,7v26
                    c0,2.758,2.242,5,5,5h4c2.756,0,5-2.242,5-5V17h2v16c0,3.859-3.141,7-7,7h-4C22.139,40,19,36.86,19,33z"/>
              <circle fill="currentColor" cx="4" cy="24.854" r="4"/>
              <circle fill="currentColor" cx="36" cy="17.104" r="4"/>
            </svg>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GraphIconComponent {}
