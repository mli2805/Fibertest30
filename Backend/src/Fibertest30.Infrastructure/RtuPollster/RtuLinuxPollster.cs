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
    private readonly RtuDataProcessor _rtuDataProcessor;
    public TaskCompletionSource<bool> ServiceStopped { get; } = new();
    private readonly CancellationTokenSource _cts = new();

    private readonly Dictionary<Guid, bool> _makLinuxRtuAccess = new();

    // <ClientMeasurementId, dto>
    private readonly ConcurrentDictionary<Guid, ClientMeasurementResultDto> _clientMeasurements = new();

    public RtuLinuxPollster(ILogger<RtuLinuxPollster> logger, Model writeModel,
        IRtuOccupationService rtuOccupationService,
        ISystemEventSender systemEventSender, IServiceScopeFactory serviceScopeFactory,
        IRtuDataDispatcher rtuDataDispatcher,
        RtuDataProcessor rtuDataProcessor
    )
    {
        _logger = logger;
        _writeModel = writeModel;
        _rtuOccupationService = rtuOccupationService;
        _systemEventSender = systemEventSender;
        _serviceScopeFactory = serviceScopeFactory;
        _rtuDataDispatcher = rtuDataDispatcher;
        _rtuDataProcessor = rtuDataProcessor;
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
                    // логируем если первый раз или прошлый раз был успешный
                    if (!_makLinuxRtuAccess.TryGetValue(makLinuxRtu.Id, out bool previous) || previous)
                    {
                        _logger.LogError($"Failed while polling RTU {makLinuxRtu.Title}: {e}");
                    }
                }
            }
        }

        ServiceStopped.SetResult(true);
    }

    private async Task PollRtu(Rtu rtu, CancellationToken ct)
    {
        var state = await FetchState(rtu);
        if (state == null
            || !SaveConnectionResult(state, rtu)
            || state.LastInitializationResult?.Result == null) return;

        // просто кладем в Channel
        await ApplyMonitoringResults(state.MonitoringResultDtos, ct);
        await ApplyBopEvents(state.BopStateChangedDtos, ct);

        // обрабатываем прямо отсюда, вся обработка в том чтобы ждать пока клиент заберет, как-нибудь потом
        _ = Task.Factory.StartNew(() => ProcessMeasurementClientResults(state.ClientMeasurementResultDtos, rtu), ct);

        // await NotifyUserCurrentMonitoringStep(state.CurrentStepDto);
    }

    private async Task<RtuCurrentStateDto?> FetchState(Rtu rtu)
    {
        using var scope = _serviceScopeFactory.CreateScope();
        var rtuStationsRepository = scope.ServiceProvider.GetRequiredService<RtuStationsRepository>();

        var station = await rtuStationsRepository.GetRtuStation(rtu.Id);
        if (station == null) return null;

        var requestDto = new GetCurrentRtuStateDto
        {
            RtuId = station.RtuGuid,
            RtuDoubleAddress = station.GetRtuDoubleAddress(),
            LastMeasurementTimestamp = station.LastMeasurementTimestamp
        };

        var makLinuxRtuTransmitter = scope.ServiceProvider.GetRequiredService<IRtuTransmitter>();
        // прокинет кастомный exception
        var state = await makLinuxRtuTransmitter.GetRtuCurrentState(requestDto);

        await UpdateRtuStation(rtuStationsRepository, rtu, state);

        return state;
    }

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
            _logger.LogInformation($"{dtos.Count} bop evetns received");

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

    private async Task UpdateRtuStation(RtuStationsRepository rtuStationsRepository, Rtu rtu, RtuCurrentStateDto state)
    {
        var lastMeasurementTimestamp = state.MonitoringResultDtos.Any()
            ? state.MonitoringResultDtos
                .OrderBy(r => r.TimeStamp).Last().TimeStamp
            : DateTime.MinValue;

        var heartbeatDto = new RtuChecksChannelDto
        {
            RtuId = rtu.Id,
            Version = state.LastInitializationResult?.Result.Version ?? "",
            IsMainChannel = true,
            //TODO хрень , получается если в этом запросе не было результатов мониторинга, то сбрасываем timestamp
            LastMeasurementTimestamp = lastMeasurementTimestamp, //DateTime.MinValue means no results received 
        };

        await rtuStationsRepository.RegisterRtuHeartbeatAsync(heartbeatDto);
    }

    private bool SaveConnectionResult(RtuCurrentStateDto state, Rtu makLinuxRtu)
    {
        var success = state.ReturnCode != ReturnCode.D2RHttpError;
        if (!_makLinuxRtuAccess.ContainsKey(makLinuxRtu.Id))
        {
            _makLinuxRtuAccess.Add(makLinuxRtu.Id, success);
        }
        else if (_makLinuxRtuAccess[makLinuxRtu.Id] != success)
        {
            var w = success ? "Successfully" : "Failed to";
            _logger.LogInformation($"{w} GetRtuCurrentState {makLinuxRtu.MainChannel.ToStringA()}");
            _makLinuxRtuAccess[makLinuxRtu.Id] = success;
        }

        return success;
    }

    public void StopService()
    {
        _cts.Cancel();
    }


}
