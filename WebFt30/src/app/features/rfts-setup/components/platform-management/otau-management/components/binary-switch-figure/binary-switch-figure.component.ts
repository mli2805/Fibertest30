import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

interface Dip {
  position: number;
  isOn: boolean;
}

@Component({
  selector: 'rtu-binary-switch-figure',
  templateUrl: './binary-switch-figure.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BinarySwitchFigureComponent {
  _port!: number;
  @Input()
  set port(value: number) {
    if (value === null) return;
    this._port = value;
    this.dips = value
      .toString(2)
      .padStart(8, '0')
      .split('')
      .reverse()
      .map((bit, index) => {
        return {
          position: index + 1,
          isOn: bit === '1'
        };
      });
  }

  get port() {
    return this._port;
  }

  dips: Dip[] = [];
}
