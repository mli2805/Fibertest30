import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, inject, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { GraphService } from 'src/app/core/grpc';
import { TraceNode } from 'src/grpc-generated';
import { GisMapService } from '../../gis-map.service';

@Component({
  selector: 'rtu-add-equipment',
  templateUrl: './add-equipment.component.html',
  styleUrls: ['./add-equipment.component.css']
})
export class AddEquipmentComponent {
  public dialogRef: DialogRef<boolean> = inject(DialogRef<boolean>);
  form!: FormGroup;
  nodeInWork!: TraceNode;

  constructor(
    @Inject(DIALOG_DATA) private data: any,
    public gisMapService: GisMapService,
    private graphService: GraphService
  ) {
    const nodeId = data.nodeId;
    const nodeInWork = gisMapService.getNode(nodeId);

    this.form = new FormGroup({
      title: new FormControl(this.nodeInWork.title),
      comment: new FormControl(this.nodeInWork.comment)
    });
  }
}
