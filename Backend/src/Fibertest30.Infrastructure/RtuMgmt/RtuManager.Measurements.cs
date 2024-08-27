using Iit.Fibertest.Dto;

namespace Fibertest30.Infrastructure;
public partial class RtuManager
{
    public async Task<ClientMeasurementStartedDto> StartClientMeasurement(DoClientMeasurementDto dto)
    {
        // проверить не занят ли
        if (!_rtuOccupationService.TrySetOccupation(dto.RtuId, RtuOccupation.MeasurementClient,
                _currentUserService.UserName,
                out RtuOccupationState? _))
            throw new RtuIsBusyException("");

        var rtuDoubleAddress = await _rtuStationsRepository.GetRtuAddresses(dto.RtuId);
        if (rtuDoubleAddress == null)
            throw new NoSuchRtuException("");

        return await _rtuTransmitter.SendCommand<DoClientMeasurementDto, ClientMeasurementStartedDto>(dto, rtuDoubleAddress);
    }
}
