using Iit.Fibertest.Dto;
using Iit.Fibertest.Graph;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Fibertest30.Infrastructure;
public class RtuDataProcessor
{
    private readonly Model _writeModel;
    private readonly ILogger<RtuDataProcessor> _logger;
    private readonly IServiceScopeFactory _serviceScopeFactory;
    private readonly ProcessedResultsDtoFactory _processedResultsDtoFactory;
    private readonly ISystemEventSender _systemEventSender;

    public RtuDataProcessor(Model writeModel, ILogger<RtuDataProcessor> logger,
        IServiceScopeFactory serviceScopeFactory, ProcessedResultsDtoFactory processedResultsDtoFactory,
        ISystemEventSender systemEventSender)
    {
        _writeModel = writeModel;
        _logger = logger;
        _serviceScopeFactory = serviceScopeFactory;
        _processedResultsDtoFactory = processedResultsDtoFactory;
        _systemEventSender = systemEventSender;
    }

    public async Task ProcessBopStateChanges(BopStateChangedDto dto)
    {
        using var scope = _serviceScopeFactory.CreateScope();
        var rtuStationsRepository = scope.ServiceProvider.GetRequiredService<RtuStationsRepository>();
        if (await rtuStationsRepository.IsRtuExist(dto.RtuId))
            await CheckAndSendBopNetworkEventIfNeeded(dto);
    }

    public async Task ProcessMonitoringResult(MonitoringResultDto dto, CancellationToken ct)
    {
        using var scope = _serviceScopeFactory.CreateScope();
        var rtuStationsRepository = scope.ServiceProvider.GetRequiredService<RtuStationsRepository>();
        if (!await rtuStationsRepository.IsRtuExist(dto.RtuId)) return;

        var rtu = _writeModel.Rtus.FirstOrDefault(r => r.Id == dto.RtuId);
        var trace = _writeModel.Traces.FirstOrDefault(t => t.TraceId == dto.PortWithTrace.TraceId);
        _logger.LogInformation($"Monitoring result for {rtu?.Title} / {trace?.Title}, measured at {dto.TimeStamp:g}");

        // it is not a RtuAccident, it is Measurement
        if ((dto.Reason ^ ReasonToSendMonitoringResult.MeasurementAccidentStatusChanged) != 0)
        {
            var sorFileRepository = scope.ServiceProvider.GetRequiredService<SorFileRepository>();
            var sorId = await sorFileRepository.AddSorBytesAsync(dto.SorBytes);
            if (sorId == -1) return;

            AddMeasurement? addMeasurement = await SaveAddMeasurement(dto, sorId);

            if (addMeasurement != null)
            {
                await _systemEventSender
                    .Send(SystemEventFactory.MeasurementAdded(
                        addMeasurement.SorFileId, addMeasurement.EventRegistrationTimestamp, trace!.Title,
                        trace!.TraceId.ToString(), addMeasurement.EventStatus > EventStatus.JustMeasurementNotAnEvent,
                        addMeasurement.TraceState == FiberState.Ok));

            }

            BopNetworkEvent? bopNetworkEvent = await CheckAndSendBopNetworkIfNeeded(dto);
            if (bopNetworkEvent != null)
                await _systemEventSender.Send(SystemEventFactory.BopNetworkEventAdded(
                    bopNetworkEvent.Ordinal, bopNetworkEvent.EventTimestamp, bopNetworkEvent.OtauIp,
                    bopNetworkEvent.Serial, bopNetworkEvent.IsOk));
        }

        // it is a RtuAccident
        if ((dto.Reason & ReasonToSendMonitoringResult.MeasurementAccidentStatusChanged) != 0)
        {
            // if dto.ReturnCode != ReturnCode.MeasurementEndedNormally - it is an accident
            // if dto.ReturnCode == ReturnCode.MeasurementEndedNormally - restored after accident
            RtuAccident? rtuAccident = await SaveRtuAccidentIfNeeded(dto);
            if (rtuAccident != null)
            {
                var obj = rtuAccident.IsMeasurementProblem ? trace!.Title : rtu!.Title;
                var objId = rtuAccident.IsMeasurementProblem ? trace!.TraceId : rtu!.Id;
                await _systemEventSender.Send(SystemEventFactory.RtuAccidentAdded(
                    rtuAccident.Id, rtuAccident.EventRegistrationTimestamp, obj, obj, rtuAccident.IsGoodAccident));

            }
        }
    }

