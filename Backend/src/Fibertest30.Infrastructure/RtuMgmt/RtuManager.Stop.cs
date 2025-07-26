using Iit.Fibertest.Dto;
using Iit.Fibertest.Graph;
using Microsoft.Extensions.Logging;

namespace Fibertest30.Infrastructure;
public partial class RtuManager
{
    public async Task<RequestAnswer> StopMonitoring(Guid rtuId)
    {
        // проверить не занят ли
        if (!_rtuOccupationService.TrySetOccupation(rtuId, RtuOccupation.MonitoringSettings,
                _currentUserService.UserName,
                out RtuOccupationState? _))
            throw new RtuIsBusyException("");

        var rtuDoubleAddress = await _rtuStationsRepository.GetRtuAddresses(rtuId);
        if (rtuDoubleAddress == null)
            throw new NoSuchRtuException("");

        var rtu = _writeModel.Rtus.First(r => r.Id == rtuId);
        var dto = new StopMonitoringDto() { RtuId = rtuId, RtuMaker = rtu.RtuMaker };
        RequestAnswer requestAnswer = await _rtuTransmitter.SendCommand<StopMonitoringDto, RequestAnswer>(dto, rtuDoubleAddress);

        // сохранить результат в EventStore
        if (requestAnswer.ReturnCode == ReturnCode.Ok)
        {
            var cmd = new StopMonitoring() { RtuId = rtuId };
            var result = await _eventStoreService.SendCommand(cmd, _currentUserService.UserName, "");
            if (result != null)
            {
                _logger.LogError(result);
            }
        }

        return requestAnswer;
    }

    public async Task<RequestAnswer> InterruptMesasurement(InterruptMeasurementDto dto)
    {
        // проверить не занят ли
        if (!_rtuOccupationService.TrySetOccupation(dto.RtuId, RtuOccupation.MonitoringSettings,
                _currentUserService.UserName,
                out RtuOccupationState? _))
            throw new RtuIsBusyException("");

        var rtuDoubleAddress = await _rtuStationsRepository.GetRtuAddresses(dto.RtuId);
        if (rtuDoubleAddress == null)
            throw new NoSuchRtuException("");

        RequestAnswer requestAnswer = await _rtuTransmitter.SendCommand<InterruptMeasurementDto, RequestAnswer>(dto, rtuDoubleAddress);

        return requestAnswer;
    }
}
