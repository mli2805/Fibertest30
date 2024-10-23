using Iit.Fibertest.Dto;
using Iit.Fibertest.Graph;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Collections.Concurrent;

namespace Fibertest30.Infrastructure;

public class RtuLinuxPollster : IRtuLinuxPollster
{
    private readonly ILogger<RtuLinuxPollster> _logger;
    private readonly Model _writeModel;
    private readonly IRtuOccupationService _rtuOccupationService;
    private readonly ISystemEventSender _systemEventSender;
    private readonly IServiceScopeFactory _serviceScopeFactory;
    private readonly IRtuDataDispatcher _rtuDataDispatcher;
    public TaskCompletionSource<bool> ServiceStopped { get; } = new();
    private readonly CancellationTokenSource _cts = new();

    // <ClientMeasurementId, dto>
    private readonly ConcurrentDictionary<Guid, ClientMeasurementResultDto> _clientMeasurements = new();

    public RtuLinuxPollster(ILogger<RtuLinuxPollster> logger, Model writeModel,
        IRtuOccupationService rtuOccupationService,
        ISystemEventSender systemEventSender, IServiceScopeFactory serviceScopeFactory,
        IRtuDataDispatcher rtuDataDispatcher
    )
    {
        _logger = logger;
        _writeModel = writeModel;
        _rtuOccupationService = rtuOccupationService;
        _systemEventSender = systemEventSender;
        _serviceScopeFactory = serviceScopeFactory;
        _rtuDataDispatcher = rtuDataDispatcher;
    }

    public async Task PollRtus(CancellationToken ct)
    {
        while (!ct.IsCancellationRequested)
        {
            // на каждом круге выбираем заново, список может измениться
            var makLinuxRtus = _writeModel.Rtus
                .Where(r => r.MainChannel.Port == (int)TcpPorts.RtuListenToHttp && r.IsInitialized).ToList();
            if (!makLinuxRtus.Any()) await Task.Delay(2000, ct);

            foreach (var makLinuxRtu in makLinuxRtus)
            {
                try
                {
                    await PollRtu(makLinuxRtu, ct);
                }
                catch (Exception e)
                {
                    // логируем внутри процедуры

                }
            }
        }

        ServiceStopped.SetResult(true);
    }

    private async Task PollRtu(Rtu rtu, CancellationToken ct)
    {
        using var scope = _serviceScopeFactory.CreateScope();
        var rtuStationsRepository = scope.ServiceProvider.GetRequiredService<RtuStationsRepository>();
        var station = await rtuStationsRepository.GetRtuStation(rtu.Id);  // при каждом запросе вычитываем из БД
        if (station == null) return;

        var makLinuxRtuTransmitter = scope.ServiceProvider.GetRequiredService<IRtuTransmitter>();
        var state = await makLinuxRtuTransmitter.GetRtuCurrentState(BuildRequest(station));

        if (!(await SaveConnectionResult(state, rtu, station, rtuStationsRepository, ct))
            || state.LastInitializationResult?.Result == null) return;

        // просто кладем в Channel
        await ApplyMonitoringResults(state.MonitoringResultDtos, ct);
        await ApplyBopEvents(state.BopStateChangedDtos, ct);

        // обрабатываем прямо отсюда, вся обработка в том чтобы ждать пока клиент заберет, как-нибудь потом
        _ = Task.Factory.StartNew(() => ProcessMeasurementClientResults(state.ClientMeasurementResultDtos, rtu), ct);

        // await NotifyUserCurrentMonitoringStep(state.CurrentStepDto);
    }

    private GetCurrentRtuStateDto BuildRequest(RtuStation station)
    {
        return new GetCurrentRtuStateDto
        {
            RtuId = station.RtuGuid,
            RtuDoubleAddress = station.GetRtuDoubleAddress(),
            LastMeasurementTimestamp = station.LastMeasurementTimestamp // при каждом запросе вычитываем из БД
        };
    }

