import { MapUtils } from './map.utils';
import { SorReader, SorTrace } from '@veex/sor';
import { LinkMapBase, LinkMapReader } from '@veex/link-map';
import { Color } from '@veex/common';

export class ConvertUtils {
  static otauTypeToString(type: string): string {
    // If use 'RTU' instead of 'OCM' it's hard to understand that it's about OTAU
    // if (type === 'Ocm') {
    //   return 'RTU';
    // }

    return type;
  }

  static async buildSorTrace(data: Uint8Array | null, color: Color | null = null) {
    if (data == null || data.length === 0) {
      return null;
    }

    const sorData = await new SorReader().fromBytes(data!);
    const sorTrace = new SorTrace(sorData, '', false);
    if (color !== null) {
      sorTrace.chart.color = color;
    }
    return sorTrace;
  }

  static async buildLinkMap(data: Uint8Array | null): Promise<LinkMapBase | null> {
    if (data == null || data.length === 0) {
      return null;
    }

    const linkMap = await new LinkMapReader().fromBytes(data);
    return linkMap;
  }

  static toKmOrM(distaceMeters: number | null): string {
    if (distaceMeters || distaceMeters === 0) {
      if (distaceMeters < 1000) {
        let formatted = distaceMeters.toFixed(2);
        formatted = formatted.replace(/\.00$|0+$/, '');
        return `${formatted}m`;
      }

      let formatted = (distaceMeters / 1000).toFixed(3);
      formatted = formatted.replace(/\.000$|0+$/, '');

      return `${formatted}km`;
    }

    return '';
  }

  static taskTypeToString(taskType: 'baseline' | 'monitoring'): string {
    switch (taskType) {
      case 'baseline':
        return 'i18n.common.baseline';
      case 'monitoring':
        return 'i18n.common.monitoring';
      default:
        throw new Error(`Unknown task type ${taskType}`);
    }
  }

  static getStepNameId(stepName: string | null) {
    if (stepName === null) {
      return null;
    }

    switch (stepName.toLowerCase()) {
      case 'detecting':
        return 'i18n.otdr-task-status.detecting';
      case 'fast':
        return 'i18n.otdr-task-status.measuring-fast';
      default:
        return null;
    }
  }
}