    private async Task<RtuAccident?> SaveRtuAccidentIfNeeded(MonitoringResultDto dto)
    {
        // RTU initialization cleans RtuAccidents for RTU on server and in RTU queue
        // but let's check once more when RTU sends 'Good' RtuAccident that in DB there is a problem for this trace
        var lastAccident = _writeModel.RtuAccidents.LastOrDefault(a => a.TraceId == dto.PortWithTrace.TraceId);
        if (dto.ReturnCode == ReturnCode.MeasurementEndedNormally
            && (lastAccident == null || lastAccident.IsGoodAccident))
            return null;

        var addRtuAccident = _processedResultsDtoFactory.CreateRtuAccidentCommand(dto);

        using var scope = _serviceScopeFactory.CreateScope();
        var eventStoreService = scope.ServiceProvider.GetRequiredService<IEventStoreService>();
        var result = await eventStoreService.SendCommand(addRtuAccident, "system", "OnServer");
        if (result != null)
            _logger.LogInformation($"SaveRtuAccidentIfNeeded {result}");

        return _writeModel.RtuAccidents.LastOrDefault();
    }

    private async Task<AddMeasurement?> SaveAddMeasurement(MonitoringResultDto dto, int sorId)
    {
        var addMeasurement = _processedResultsDtoFactory.CreateCommand(dto, sorId);
        _logger.LogInformation($"AddMeasurement with state {addMeasurement.TraceState.ToLocalizedString()} for trace {addMeasurement.TraceId}");
        using var scope = _serviceScopeFactory.CreateScope();
        var eventStoreService = scope.ServiceProvider.GetRequiredService<IEventStoreService>();
        var result = await eventStoreService.SendCommand(addMeasurement, "system", "OnServer");

        if (result != null) // Unknown trace or something else
        {
            var sorFileRepository = scope.ServiceProvider.GetRequiredService<SorFileRepository>();
            await sorFileRepository.RemoveSorBytesAsync(sorId);
            return null;
        }

        return addMeasurement;
    }


    // BOP - because MSMQ message about BOP came
    private async Task<BopNetworkEvent?> CheckAndSendBopNetworkEventIfNeeded(BopStateChangedDto dto)
    {
        var otau = _writeModel.Otaus.FirstOrDefault(o =>
            o.NetAddress.Ip4Address == dto.OtauIp && o.NetAddress.Port == dto.TcpPort
        );
        if (otau == null) return null;

        _logger.LogInformation($@"RTU {dto.RtuId.First6()} BOP {otau.NetAddress.ToStringA()} state changed to {dto.IsOk} (because MSMQ message about BOP came)");
        var cmd = new AddBopNetworkEvent()
        {
            EventTimestamp = DateTime.Now,
            RtuId = dto.RtuId,
            Serial = dto.Serial,
            OtauIp = otau.NetAddress.Ip4Address,
            TcpPort = otau.NetAddress.Port,
            IsOk = dto.IsOk,
        };

        return await PersistBopEvent(cmd);
    }

    // BOP - because monitoring result from bop port came
    private async Task<BopNetworkEvent?> CheckAndSendBopNetworkIfNeeded(MonitoringResultDto dto)
    {
        var otau = _writeModel.Otaus.FirstOrDefault(o =>
            o.Serial == dto.PortWithTrace.OtauPort.Serial
        );
        if (otau == null || otau.IsOk) return null;

        _logger.LogInformation($@"RTU {dto.RtuId.First6()} BOP {dto.PortWithTrace.OtauPort.Serial} state changed to OK (because MSMQ message with monitoring result came)");
        var cmd = new AddBopNetworkEvent()
        {
            EventTimestamp = DateTime.Now,
            RtuId = dto.RtuId,
            Serial = dto.PortWithTrace.OtauPort.Serial,
            OtauIp = otau.NetAddress.Ip4Address,
            TcpPort = otau.NetAddress.Port,
            IsOk = true,
        };

        return await PersistBopEvent(cmd);
    }

    private async Task<BopNetworkEvent?> PersistBopEvent(AddBopNetworkEvent cmd)
    {
        using var scope = _serviceScopeFactory.CreateScope();
        var eventStoreService = scope.ServiceProvider.GetRequiredService<IEventStoreService>();
        var result = await eventStoreService.SendCommand(cmd, "system", "OnServer");
        if (!string.IsNullOrEmpty(result)) return null;

        return _writeModel.BopNetworkEvents.LastOrDefault();
    }

    public async Task ProcessRtuNetworkEvent(RtuNetworkEvent dto)
    {
        var cmd = new AddNetworkEvent()
        {
            RtuId = dto.RtuId,
            EventTimestamp = dto.RegisteredAt,
            OnMainChannel = dto.OnMainChannel,
            OnReserveChannel = dto.OnReserveChannel
        };

        using var scope = _serviceScopeFactory.CreateScope();
        var eventStoreService = scope.ServiceProvider.GetRequiredService<IEventStoreService>();
        var result = await eventStoreService.SendCommand(cmd, "system", "OnServer");
        if (!string.IsNullOrEmpty(result)) return;

        var evnt = _writeModel.NetworkEvents.Last();
        var rtu = _writeModel.Rtus.First(r => r.Id == dto.RtuId);

        await _systemEventSender.Send(SystemEventFactory.NetworkEventAdded(
            evnt.Ordinal, evnt.EventTimestamp, rtu.Title, rtu.Id.ToString(),
            dto.OnMainChannel == ChannelEvent.Repaired));
    }
}