    #region Применение полученных результатов
    private async Task ApplyMonitoringResults(List<MonitoringResultDto> dtos, CancellationToken ct)
    {
        if (dtos.Count > 0)
            _logger.LogInformation($"{dtos.Count} monitoring results received");

        foreach (var dto in dtos)
        {
            await _rtuDataDispatcher.Send(dto, ct);
        }
    }
    private async Task ApplyBopEvents(List<BopStateChangedDto> dtos, CancellationToken ct)
    {
        if (dtos.Count > 0)
            _logger.LogInformation($"{dtos.Count} bop events received");

        foreach (var dto in dtos)
        {
            await _rtuDataDispatcher.Send(dto, ct);
        }
    }
    private async Task ProcessMeasurementClientResults(List<ClientMeasurementResultDto> dtos, Rtu rtu)
    {
        if (dtos.Count > 0)
            _logger.LogInformation($"{dtos.Count} measurement(Client) results received");

        foreach (var dto in dtos)
        {
            using var scope = _serviceScopeFactory.CreateScope();
            var userRepository = scope.ServiceProvider.GetRequiredService<IUsersRepository>();
            var user = await userRepository.GetUser(dto.ConnectionId);

            _logger.LogInformation($"Process measurement(Client) {dto.ClientMeasurementId.First6()} for user {user.User.UserName}");

            _clientMeasurements.TryAdd(dto.ClientMeasurementId, dto);

            await _systemEventSender.Send(
                SystemEventFactory.MeasurementClientDone(dto.ConnectionId, dto.ClientMeasurementId));

            // освободить рту
            _rtuOccupationService.TrySetOccupation(rtu.Id, RtuOccupation.None, user.User.UserName,
                out RtuOccupationState? _);
        }
    }
    public byte[]? GetMeasurementClientSor(Guid measurementClientId)
    {
        return _clientMeasurements.TryGetValue(measurementClientId, out ClientMeasurementResultDto? dto) ? dto.SorBytes : null;
    }
    #endregion



    private async Task<bool> SaveConnectionResult(RtuCurrentStateDto state, Rtu makLinuxRtu,
        RtuStation station, RtuStationsRepository rtuStationsRepository, CancellationToken ct)
    {
        var previousState = station.IsMainAddressOkDuePreviousCheck;
        bool success = state.ReturnCode != ReturnCode.D2RHttpError;
        if (success != previousState)
        {
            var word = success ? "Successfully" : "Failed to";
            _logger.LogInformation($"{word} get {makLinuxRtu.Title} current state. {makLinuxRtu.MainChannel.ToStringA()}");
            // Failed будет записан несколько раз пока State не изменится в БД, иначе надо еще хранить флажок для логирования
        }

        var updateDto = new UpdateRtuStationDto()
        {
            RtuGuid = makLinuxRtu.Id,
            Version = state.LastInitializationResult?.Result.Version ?? station.Version,
            Success = success,
            ConnectedAt = success ? DateTime.Now : null
        };

        if (success)
        {
            updateDto.LastMeasurementTimestamp = state.MonitoringResultDtos.Any()
                ? state.MonitoringResultDtos.OrderByDescending(r => r.TimeStamp).First().TimeStamp
                : null; // если не выкачали никаких измерений ставим NULL

            await rtuStationsRepository.Update(updateDto);

            // если починился канал - шлём ивент
            if (!previousState)
            {
                var dto = BuildRtuNetworkEvent(makLinuxRtu, success);
                await _rtuDataDispatcher.Send(dto, ct);
            }
            // состояние канала в бд сохранится ОК и дальше мы апдейтим время соед, измерения, но ивент не шлём
        }
        else
        {
            if (previousState
             && (DateTime.Now - station.LastConnectionByMainAddressTimestamp).TotalSeconds > 30)
            {
                // если сломался канал, ждём 30 сек, 1 раз пишем в бд, 1 раз шлём ивент, больше сюда не попадаем
                await rtuStationsRepository.Update(updateDto);
                var dto = BuildRtuNetworkEvent(makLinuxRtu, success);
                await _rtuDataDispatcher.Send(dto, ct);
            }
        }

        return success;
    }

    private RtuNetworkEvent BuildRtuNetworkEvent(Rtu makLinuxRtu, bool success)
    {
        return new RtuNetworkEvent()
        {
            RtuId = makLinuxRtu.Id,
            RegisteredAt = DateTime.Now,
            OnMainChannel = success ? ChannelEvent.Repaired : ChannelEvent.Broken
        };
    }

    public void StopService()
    {
        _cts.Cancel();
    }
}

public class RtuNetworkEvent : IDataFromRtu
{
    public Guid RtuId { get; set; }
    public DateTime RegisteredAt { get; set; }
    public ChannelEvent OnMainChannel { get; set; } = ChannelEvent.Nothing;
    public ChannelEvent OnReserveChannel { get; set; } = ChannelEvent.Nothing;
}
