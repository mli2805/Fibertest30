namespace Fibertest30.Infrastructure.Device.OtdrMeasEngine;

public record GetInfoResponse(string Version, List<ModuleInfo> Modules);
