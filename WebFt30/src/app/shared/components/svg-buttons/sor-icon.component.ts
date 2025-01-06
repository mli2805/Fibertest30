import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'rtu-sor-icon',
  styles: [':host { display: inline-block; }'],
  template: ` <!-- prettier-ignore -->
    <svg x="0px" y="0px" viewBox="0 0 40 40" enable-background="new 0 0 40 40">
              <path fill="currentColor" d="M40,32.292l-5.256-4.645c-0.266-0.232-0.617-0.34-0.969-0.287c-0.35,0.051-0.658,0.254-0.846,0.555
                    l-2.889,4.656L27.84,3.584c-0.045-0.601-0.529-1.075-1.131-1.107c-0.6-0.02-1.133,0.385-1.244,0.978l-3.764,20.103L0,22.432v2.402
                    l22.625,1.174c0.609,0.037,1.133-0.385,1.242-0.977l2.273-12.142l1.785,23.527c0.039,0.518,0.408,0.951,0.912,1.074
                    c0.502,0.123,1.029-0.092,1.305-0.531l4.078-6.572L40,35.495V32.292z"/>
              <g>
                <rect x="4.5" y="6.5" fill="currentColor" width="1" height="7"/>
                <rect x="4.5" y="0" fill="currentColor" width="1" height="3.5"/>
                <rect x="4.5" y="36.5" fill="currentColor" width="1" height="3.5"/>
                <rect x="4.5" y="16.5" fill="currentColor" width="1" height="7"/>
                <rect x="4.5" y="26.5" fill="currentColor" width="1" height="7"/>
              </g>
              <g>
                <rect x="19.5" y="6.5" fill="currentColor" width="1" height="7"/>
                <rect x="19.5" y="0" fill="currentColor" width="1" height="3.5"/>
                <rect x="19.5" y="36.5" fill="currentColor" width="1" height="3.5"/>
                <rect x="19.5" y="16.5" fill="currentColor" width="1" height="7"/>
                <rect x="19.5" y="26.5" fill="currentColor" width="1" height="7"/>
              </g>
              <g>
                <rect x="34.5" y="6.5" fill="currentColor" width="1" height="7"/>
                <rect x="34.5" y="0" fill="currentColor" width="1" height="3.5"/>
                <rect x="34.5" y="36.5" fill="currentColor" width="1" height="3.5"/>
                <rect x="34.5" y="16.5" fill="currentColor" width="1" height="7"/>
                <rect x="34.5" y="26.5" fill="currentColor" width="1" height="7"/>
              </g>
            </svg>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SorIconComponent {}
