import { Injectable } from '@angular/core';
import { Color } from 'chart.js/auto';

const alphaForBackground = '99';

@Injectable({
  providedIn: 'root'
})
export class ColorPalleteService {
  // We can steal here: https://www.tableau.com/blog/colors-upgrade-tableau-10-56782
  // or here: https://github.com/nagix/chartjs-plugin-colorschemes/blob/master/src/colorschemes/colorschemes.tableau.js
  private _colors = [
    '#2177B1',
    '#FE802A',
    '#30A039',
    '#D52A2D',
    '#9367BA',
    '#8C564C',
    '#E278C0',
    '#7F7F7F',
    '#BCBD3B',
    '#1FBECD',
    '#4E79A5',
    '#F18F3B',
    '#E0585B',
    '#77B7B2',
    '#5AA155',
    '#EDC958',
    '#AF7AA0',
    '#FE9EA8',
    '#9C7561',
    '#BAB0AC'
  ];

  getBorderColor(index = 0): Color {
    const colorCode = this._colors[index % this._colors.length];
    return colorCode;
  }

  getBackgroundColor(index = 0): Color {
    const colorCode = this.getBorderColor(index);
    return colorCode + alphaForBackground;
  }
}
