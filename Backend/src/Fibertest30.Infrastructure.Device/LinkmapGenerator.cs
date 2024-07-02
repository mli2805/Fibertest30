
using Fibertest30.Infrastructure.Device.OtdrMeasEngine;

namespace Fibertest30.Infrastructure.Device;
public class LinkmapGenerator : ILinkmapGenerator
{
    private readonly OtdrMeasEngine.OtdrMeasEngine _otdrMeasEngine;

    public LinkmapGenerator(OtdrMeasEngine.OtdrMeasEngine otdrMeasEngine)
    {
        _otdrMeasEngine = otdrMeasEngine;
    }

    public async Task<byte[]> GenerateLinkmap(List<byte[]> sors, double? macrobendThreshold)
    {
        var request = new GenerateLinkmapRequest()
        {
            Sors = sors,
            MacrobendThreshold = macrobendThreshold
        };
        var response = await _otdrMeasEngine.GenerateLinkmap(request);
        return response.Linkmap;
    }
}
