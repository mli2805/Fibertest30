using GrpcPresetSorFieldsRequest = Optixsoft.GrpcOtdr.PresetSorFieldsRequest;

namespace Fibertest30.Infrastructure.Device.OtdrMeasEngine;
public static class PresetSorFieldsExtensions
{
    public static GrpcPresetSorFieldsRequest ToGrpc(this PresetSorFieldsRequest native)
    {
        return new GrpcPresetSorFieldsRequest()
        {
            SupplierParametersSn = "VeEX",
            SupplierParametersOtdr = native.platformSerialNumber,
            IitParametersVpName = "RFTS-400",
            IitParametersVpsn = native.platformSerialNumber
        };
    }

}
