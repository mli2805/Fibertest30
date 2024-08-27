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
    public TaskCompletionSource<bool> ServiceStopped { get; } = new();
    private readonly CancellationTokenSource _cts = new();

    private readonly Dictionary<Guid, bool> _makLinuxRtuAccess = new();

    // <ClientMeasurementId, dto>
    private readonly ConcurrentDictionary<Guid, ClientMeasurementResultDto> _clientMeasurements = new();

    public RtuLinuxPollster(ILogger<RtuLinuxPollster> logger, Model writeModel,
        IRtuOccupationService rtuOccupationService,
        ISystemEventSender systemEventSender, IServiceScopeFactory serviceScopeFactory
    )
    {
        _logger = logger;
        _writeModel = writeModel;
        _rtuOccupationService = rtuOccupationService;
        _systemEventSender = systemEventSender;
        _serviceScopeFactory = serviceScopeFactory;
    }

    public async Task PollRtus(CancellationToken ct)
    {
        using var cts = CancellationTokenSource.CreateLinkedTokenSource(ct, _cts.Token);
        while (!ct.IsCancellationRequested)
        {
            try
            {
                await AllRtusCycle();
                Thread.Sleep(1_000); // возможно не нужен
            }
            catch (Exception e)
            {
                _logger.LogError("PollRtus failed: {Exception}", e);
            }
        }

        ServiceStopped.SetResult(true);
    }

    private async Task AllRtusCycle()
    {
        var makLinuxRtus = _writeModel.Rtus
            .Where(r => r.MainChannel.Port == (int)TcpPorts.RtuListenToHttp && r.IsInitialized).ToList();
        foreach (var makLinuxRtu in makLinuxRtus)
        {
            try
            {
                await PollRtu(makLinuxRtu);
            }
            catch (Exception)
            {

                // no log! every second all rtus
            }
        }
    }

    private async Task PollRtu(Rtu rtu)
    {
        using var scope = _serviceScopeFactory.CreateScope();
        var rtuStationsRepository = scope.ServiceProvider.GetRequiredService<RtuStationsRepository>();

        var station = await rtuStationsRepository.GetRtuStation(rtu.Id);
        if (station == null) return;

        var requestDto = new GetCurrentRtuStateDto
        {
            RtuId = station.RtuGuid,
            RtuDoubleAddress = station.GetRtuDoubleAddress(),
            LastMeasurementTimestamp = station.LastMeasurementTimestamp
        };

        var makLinuxRtuTransmitter = scope.ServiceProvider.GetRequiredService<IRtuTransmitter>();
        RtuCurrentStateDto state;
        try
        {
            state = await makLinuxRtuTransmitter.GetRtuCurrentState(requestDto);
        }
        catch (Exception)
        {
            return;
        }
        if (!SaveConnectionResult(state, rtu)) return;
        if (state.LastInitializationResult?.Result == null) return;

        await UpdateRtuStation(rtuStationsRepository, rtu, state);

        _ = Task.Factory.StartNew(() => ProcessMonitoringResults(state.MonitoringResultDtos));

        _ = Task.Factory.StartNew(() => ProcessMeasurementClientResults(state.ClientMeasurementResultDtos, rtu));

        _ = Task.Factory.StartNew(() => ProcessBopEvents(state.BopStateChangedDtos));

        // await NotifyUserCurrentMonitoringStep(state.CurrentStepDto);
    }

    private async Task ProcessMonitoringResults(List<MonitoringResultDto> dtos)
    {
        if (dtos.Count > 0)
            _logger.LogInformation($"{dtos.Count} monitoring results received");

        foreach (var dto in dtos)
        {
            await Task.Delay(0);
            //TODO обработать результат мониторинга, то что раньше делал msmqProcessor
        }

    }

    private async Task ProcessMeasurementClientResults(List<ClientMeasurementResultDto> dtos, Rtu rtu)
    {
        if (dtos.Count > 0)
            _logger.LogInformation($"{dtos.Count} measurement(Client) results received");

        foreach (var dto in dtos)
        {
            _logger.LogInformation($"Process measurement(Client) {dto.ClientMeasurementId.First6()} for user {dto.ConnectionId.Substring(0, 6)}");
            _clientMeasurements.TryAdd(dto.ClientMeasurementId, dto);
            await _systemEventSender.Send(
                SystemEventFactory.MeasurementClientDone(dto.ConnectionId, dto.ClientMeasurementId));

            using var scope = _serviceScopeFactory.CreateScope();
            var userRepository = scope.ServiceProvider.GetRequiredService<IUsersRepository>();
            var user = await userRepository.GetUser(dto.ConnectionId);
            // освободить рту
            _rtuOccupationService.TrySetOccupation(rtu.Id, RtuOccupation.None, user.User.UserName,
                out RtuOccupationState? _);
        }
    }

    public byte[]? GetMeasurementClientSor(Guid measurementClientId)
    {
        return _clientMeasurements.TryGetValue(measurementClientId, out ClientMeasurementResultDto? dto) ? dto.SorBytes : null;
    }

    private async Task ProcessBopEvents(List<BopStateChangedDto> dtos)
    {
        if (dtos.Count > 0)
            _logger.LogInformation($"{dtos.Count} bop evetns received");

        foreach (var dto in dtos)
        {
            _logger.LogInformation($"Transmit bop event {dto.OtauIp}:{dto.TcpPort}");
            await Task.Delay(0);
            //TODO обработать события БОП, то что раньше делал msmqProcessor
        }
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
