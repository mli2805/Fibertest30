import { Component, ElementRef, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { GisMapService } from '../../gis-map.service';
import { TraceDefineUtils } from './trace-define-utils';
import { GisMapUtils } from '../../components/shared/gis-map.utils';
import { Neighbour, StepModel } from './step-model';
import { RadioButton } from 'src/app/shared/components/svg-buttons/radio-button/radio-button';
import { Dialog } from '@angular/cdk/dialog';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MapLayersActions } from '../../components/gis-actions/map-layers-actions';
import { MessageBoxUtils } from 'src/app/shared/components/message-box/message-box-utils';
import { FiberState } from 'src/app/core/store/models/ft30/ft-enums';
import { TraceEquipmentUtil } from '../trace-equipment-selector/trace-equipment-util';
import { WindowService } from 'src/app/app/pages/start-page/components/window.service';
import { NextStepSelectorComponent } from '../next-step-selector/next-step-selector.component';
import { AcceptTraceDialogComponent } from '../trace-info-dialog/accept-trace-dialog/accept-trace-dialog.component';
import { GeoTrace } from 'src/app/core/store/models/ft30/geo-data';

@Component({
    selector: 'rtu-trace-define',
    templateUrl: './trace-define.component.html',
    standalone: false
})
export class TraceDefineComponent implements OnInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  @Input() rtuId!: string;
  @Input() zIndex!: number;

  stepList$ = this.gisMapService.stepList.asObservable();
  spinning = new BehaviorSubject<boolean>(false);
  spinning$ = this.spinning.asObservable();

  sSteps!: StepModel[];

  constructor(
    private injector: Injector,
    public gisMapService: GisMapService,
    private windowService: WindowService,
    private ts: TranslateService,
    private dialog: Dialog
  ) {
    TraceDefineUtils.initialize(injector);
    TraceEquipmentUtil.initialize(injector);
    this.sSteps = gisMapService.steps;
  }

  ngOnInit() {
    this.stepList$.subscribe(() => {
      this.scrollToBottom();
    });
  }

  scrollToBottom() {
    setTimeout(() => {
      const element = this.scrollContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    });
  }

  async onSemiautomaticMode() {
    let isButtonPressed = true;
    while (await this.makeStepForward(isButtonPressed)) {
      isButtonPressed = false;
    }
  }

  onStepForward() {
    this.makeStepForward(true);
  }

  private async makeStepForward(isButtonPressed: boolean): Promise<boolean> {
    const lastId = this.gisMapService.steps.at(-1)!.nodeId;
    const previousNodeId =
      this.gisMapService.steps.length === 1
        ? GisMapUtils.emptyGuid
        : this.gisMapService.steps.at(-2)!.nodeId;
    const neighbours = TraceDefineUtils.getNeighboursPassingThroughAdjustmentPoints(
      lastId,
      previousNodeId
    );

    switch (neighbours.length) {
      case 0:
        MessageBoxUtils.show(this.dialog, 'Error', [
          {
            message: 'i18n.ft.trace-cannot-be-terminated-by-or-pass-through-RTU',
            bold: false,
            bottomMargin: false
          }
        ]);
        return false;
      case 1:
        if (neighbours[0].node.id !== previousNodeId) return this.justStep(neighbours[0]);
        if (!isButtonPressed) return false;

        MessageBoxUtils.show(this.dialog, 'Information', [
          {
            message: 'i18n.ft.it-s-an-end-node',
            bold: true,
            bottomMargin: false
          },
          {
            message: 'i18n.ft.if-you-need-to-continue-press-step-backward',
            bold: true,
            bottomMargin: false
          }
        ]);

        return false;
      case 2:
        if (previousNodeId === neighbours[0].node.id) {
          return this.justStep(neighbours[1]);
        } else if (previousNodeId === neighbours[1].node.id) {
          return this.justStep(neighbours[0]);
        } else {
          return await this.forkIt(neighbours, previousNodeId);
        }
      default:
        return await this.forkIt(neighbours, previousNodeId);
    }
  }

  private async forkIt(neighbours: Neighbour[], previousNodeId: string): Promise<boolean> {
    const idx = neighbours.findIndex((n) => n.node.id === previousNodeId);
    if (idx !== -1) {
      neighbours[idx].previous = true;
    }

    // выбрать узел из соседних
    // вернет null если отказался от выбора
    const indexOfSelectedNode = await this.selectNeighbour(neighbours);
    if (indexOfSelectedNode === null) {
      const lastId = this.gisMapService.steps.at(-1)!.nodeId;
      this.gisMapService.setHighlightNode(lastId);
      return false;
    }

    // выбрать оборудование из имеющегося в узле (можно редактировать название и каб запас существующего оборудования )
    // вернет GUID.empty если не включать в трассу никакое оборудование
    // вернет null если отказался от выбора (значит отказался от уже выбранного узла)
    const equipmentId = await TraceEquipmentUtil.selectEquipment(
      neighbours[indexOfSelectedNode].node,
      false
    );
    this.spinning.next(true);
    if (equipmentId === null) {
      const lastId = this.gisMapService.steps.at(-1)!.nodeId;
      this.gisMapService.setHighlightNode(lastId);
      this.spinning.next(false);
      return false;
    }

    const neighbour = neighbours[indexOfSelectedNode];
    this.addAndHighlighStep(neighbour, equipmentId);
    this.spinning.next(false);
    return true;
  }

  private createStepModel(neighbour: Neighbour, equipmentId: string): StepModel {
    const node = neighbour.node;
    const equipmentTitle =
      equipmentId === GisMapUtils.emptyGuid
        ? ''
        : this.gisMapService.getGeoData().equipments.find((e) => e.id === equipmentId)!.title;
    const stepModel = new StepModel();
    stepModel.nodeId = node.id;
    stepModel.equipmentId = equipmentId;
    // prettier-ignore
    stepModel.title =
      node.title === ''
        ? equipmentTitle === ''
          ? this.ts.instant('i18n.ft.noname-node')
          : '/ ' + equipmentTitle
        : equipmentTitle === ''
          ? node.title
          : node.title + ' / ' + equipmentTitle;
    stepModel.fiberIds = neighbour.fiberIds;
    return stepModel;
  }

  private async selectNeighbour(neighbours: Neighbour[]): Promise<number | null> {
    const buttons = new Array<RadioButton>();
    for (let i = 0; i < neighbours.length; i++) {
      const neighbour = neighbours[i];
      const button = {
        id: i,
        isSelected: i === 0,
        title: neighbour.previous
          ? neighbour.node.title + ' (' + this.ts.instant('i18n.ft.previous') + ')'
          : neighbour.node.title,
        nodeId: neighbour.node.id
      };
      buttons.push(button);
    }

    this.gisMapService.setHighlightNode(neighbours[0].node.id);
    const dialogRef = this.dialog.open(NextStepSelectorComponent, {
      data: { buttons: buttons }
    });
    return <number | null>await firstValueFrom(dialogRef.closed);
  }

  private async justStep(neighbour: Neighbour): Promise<boolean> {
    this.gisMapService.setHighlightNode(neighbour.node.id);

    // выбрать оборудование из имеющегося в узле (можно редактировать название и каб запас существующего оборудования )
    // вернет GUID.empty если не включать в трассу никакое оборудование
    // вернет null если отказался от выбора (значит отказался от уже выбранного узла)
    const equipmentId = await TraceEquipmentUtil.selectEquipment(neighbour.node, false);
    this.spinning.next(true);
    if (equipmentId === null) {
      const lastId = this.gisMapService.steps.at(-1)!.nodeId;
      this.gisMapService.setHighlightNode(lastId);
      this.spinning.next(false);
      return false;
    }
    this.addAndHighlighStep(neighbour, equipmentId);

    this.spinning.next(false);

    // const steps = this.gisMapService.steps;  // зачем эта строка?
    return true;
  }

  private addAndHighlighStep(neighbour: Neighbour, equipmentId: string) {
    const stepModel = this.createStepModel(neighbour, equipmentId);
    this.gisMapService.addStep(stepModel);
    for (let i = 0; i < stepModel.fiberIds.length; i++) {
      const fiberId = stepModel.fiberIds[i];
      const fiber = this.gisMapService.getGeoData().fibers.find((f) => f.id === fiberId)!;
      MapLayersActions.highlightStepThroughFiber(fiber);
    }
  }

  async onStepBackward() {
    // если 1, то мы стоим в RTU,
    // если 2, то сделали 1 шаг из RTU и возвращаться нельзя
    if (this.gisMapService.steps.length < 3) return;

    // шагаем назад в предпоследний узел, поэтому -2
    const backwardNodeId = this.gisMapService.steps.at(-2)!.nodeId;
    const backwardNode = this.gisMapService.getNode(backwardNodeId);
    const neighbour = new Neighbour();
    neighbour.node = backwardNode;
    // а волокна для шага назад лежат в последнем шаге, поэтому -1 и переворачиваем их на случай точек привязки
    neighbour.fiberIds = this.gisMapService.steps.at(-1)!.fiberIds.slice().reverse();

    await this.justStep(neighbour);
  }

  onCancelStep() {
    if (this.gisMapService.steps.length === 1) return;

    const stepToRemove = this.gisMapService.steps.at(-1);
    for (let i = 0; i < stepToRemove!.fiberIds.length; i++) {
      const fiberId = stepToRemove!.fiberIds[i];
      const fiber = this.gisMapService.getGeoData().fibers.find((f) => f.id === fiberId)!;
      MapLayersActions.extinguishLastStepThroughFiber(fiber);
    }

    this.gisMapService.cancelLastStep();
    const last = this.gisMapService.steps.at(-1);
    this.gisMapService.setHighlightNode(last!.nodeId);
  }

  async onApply() {
    if (this.gisMapService.stepList.value.length === 1) return;

    const lastStep = this.gisMapService.stepList.value.at(-1);
    if (lastStep!.equipmentId === GisMapUtils.emptyGuid) {
      MessageBoxUtils.show(this.dialog, 'Error', [
        {
          message: 'i18n.ft.last-node-of-trace-must-contain-some-equipment',
          bold: true,
          bottomMargin: false
        }
      ]);
      return;
    }

    const dialogRef = this.dialog.open(AcceptTraceDialogComponent, {
      data: {}
    });
    const result = <GeoTrace | null>await firstValueFrom(dialogRef.closed);

    if (result) {
      MapLayersActions.extinguishAllFibers();
      MapLayersActions.drawTraceWith(result.id, FiberState.NotJoined);
      this.close();
    }
  }

  async onDiscard() {
    const confirmation = await MessageBoxUtils.show(this.dialog, 'Confirmation', [
      { message: 'i18n.ft.cancel-trace-definition', bold: true, bottomMargin: false }
    ]);
    if (!confirmation) return;

    MapLayersActions.extinguishAllFibers();
    this.close();
  }

  close() {
    this.gisMapService.setHighlightNode(null);
    this.windowService.unregisterWindow(this.rtuId, 'TraceDefine');
  }
}
