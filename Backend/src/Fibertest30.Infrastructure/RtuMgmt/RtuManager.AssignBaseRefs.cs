using Iit.Fibertest.Dto;
using Iit.Fibertest.Graph;

namespace Fibertest30.Infrastructure;
public partial class RtuManager
{
    public async Task<BaseRefAssignedDto> TransmitBaseRefs(AssignBaseRefsDto dto)
    {
        if (!_rtuOccupationService.TrySetOccupation(dto.RtuId, RtuOccupation.AssignBaseRefs,
                _currentUserService.UserName, out RtuOccupationState? _))
            throw new RtuIsBusyException(dto.RtuId.ToString());

        var rtuDoubleAddress = await _rtuStationsRepository.GetRtuAddresses(dto.RtuId);
        if (rtuDoubleAddress == null)
            throw new NoSuchRtuException(dto.RtuId.ToString());

        return await _rtuTransmitter.SendCommand<AssignBaseRefsDto, BaseRefAssignedDto>(dto, rtuDoubleAddress);
    }

    public async Task<BaseRefAssignedDto> AssignBaseRefs(AssignBaseRefsDto dto)
    {
        var trace = _writeModel.Traces.FirstOrDefault(t => t.TraceId == dto.TraceId);
        if (trace == null)
            throw new NoSuchTraceException(dto.TraceId.ToString());

        // проверит и заполнить длительность измерения для каждой где были байты
        var checkResult = _baseRefsCheckerOnServer.AreBaseRefsAcceptable(dto.BaseRefs, trace);
        if (checkResult.ReturnCode != ReturnCode.BaseRefAssignedSuccessfully)
            return checkResult;

        // if (dto.OtauPortDto != null && // trace attached to the real port => send base to RTU
        // dto.BaseRefs.Any(b=>b.SorBytes != null && b.Id != Guid.Empty )) // there is sorBytes to set
        if (dto.OtauPortDto != null) // trace attached to the real port => send base to RTU
        {
            // проверить не занят ли
            if (!_rtuOccupationService.TrySetOccupation(dto.RtuId, RtuOccupation.AssignBaseRefs,
                    _currentUserService.UserName, out RtuOccupationState? _))
                throw new RtuIsBusyException(dto.RtuId.ToString());

            var rtuDoubleAddress = await _rtuStationsRepository.GetRtuAddresses(dto.RtuId);
            if (rtuDoubleAddress == null)
                throw new NoSuchRtuException(dto.RtuId.ToString());

            BaseRefAssignedDto transferResult =
                await _rtuTransmitter.SendCommand<AssignBaseRefsDto, BaseRefAssignedDto>(dto, rtuDoubleAddress);
            if (transferResult.ReturnCode != ReturnCode.BaseRefAssignedSuccessfully)
                return transferResult;
        }

        var persistResult = await SaveChangesOnServer(dto);
        if (!string.IsNullOrEmpty(persistResult))
            return new BaseRefAssignedDto(ReturnCode.BaseRefAssignmentFailed) { ErrorMessage = persistResult };

        return new BaseRefAssignedDto(ReturnCode.BaseRefAssignedSuccessfully);
    }

    private async Task<string?> SaveChangesOnServer(AssignBaseRefsDto dto)
    {
        var command = new AssignBaseRef { TraceId = dto.TraceId, BaseRefs = new List<BaseRef>() };
        foreach (var baseRefDto in dto.BaseRefs)
        {
            // удаляем старые Sor bytes
            var oldBaseRef = _writeModel.BaseRefs.FirstOrDefault(b =>
                b.TraceId == dto.TraceId && b.BaseRefType == baseRefDto.BaseRefType);
            if (oldBaseRef != null)
                await _sorFileRepository.RemoveSorBytesAsync(oldBaseRef.SorFileId);

            // записываем новые если Id не пустой,
            // если пустой получается, что удалили старый, а новый записывать не надо 
            // получается что поле DeleteOldSorFileIds даже не нужно ?! Свой SorFileId есть у старой BaseRef
            var sorFileId = 0;
            if (baseRefDto.Id != Guid.Empty)
                sorFileId = await _sorFileRepository.AddSorBytesAsync(baseRefDto.SorBytes!);

            var baseRef = new BaseRef
            {
                TraceId = dto.TraceId,

                Id = baseRefDto.Id,
                BaseRefType = baseRefDto.BaseRefType,
                SaveTimestamp = DateTime.Now,
                Duration = baseRefDto.Duration,
                UserName = baseRefDto.UserName,

                SorFileId = sorFileId,
            };
            command.BaseRefs.Add(baseRef);
        }

        // в Модели тоже будут удалены старые BaseRef и если id не пустой созданы новые
        return await _eventStoreService.SendCommand(command, dto.Username, dto.ClientIp);
    }

}
