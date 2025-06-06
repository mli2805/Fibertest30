import { ChangeDetectionStrategy, Component } from '@angular/core';

// корзина мусорная, толстые линии
@Component({
  selector: 'rtu-delete2-button',
  template: `
    <div class="cursor-pointer">
      <!-- prettier-ignore -->
      <svg t="1719644744507" class="icon h-5" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="20535">
        <path d="M713.1 914.3H309.9c-51.5 0-93.4-41.7-93.4-92.7V262.1c0-17.2 13.9-31.1 31.1-31.1h527.9c17.2 0 31.1 13.9 31.1 31.1v559.4c-0.1 51.2-41.9 92.8-93.5 92.8z m-434.4-621v528.3c0 16.9 13.9 30.5 31.1 30.5h403.3c17.2 0 31.1-13.7 31.1-30.5V293.3H278.7z m0 0" fill="currentColor" p-id="20536"></path>
        <path d="M864.3 293.3H158.6c-17.2 0-31.1-13.9-31.1-31.1s13.9-31.1 31.1-31.1h705.7c17.2 0 31.1 13.9 31.1 31.1 0.1 17-13.9 31.1-31.1 31.1z m0 0" fill="currentColor" p-id="20537"></path>
        <path d="M667.1 293.3H355.8c-9.9 0-19.2-4.7-25-12.7-5.9-8-7.6-18.2-4.7-27.6l38.8-126.2c4.1-13.1 16.1-22 29.7-22h233.5c13.7 0 25.7 8.9 29.7 22l39 126.2c2.9 9.4 1.2 19.7-4.7 27.6-5.8 8-15 12.7-25 12.7zM398 231h227l-19.7-64H417.7L398 231z m30.5 538.9c-17.2 0-31.1-13.9-31.1-31.1V406.5c0-17.2 13.9-31.1 31.1-31.1 17.2 0 31.1 13.9 31.1 31.1v332.1c-0.1 17.2-14 31.3-31.1 31.3z m166 0c-17.2 0-31.1-13.9-31.1-31.1V406.5c0-17.2 13.9-31.1 31.1-31.1 17.2 0 31.1 13.9 31.1 31.1v332.1c0.1 17.2-14 31.3-31.1 31.3z m0 0" fill="currentColor" p-id="20538"></path>
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
export class Delete2ButtonComponent {}
