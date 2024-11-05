using Iit.Fibertest.Dto;
using Iit.Fibertest.Graph;

namespace Fibertest30.Infrastructure;
public partial class RtuManager
{
    public async Task<OtauAttachedDto> AttachOtau(AttachOtauDto dto)
    {
        var rtu = _writeModel.Rtus.FirstOrDefault(r => r.Id == dto.RtuId);
        if (rtu == null)
            throw new NoSuchTraceException(dto.RtuId.ToString());

        // проверить не занят ли
        if (!_rtuOccupationService.TrySetOccupation(dto.RtuId, RtuOccupation.AttachOrDetachOtau,
                _currentUserService.UserName, out RtuOccupationState? _))
            throw new RtuIsBusyException(dto.RtuId.ToString());

        var rtuDoubleAddress = await _rtuStationsRepository.GetRtuAddresses(dto.RtuId);
        if (rtuDoubleAddress == null)
            throw new NoSuchRtuException(dto.RtuId.ToString());

        var result =
            await _rtuTransmitter.SendCommand<AttachOtauDto, OtauAttachedDto>(dto, rtuDoubleAddress);

        // освободить рту
        _rtuOccupationService.TrySetOccupation(dto.RtuId, RtuOccupation.None, _currentUserService.UserName,
            out RtuOccupationState? _);

        if (result.ReturnCode != ReturnCode.OtauAttachedSuccessfully)
            return result;

        var cmd = new AttachOtau()
        {
            Id = result.OtauId,
            RtuId = dto.RtuId,
            NetAddress = dto.NetAddress.Clone(),
            Serial = result.Serial,
            PortCount = result.PortCount,
            MasterPort = dto.OpticalPort,
            IsOk = result.IsAttached,
        };
        var answer = await _eventStoreService.SendCommand(cmd, _currentUserService.UserName, "");
        return string.IsNullOrEmpty(answer) ? result : new OtauAttachedDto(ReturnCode.Error);
    }

    public async Task<OtauDetachedDto> DetachOtau(DetachOtauDto dto)
    {
        var rtu = _writeModel.Rtus.FirstOrDefault(r => r.Id == dto.RtuId);
        if (rtu == null)
            throw new NoSuchTraceException(dto.RtuId.ToString());

        // проверить не занят ли
        if (!_rtuOccupationService.TrySetOccupation(dto.RtuId, RtuOccupation.AttachOrDetachOtau,
                _currentUserService.UserName, out RtuOccupationState? _))
            throw new RtuIsBusyException(dto.RtuId.ToString());

        var rtuDoubleAddress = await _rtuStationsRepository.GetRtuAddresses(dto.RtuId);
        if (rtuDoubleAddress == null)
            throw new NoSuchRtuException(dto.RtuId.ToString());

        var result =
            await _rtuTransmitter.SendCommand<DetachOtauDto, OtauDetachedDto>(dto, rtuDoubleAddress);

        // освободить рту
        _rtuOccupationService.TrySetOccupation(dto.RtuId, RtuOccupation.None, _currentUserService.UserName,
            out RtuOccupationState? _);

        if (result.ReturnCode != ReturnCode.OtauDetachedSuccessfully)
            return result;

        var otau = _writeModel.Otaus.FirstOrDefault(o => o.Id == dto.OtauId);
        if (otau == null) return new OtauDetachedDto(ReturnCode.Error);
        var cmd = new DetachOtau()
        {
            Id = dto.OtauId,
            RtuId = dto.RtuId,
            OtauIp = dto.NetAddress.Ip4Address,
            TcpPort = dto.NetAddress.Port,
            TracesOnOtau = _writeModel.Traces
                .Where(t => t.OtauPort != null && t.OtauPort.Serial == otau.Serial)
                .Select(t => t.TraceId)
                .ToList(),
        };
        var answer = await _eventStoreService.SendCommand(cmd, _currentUserService.UserName, "");
        return string.IsNullOrEmpty(answer) ? result : new OtauDetachedDto(ReturnCode.Error);
    }
}
