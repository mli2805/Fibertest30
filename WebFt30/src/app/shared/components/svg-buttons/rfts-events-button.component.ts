import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'rtu-rfts-events-button',
  template: `
    <div class="cursor-pointer">
      <!-- prettier-ignore -->
      <svg version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
	       viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve">
<polygon fill="none" stroke="currentColor" stroke-width="2" stroke-miterlimit="10" points="1,17 1,57 21,37 "/>
<g>
	<g>
		<polyline fill="none" stroke="currentColor" stroke-width="2" stroke-miterlimit="10" points="61.586,55.586 63,57 63,55 		"/>
		
			<line fill="none" stroke="currentColor" stroke-width="2" stroke-miterlimit="10" stroke-dasharray="4,2" x1="63" y1="53" x2="63" y2="20"/>
		<polyline fill="none" stroke="currentColor" stroke-width="2" stroke-miterlimit="10" points="63,19 63,17 61.586,18.414 		"/>
		
			<line fill="none" stroke="currentColor" stroke-width="2" stroke-miterlimit="10" stroke-dasharray="3.736,1.868" x1="60.265" y1="19.735" x2="45.075" y2="34.925"/>
		<polyline fill="none" stroke="currentColor" stroke-width="2" stroke-miterlimit="10" points="44.414,35.586 43,37 44.414,38.414 		"/>
		
			<line fill="none" stroke="currentColor" stroke-width="2" stroke-miterlimit="10" stroke-dasharray="3.736,1.868" x1="45.735" y1="39.735" x2="60.925" y2="54.925"/>
	</g>
</g>
<g>
	<g>
		<line fill="none" stroke="currentColor" stroke-width="2" stroke-miterlimit="10" x1="32" y1="61" x2="32" y2="59"/>
		
			<line fill="none" stroke="currentColor" stroke-width="2" stroke-miterlimit="10" stroke-dasharray="4,2" x1="32" y1="57" x2="32" y2="16"/>
		<line fill="none" stroke="currentColor" stroke-width="2" stroke-miterlimit="10" x1="32" y1="15" x2="32" y2="13"/>
	</g>
</g>
<polyline fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="bevel" stroke-miterlimit="10" points="46,13 57,13 57,2 
	"/>
<path fill="none" stroke="currentColor" stroke-width="2" stroke-miterlimit="10" d="M57,13C51.378,5.132,42.408,1,32,1
	C21.591,1,12.622,5.13,7,13"/>
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
export class RftsEventsButtonComponent {}
