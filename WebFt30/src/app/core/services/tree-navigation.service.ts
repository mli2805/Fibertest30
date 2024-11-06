import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TreeNavigationService {
  private expandedBranches: string[] = [];

  isBranchExpanded(rtuOrBopId: string) {
    const index = this.expandedBranches.indexOf(rtuOrBopId);
    return index > -1;
  }

  setBranchState(rtuOrBopId: string, isExpanded: boolean) {
    if (isExpanded) {
      this.expandBranch(rtuOrBopId);
    } else {
      this.shrinkBranch(rtuOrBopId);
    }
  }

  private expandBranch(rtuOrBopId: string) {
    const index = this.expandedBranches.indexOf(rtuOrBopId);
    if (index === -1) {
      this.expandedBranches.push(rtuOrBopId);
    }
  }

  private shrinkBranch(rtuOrBopId: string) {
    const index = this.expandedBranches.indexOf(rtuOrBopId);
    if (index > -1) {
      this.expandedBranches.splice(index, 1);
    }
  }
}
