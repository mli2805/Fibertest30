using Iit.Fibertest.Dto;
using Iit.Fibertest.Graph;
using Microsoft.Extensions.Logging;

namespace Fibertest30.Infrastructure;
public partial class RtuManager
{
    public async Task<RequestAnswer> ApplyMonitoringSettings(ApplyMonitoringSettingsDto dto)
    {
        // проверить не занят ли
        if (!_rtuOccupationService.TrySetOccupation(dto.RtuId, RtuOccupation.MonitoringSettings,
                _currentUserService.UserName,
                out RtuOccupationState? _))
            throw new RtuIsBusyException("");

        var rtuDoubleAddress = await _rtuStationsRepository.GetRtuAddresses(dto.RtuId);
        if (rtuDoubleAddress == null)
            throw new NoSuchRtuException("");

        RequestAnswer requestAnswer = 
            await _rtuTransmitter.SendCommand<ApplyMonitoringSettingsDto, RequestAnswer>(dto, rtuDoubleAddress);

        if (requestAnswer.ReturnCode == ReturnCode.InProgress)
        {
            // дождаться результата или таймаута
            requestAnswer = await PollMakLinuxForApplyMonitoringSettingsResult(dto.RtuId, rtuDoubleAddress);
        }

        // получили результат инициализации или вышли по таймауту

        // освободить рту
        _rtuOccupationService.TrySetOccupation(dto.RtuId, RtuOccupation.None, _currentUserService.UserName,
            out RtuOccupationState? _);

        if (requestAnswer.ReturnCode == ReturnCode.MonitoringSettingsAppliedSuccessfully)
        {
            var cmd = new ChangeMonitoringSettings
            {
                RtuId = dto.RtuId,
                PreciseMeas = dto.Timespans.PreciseMeas.GetFrequency(),
                PreciseSave = dto.Timespans.PreciseSave.GetFrequency(),
                FastSave = dto.Timespans.FastSave.GetFrequency(),
                TracesInMonitoringCycle = dto.Ports.Select(p => p.TraceId).ToList(),
                IsMonitoringOn = dto.IsMonitoringOn,
            };

            var resultFromEventStore = await _eventStoreService.SendCommand(cmd, _currentUserService.UserName, dto.ClientIp);
            if (resultFromEventStore != null) 
                _logger.LogDebug(resultFromEventStore);
        }

        return requestAnswer;
    }

    private async Task<RequestAnswer> PollMakLinuxForApplyMonitoringSettingsResult(Guid rtuId, DoubleAddress rtuDoubleAddress)
    {
        var count = 18; // 18 * 5 sec = 90 sec limit
        var requestDto = new GetCurrentRtuStateDto() { RtuId = rtuId, RtuDoubleAddress = rtuDoubleAddress };
        while (--count >= 0)
        {
            await Task.Delay(5000);
            var state = await _rtuTransmitter.GetRtuCurrentState(requestDto);
            if (state.ReturnCode == ReturnCode.D2RHttpError)
                return new RequestAnswer(ReturnCode.FailedToApplyMonitoringSettings);
            if ( state.LastInitializationResult != null)
                return new RequestAnswer(ReturnCode.MonitoringSettingsAppliedSuccessfully);
        }

        return new RequestAnswer(ReturnCode.TimeOutExpired);
    }
}
