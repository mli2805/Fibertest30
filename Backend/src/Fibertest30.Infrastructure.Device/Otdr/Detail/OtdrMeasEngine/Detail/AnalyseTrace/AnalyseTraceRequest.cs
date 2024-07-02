namespace Fibertest30.Infrastructure.Device.OtdrMeasEngine;

public record AnalyseTraceRequest(byte[] Trace, AnalysisParameters? AnalysisParameters);
