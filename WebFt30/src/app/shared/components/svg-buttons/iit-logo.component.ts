import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'rtu-iit-logo',
  template: `
    <div class="cursor-pointer ">
      <!-- prettier-ignore -->
      <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="20mm" height="12mm" version="1.1" style="shape-rendering:geometricPrecision; 
      text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd" viewBox="0 0 1200 800"
      [attr.fill]="fillColor">
 <defs>
  <style type="text/css">
   <![CDATA[
    .fil0 {fill:black}
   ]]>
  </style>
 </defs>
 <g id="Layer_x0020_1">
  <metadata id="CorelCorpID_0Corel-Layer"/>
  <g id="_2151793521920">
   <path class="fil0" d="M89 0l969 0 -486 800 -483 -800zm67 44l416 688 418 -688 -834 0z"/>
   <polygon class="fil0" points="658,408 622,408 650,358 769,358 737,408 701,408 593,599 550,599 "/>
   <polygon class="fil0" points="475,311 555,172 579,172 610,120 515,120 484,172 511,172 431,311 404,311 374,361 471,361 500,311 "/>
   <polygon class="fil0" points="551,422 631,283 656,283 687,231 592,231 561,283 588,283 508,422 480,422 451,472 547,472 576,422 "/>
   <polygon class="fil0" points="633,164 883,164 903,131 654,131 "/>
   <polygon class="fil0" points="718,245 696,279 816,279 836,245 "/>
   <polygon class="fil0" points="243,317 0,317 14,351 263,351 "/>
   <polygon class="fil0" points="63,472 331,472 312,439 49,439 "/>
   <polygon class="fil0" points="101,564 115,597 402,597 383,564 "/>
   <polygon class="fil0" points="1200,134 1038,134 1015,168 1186,168 "/>
   <polygon class="fil0" points="1155,246 965,246 943,280 1142,280 "/>
   <polygon class="fil0" points="1107,369 885,369 863,403 1093,403 "/>
  </g>
 </g>
</svg>
    </div>
  `,
  styles: [
    `
      :host {
        display: inline-block;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IitLogoComponent {
  @Input() fillColor!: string;
}
