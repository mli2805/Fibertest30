import { Component, ElementRef, Input, OnInit } from '@angular/core';

@Component({
    selector: 'rtu-router-link',
    template: `
    <a
      [routerLink]="routerLink"
      routerLinkActive="text-blue-700 dark:text-blue-500"
      class="font-medium hover:text-blue-700 dark:hover:text-blue-500"
    >
      <ng-content></ng-content>
    </a>
  `,
    standalone: false
})
export class RtuRouterLinkComponent implements OnInit {
  @Input() routerLink: any[] | string = [];

  constructor(private el: ElementRef) {}

  ngOnInit() {
    // Set the tabindex of the custom component to -1
    this.el.nativeElement.setAttribute('tabindex', '-1');
  }
}
