import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'rtu-reporting',
    templateUrl: './reporting.component.html',
    styles: [':host { overflow-y: auto; display: flex; width: 100%; height: 100%; }'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ReportingComponent {}
