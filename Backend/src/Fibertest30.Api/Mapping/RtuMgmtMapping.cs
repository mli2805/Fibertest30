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

    public static Iit.Fibertest.Dto.PortWithTraceDto FromProto(this PortWithTraceDto portDto)
    {
        return new Iit.Fibertest.Dto.PortWithTraceDto()
        {
            TraceId = Guid.Parse(portDto.TraceId),
            OtauPort = portDto.PortOfOtau.FromProto(),
            LastTraceState = portDto.LastTraceState.FromProto(),
            LastRtuAccidentOnTrace = (ReturnCode)portDto.LastRtuAccidentOnTrace,
        };
    }

    public static Iit.Fibertest.Dto.ApplyMonitoringSettingsDto FromProto(this ApplyMonitoringSettingsDto dto)
    {
        return new Iit.Fibertest.Dto.ApplyMonitoringSettingsDto()
        {
            RtuId = Guid.Parse(dto.RtuId),
            RtuMaker = dto.RtuMaker.FromProto(),
            IsMonitoringOn = dto.IsMonitoringOn,

            Timespans = new MonitoringTimespansDto()
            {
                // убедиться что 0 конвертится в Timespan.Zero
                PreciseMeas = TimeSpan.FromHours(dto.PreciseMeas),
                PreciseSave = TimeSpan.FromHours(dto.PreciseSave),
                FastSave = TimeSpan.FromHours(dto.FastSave),
            },

            Ports = dto.Ports.Select(p=>p.FromProto()).ToList(),
        };
    }

    public static RequestAnswer ToProto(this Iit.Fibertest.Dto.RequestAnswer requestAnswer)
    {
        return new RequestAnswer()
        {
            ReturnCode = (int)requestAnswer.ReturnCode,
            ErrorMessage = requestAnswer.ErrorMessage ?? "",
        };
    }

    public static Iit.Fibertest.Dto.AssignBaseRefsDto FromProto(this AssignBaseRefsDto dto)
    {
        var result = new Iit.Fibertest.Dto.AssignBaseRefsDto()
        {
            RtuId = Guid.Parse(dto.RtuId),
            RtuMaker = dto.RtuMaker.FromProto(),

            TraceId = Guid.Parse(dto.TraceId),

            BaseRefs = dto.BaseRefFiles.Where(b=> b.HasFileBytes || b.IsForDelete).Select(f=> f.FromProto()).ToList(),
            DeleteOldSorFileIds = dto.DeleteSors.ToList()
        };

        if (dto.PortOfOtau != null)
        {
            result.OtauPortDto = dto.PortOfOtau.FromProto();
        }
        return result;
    }

    public static BaseRefsAssignedDto ToProto(this BaseRefAssignedDto dto)
    {
        var result = new BaseRefsAssignedDto()
        {
            ReturnCode = (int)dto.ReturnCode,
          
            BaseRefType = dto.BaseRefType.ToProto(),
            Nodes = dto.Nodes,
            Equipments = dto.Equipments,
            Landmarks = dto.Landmarks,
        };
        if (dto.WaveLength != null)
            result.WaveLength = dto.WaveLength;
        return result;
    }

    private static BaseRefDto FromProto(this BaseRefFile dto)
    {
        BaseRefDto baseRefDto = new BaseRefDto()
        {
            BaseRefType = dto.BaseRefType.FromProto(), 
        };
        if (dto.HasFileBytes)
        {
            baseRefDto.SorBytes = dto.FileBytes.ToByteArray();
        }

        baseRefDto.Id = dto.IsForDelete ? Guid.Empty : Guid.NewGuid();

        return baseRefDto;
    }
}