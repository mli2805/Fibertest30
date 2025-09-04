using Iit.Fibertest.Dto;
using Iit.Fibertest.Graph;
namespace Fibertest30.Infrastructure;
public partial class RtuManager
{
    public async Task<RequestAnswer> AttachTrace(AttachTraceDto dto)
    {
        var trace = _writeModel.Traces.First(t => t.TraceId == dto.TraceId);
        var rtu = _writeModel.Rtus.FirstOrDefault(r => r.Id == trace.RtuId);
        if (rtu == null)
            throw new NoSuchTraceException(trace.RtuId.ToString());

        // только если у трассы были базовые их надо переслать на рту
        var assignBaseRefsDto = await CreateAssignBaseRefsDto(dto, rtu, trace);
        if (assignBaseRefsDto.BaseRefs.Any())
        {
            // проверить не занят ли
            if (!_rtuOccupationService.TrySetOccupation(trace.RtuId, RtuOccupation.MonitoringSettings,
                    _currentUserService.UserName, out RtuOccupationState? _))
                throw new RtuIsBusyException(trace.RtuId.ToString());

            var rtuDoubleAddress = await _rtuStationsRepository.GetRtuAddresses(trace.RtuId);
            if (rtuDoubleAddress == null)
                throw new NoSuchRtuException(trace.RtuId.ToString());

            BaseRefAssignedDto transferResult =
                await _rtuTransmitter.SendCommand<AssignBaseRefsDto, BaseRefAssignedDto>(assignBaseRefsDto, rtuDoubleAddress);

            // освободить рту
            _rtuOccupationService.TrySetOccupation(trace.RtuId, RtuOccupation.None, _currentUserService.UserName,
                out RtuOccupationState? _);

            if (transferResult.ReturnCode != ReturnCode.BaseRefAssignedSuccessfully)
                return transferResult;
        }

        var cmd = new AttachTrace() { TraceId = dto.TraceId, OtauPortDto = dto.OtauPortDto };
        var answer = await _eventStoreService.SendCommand(cmd, _currentUserService.UserName, dto.ClientIp);
        return string.IsNullOrEmpty(answer) ? new RequestAnswer(ReturnCode.Ok) : new RequestAnswer(ReturnCode.Error);

    }

    private async Task<AssignBaseRefsDto> CreateAssignBaseRefsDto(AttachTraceDto cmd, Rtu rtu, Trace trace)
    {
        var dto = new AssignBaseRefsDto()
        {
            RtuId = trace.RtuId,
            RtuMaker = rtu.RtuMaker,
            OtdrId = rtu.OtdrId,
            TraceId = cmd.TraceId,
            OtauPortDto = cmd.OtauPortDto,
            MainOtauPortDto = cmd.MainOtauPortDto,
            BaseRefs = new List<BaseRefDto>(),
        };

        foreach (var baseRef in _writeModel.BaseRefs.Where(b => b.TraceId == trace.TraceId))
        {
            dto.BaseRefs.Add(new BaseRefDto()
            {
                SorFileId = baseRef.SorFileId,
                Id = baseRef.TraceId,
                BaseRefType = baseRef.BaseRefType,
                Duration = baseRef.Duration,
                SaveTimestamp = baseRef.SaveTimestamp,
                UserName = baseRef.UserName,

                SorBytes = await _sorFileRepository.GetSorBytesAsync(baseRef.SorFileId),
            });
        }

        return dto;
    }

    public async Task<RequestAnswer> DetachTrace(Guid traceId, string clientIp)
    {
        var trace = _writeModel.Traces.FirstOrDefault(t => t.TraceId == traceId);
        if (trace == null)
            throw new NoSuchTraceException(traceId.ToString());

        // в Ft20 мы не разрешаем отключать трассу если она включена в цикл мониторинга и мониторинг идет, оставил такое же поведение
        // если трасса в цикле мониторинга, но мониторинг остановлен, то можно отключить трассу,
        //  в модели трассе убирается флаг isInMonitoringCycle, но на рту она останется в цикле (пока)
        // когда потом пользователь нажмет Автоматический режим - за кадром собираем настройки мониторинга из модели и отправляем

        var сmd = new DetachTrace() { TraceId = traceId };
        var answer = await _eventStoreService.SendCommand(сmd, _currentUserService.UserName, clientIp);

        return string.IsNullOrEmpty(answer)
            ? new RequestAnswer(ReturnCode.Ok)
            : new RequestAnswer(ReturnCode.Error) { ErrorMessage = answer };
    }

    public async Task<RequestAnswer> DetachAllTraces(Guid rtuId, string clientIp)
    {
        var rtu = _writeModel.Rtus.FirstOrDefault(r => r.Id == rtuId);
        if (rtu == null)
            throw new NoSuchRtuException(rtuId.ToString());

        var сmd = new DetachAllTraces() { RtuId = rtuId };
        var answer = await _eventStoreService.SendCommand(сmd, _currentUserService.UserName, clientIp);

        return string.IsNullOrEmpty(answer)
            ? new RequestAnswer(ReturnCode.Ok)
            : new RequestAnswer(ReturnCode.Error) { ErrorMessage = answer };
    }
}
