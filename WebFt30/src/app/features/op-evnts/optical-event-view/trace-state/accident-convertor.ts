import { AccidentLine, AccidentOnTraceV2 } from 'src/app/core/store/models/ft30/optical-event';
import {
  AccidentPlace,
  FiberState,
  OpticalAccidentType
} from 'src/app/core/store/models/ft30/ft-enums';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AccidentConvertor {
  leftArrow = '<-';

  toAccidentLine(accident: AccidentOnTraceV2, lineNumber: number): AccidentLine {
    if (accident.opticalTypeOfAccident === OpticalAccidentType.TotalLoss)
      return this.createBadLine(accident, lineNumber);

    if (accident.isAccidentInOldEvent) {
      return accident.opticalTypeOfAccident === OpticalAccidentType.LossCoef
        ? this.createBadSegment(accident, lineNumber)
        : this.createInNode(accident, lineNumber);
    }

    return this.createBetweenNodes(accident, lineNumber);
  }

  private createInNode(accidentInOldEvent: AccidentOnTraceV2, lineNumber: number): AccidentLine {
    const line = new AccidentLine();

    line.numberOfAccident = lineNumber;
    line.accidentSeriousness = accidentInOldEvent.accidentSeriousness;
    line.accidentTypeLetter = this.toLetter(accidentInOldEvent.opticalTypeOfAccident);
    line.accidentPlace = AccidentPlace.InNode;
    line.accidentTypeWords = 'i18n.ft.in-the-node';

    line.topCenter = accidentInOldEvent.accidentTitle;
    line.topLeft = `RTU ${
      this.leftArrow
    } ${accidentInOldEvent.accidentToRtuOpticalDistanceKm.toFixed(3)} `;

    line.scheme =
      accidentInOldEvent.accidentSeriousness === FiberState.FiberBreak
        ? 'fiber-broken-in-node'
        : 'accident-in-node';
    line.position = accidentInOldEvent.accidentCoors;

    return line;
  }

  private createBetweenNodes(
    accidentAsNewEvent: AccidentOnTraceV2,
    lineNumber: number
  ): AccidentLine {
    const line = new AccidentLine();

    line.numberOfAccident = lineNumber;
    line.accidentSeriousness = accidentAsNewEvent.accidentSeriousness;
    line.accidentTypeLetter = this.toLetter(accidentAsNewEvent.opticalTypeOfAccident);
    line.accidentPlace = AccidentPlace.BetweenNodes;
    line.accidentTypeWords = 'i18n.ft.between-nodes';

    line.topLeft = accidentAsNewEvent.left.title;
    line.topCenter = `RTU ${
      this.leftArrow
    } ${accidentAsNewEvent.left.toRtuOpticalDistanceKm.toFixed(3)} `;
    line.topRight = accidentAsNewEvent.right.title;

    line.bottom1 = `${accidentAsNewEvent.accidentToLeftOpticalDistanceKm.toFixed(3)} `;
    line.bottom3 = `${accidentAsNewEvent.accidentToRightOpticalDistanceKm.toFixed(3)} `;

    line.scheme =
      accidentAsNewEvent.accidentSeriousness === FiberState.FiberBreak
        ? 'fiber-broken-between-nodes'
        : 'accident-between-nodes';
    line.position = accidentAsNewEvent.accidentCoors;
    return line;
  }

  private createBadSegment(
    accidentInOldEvent: AccidentOnTraceV2,
    lineNumber: number
  ): AccidentLine {
    const line = new AccidentLine();

    line.numberOfAccident = lineNumber;
    line.accidentSeriousness = accidentInOldEvent.accidentSeriousness;
    line.accidentTypeLetter = this.toLetter(accidentInOldEvent.opticalTypeOfAccident);
    line.accidentPlace = AccidentPlace.BadSegment;
    line.accidentTypeWords = 'i18n.ft.between-nodes';

    line.topLeft = accidentInOldEvent.left.title;
    line.topRight = accidentInOldEvent.right.title;
    line.bottom0 = `RTU ${this.leftArrow} ${accidentInOldEvent.left.toRtuOpticalDistanceKm.toFixed(
      3
    )} `;
    line.bottom4 = `RTU ${this.leftArrow} ${accidentInOldEvent.right.toRtuOpticalDistanceKm.toFixed(
      3
    )} `;

    line.scheme = 'bad-segment';
    // line.position = accidentInOldEvent.left.coors;

    return line;
  }

  private createBadLine(accidentInOldEvent: AccidentOnTraceV2, lineNumber: number): AccidentLine {
    const line = new AccidentLine();

    line.numberOfAccident = lineNumber;
    line.accidentSeriousness = accidentInOldEvent.accidentSeriousness;
    line.accidentTypeLetter = this.toLetter(accidentInOldEvent.opticalTypeOfAccident);
    line.accidentPlace = AccidentPlace.BadSegment;
    line.accidentTypeWords = 'i18n.ft.exceeded-total-fiber-loss';

    line.topLeft = accidentInOldEvent.left.title;
    line.topRight = accidentInOldEvent.right.title;

    line.scheme = 'bad-segment';
    return line;
  }

  // prettier-ignore
  private toLetter(type: OpticalAccidentType): string {
    switch(type){
        case OpticalAccidentType.Break: return "B";
        case OpticalAccidentType.Reflectace: return "R";
        case OpticalAccidentType.Loss: return "L";
        case OpticalAccidentType.LossCoef: return "C";
        case OpticalAccidentType.TotalLoss: return " ";
        default: return "N";
    }
  }
}
