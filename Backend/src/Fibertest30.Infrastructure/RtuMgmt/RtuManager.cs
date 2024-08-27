using Iit.Fibertest.Dto;
using Iit.Fibertest.Graph;
using Microsoft.Extensions.Logging;

namespace Fibertest30.Infrastructure;
public partial class RtuManager : IRtuManager
{
    private readonly ILogger<RtuManager> _logger;
    private readonly IRtuTransmitter _rtuTransmitter;
    private readonly Model _writeModel;
    private readonly IEventStoreService _eventStoreService;
    private readonly RtuStationsRepository _rtuStationsRepository;
    private readonly IRtuOccupationService _rtuOccupationService;
    private readonly ICurrentUserService _currentUserService;

    public RtuManager(ILogger<RtuManager> logger, Model writeModel, 
        IRtuTransmitter rtuTransmitter, IEventStoreService eventStoreService, RtuStationsRepository rtuStationsRepository,
        IRtuOccupationService rtuOccupationService, ICurrentUserService currentUserService)
    {
        _logger = logger;
        _rtuTransmitter = rtuTransmitter;
        _writeModel = writeModel;
        _eventStoreService = eventStoreService;
        _rtuStationsRepository = rtuStationsRepository;
        _rtuOccupationService = rtuOccupationService;
        _currentUserService = currentUserService;
    }

    public Task<RtuConnectionCheckedDto> CheckRtuConnection(NetAddress netAddress, CancellationToken cancellationToken)
    {
        return _rtuTransmitter.CheckRtuConnection(netAddress, cancellationToken);
    }

    public async Task<RtuInitializedDto> InitializeRtuAsync(InitializeRtuDto dto)
    {
        // дозаполнить
        dto = CompleteDto(dto);

        // проверить не занят ли
        if (!_rtuOccupationService.TrySetOccupation(dto.RtuId, RtuOccupation.Initialization, _currentUserService.UserName,
                out RtuOccupationState? _))
            throw new RtuIsBusyException("");

        // отправить
        var rtuInitializedDto = await _rtuTransmitter.SendCommand<InitializeRtuDto, RtuInitializedDto>(dto, dto.RtuAddresses);
        if (rtuInitializedDto.ReturnCode == ReturnCode.InProgress)
        {
            // дождаться результата или таймаута
            rtuInitializedDto = await PollMakLinuxForInitializationResult(dto.RtuId, dto.RtuAddresses);
        }

        // получили результат инициализации или вышли по таймауту

        // освободить рту
        _rtuOccupationService.TrySetOccupation(dto.RtuId, RtuOccupation.None, _currentUserService.UserName,
            out RtuOccupationState? _);
        
        rtuInitializedDto.RtuAddresses = dto.RtuAddresses;
        if (rtuInitializedDto.IsInitialized)
        {
            // пометить в БД время последнего конекта с рту
            await RefreshRtuConnectionTime(rtuInitializedDto);

            // сохранить результат инициализации в EventStore
            await _eventStoreService.SendCommands(
                DtoToCommandList(dto, rtuInitializedDto), _currentUserService.UserName, dto.ClientIp);
        }

        return rtuInitializedDto;
    }

    private InitializeRtuDto CompleteDto(InitializeRtuDto dto)
    {
        var rtu = _writeModel.Rtus.First(r => r.Id == dto.RtuId);
        dto.RtuMaker = rtu.RtuMaker;
        dto.ServerAddresses = new DoubleAddress(); // в случае MakLinux вообще не нужен, все идет от сервера к рту
        dto.IsFirstInitialization = !rtu.IsInitialized;
        dto.Serial = rtu.Serial;
        dto.OwnPortCount = rtu.OwnPortCount;
        dto.Children = rtu.Children;
        return dto;
    }

    private async Task RefreshRtuConnectionTime(RtuInitializedDto rtuInitializedDto)
    {
        try
        {
            var rtuStation = CreateRtuStation(rtuInitializedDto);
            await _rtuStationsRepository.RegisterRtuInitializationResultAsync(rtuStation);
        }
        catch (Exception e)
        {
            rtuInitializedDto.ReturnCode = ReturnCode.Error;
            rtuInitializedDto.ErrorMessage = $"Failed to save RTU in DB: {e.Message}";
        }
    }

    private RtuStation CreateRtuStation(RtuInitializedDto dto)
    {
        var rtuStation = new RtuStation
        {
            RtuGuid = dto.RtuId,
            Version = dto.Version,
            MainAddress = dto.RtuAddresses.Main.GetAddress(),
            MainAddressPort = dto.RtuAddresses.Main.Port,
            LastConnectionByMainAddressTimestamp = DateTime.Now,
            IsMainAddressOkDuePreviousCheck = true,
            IsReserveAddressSet = dto.RtuAddresses.HasReserveAddress,
            LastMeasurementTimestamp = DateTime.Now,
        };
        if (dto.RtuAddresses.HasReserveAddress)
        {
            rtuStation.ReserveAddress = dto.RtuAddresses.Reserve.GetAddress();
            rtuStation.ReserveAddressPort = dto.RtuAddresses.Reserve.Port;
            rtuStation.LastConnectionByReserveAddressTimestamp = DateTime.Now;
        }
        return rtuStation;
    }

    private async Task<RtuInitializedDto> PollMakLinuxForInitializationResult(Guid rtuId, DoubleAddress rtuDoubleAddress)
    {
        await Task.Delay(20000);

        var count = 16; // 20 +  16 * 5 sec = 100 sec limit
        var requestDto = new GetCurrentRtuStateDto { RtuId = rtuId, RtuDoubleAddress = rtuDoubleAddress };
        while (--count >= 0)
        {
            await Task.Delay(5000);
            var state = await _rtuTransmitter.GetRtuCurrentState(requestDto);
            if (state.LastInitializationResult != null)
                return state.LastInitializationResult.Result;
        }

        return new RtuInitializedDto(ReturnCode.TimeOutExpired);
    }
}
