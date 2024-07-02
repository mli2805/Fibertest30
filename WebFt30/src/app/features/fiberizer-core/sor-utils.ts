import { SorTrace, SorViewerService } from '@veex/sor';

export class SorUtils {
  static setTraceOffset(traces: SorTrace[], sorViewer: SorViewerService) {
    if (traces.length > 1) {
      if (traces[0].sorData.isPon) {
        // special case for PON
        sorViewer.setTracesOffset(0);
        sorViewer.setTraceOffsetMode('original');
      } else {
        // back to default
        sorViewer.setTracesOffset(1);
        sorViewer.setTraceOffsetMode('spanLsa');
      }
    }
  }
}
