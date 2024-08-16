using Iit.Fibertest.Dto;

namespace Fibertest30.Api;

public static class RtuMgmtMapping
{
    private static Iit.Fibertest.Dto.MeasParamByPosition FromProto(this MeasParamByPosition measParamByPosition)
    {
        return new Iit.Fibertest.Dto.MeasParamByPosition()
        {
            Param = (ServiceFunctionFirstParam)measParamByPosition.Param, Position = measParamByPosition.Position
        };
    }

    public static Iit.Fibertest.Dto.InitializeRtuDto FromProto(this InitializeRtuDto dto)
    {
        return new Iit.Fibertest.Dto.InitializeRtuDto()
        {
            RtuId = Guid.Parse(dto.RtuId), 
            RtuAddresses = dto.RtuAddresses.FromProto()
        };
    }

    public static RtuInitializedDto ToProto(this Iit.Fibertest.Dto.RtuInitializedDto dto)
    {
        return new RtuInitializedDto() { IsInitialized = dto.IsInitialized, };
    }

    public static DoClientMeasurementDto FromProto(this DoMeasurementClientDto dto)
    {
        return new DoClientMeasurementDto()
        {
            RtuId = Guid.Parse(dto.RtuId), 
            OtauPortDto = new List<OtauPortDto>(dto.PortOfOtau.Select(p=>p.FromProto())),
            SelectedMeasParams = new List<Iit.Fibertest.Dto.MeasParamByPosition>(
                dto.MeasParamsByPosition.Select(p=> p.FromProto()))
        };
    }
}