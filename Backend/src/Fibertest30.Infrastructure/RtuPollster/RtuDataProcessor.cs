using Iit.Fibertest.Dto;
using Iit.Fibertest.Graph;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Fibertest30.Infrastructure;
public class RtuDataProcessor(Model writeModel, ILogger<RtuDataProcessor> logger,
    IServiceScopeFactory serviceScopeFactory, ProcessedResultsDtoFactory processedResultsDtoFactory,
    ISystemEventSender systemEventSender, IRtuCurrentStateDictionary rtuCurrentStateDictionary)
{
    public async Task ProcessBopStateChanges(BopStateChangedDto dto)
    {
        using var scope = serviceScopeFactory.CreateScope();
        var rtuStationsRepository = scope.ServiceProvider.GetRequiredService<IRtuStationsRepository>();
        if (await rtuStationsRepository.IsRtuExist(dto.RtuId))
            await CheckAndSendBopNetworkEventIfNeeded(dto);
    }

    public async Task ProcessMonitoringResult(MonitoringResultDto dto, CancellationToken ct)
    {
        using var scope = serviceScopeFactory.CreateScope();
        var rtuStationsRepository = scope.ServiceProvider.GetRequiredService<IRtuStationsRepository>();
        if (!await rtuStationsRepository.IsRtuExist(dto.RtuId)) return;

        var rtu = writeModel.Rtus.FirstOrDefault(r => r.Id == dto.RtuId);
        var trace = writeModel.Traces.FirstOrDefault(t => t.TraceId == dto.PortWithTrace.TraceId);
        logger.LogInformation($"Monitoring result for {rtu?.Title} / {trace?.Title}, measured at {dto.TimeStamp:g}");

        // it is not a RtuAccident, it is Measurement
        if ((dto.Reason ^ ReasonToSendMonitoringResult.MeasurementAccidentStatusChanged) != 0)
        {
            var sorFileRepository = scope.ServiceProvider.GetRequiredService<SorFileRepository>();
            var sorId = await sorFileRepository.AddSorBytesAsync(dto.SorBytes);
            if (sorId == -1) return;

            AddMeasurement? addMeasurement = await SaveAddMeasurement(dto, sorId);

            if (addMeasurement != null && addMeasurement.EventStatus > EventStatus.JustMeasurementNotAnEvent)
            {
                await systemEventSender
                    .Send(SystemEventFactory.TraceStateChanged(
                        addMeasurement.SorFileId, addMeasurement.EventRegistrationTimestamp, trace!.TraceId.ToString(),
                        trace!.Title, trace.RtuId.ToString(), addMeasurement.BaseRefType, addMeasurement.TraceState));
            }

            await CheckAndSendBopNetworkIfNeeded(dto);
        }

        // it is a RtuAccident
        if ((dto.Reason & ReasonToSendMonitoringResult.MeasurementAccidentStatusChanged) != 0)
        {
            // if dto.ReturnCode != ReturnCode.MeasurementEndedNormally - it is an accident
            // if dto.ReturnCode == ReturnCode.MeasurementEndedNormally - restored after accident
            RtuAccident? rtuAccident = await SaveRtuAccidentIfNeeded(dto);
            if (rtuAccident != null)
            {
                var objTitle = rtuAccident.IsMeasurementProblem ? trace!.Title : rtu!.Title;
                var objId = rtuAccident.IsMeasurementProblem ? trace!.TraceId : rtu!.Id;
                var rtuId = rtuAccident.IsMeasurementProblem ? trace!.RtuId : rtu!.Id;
                await systemEventSender.Send(SystemEventFactory.AnyTypeAccidentAdded("RtuAccident",
                    rtuAccident.Id, rtuAccident.EventRegistrationTimestamp, objTitle, objId.ToString(), 
                    rtuId.ToString(), rtuAccident.IsGoodAccident));

            }
        }
    }

    private async Task<RtuAccident?> SaveRtuAccidentIfNeeded(MonitoringResultDto dto)
    {
        // RTU initialization cleans RtuAccidents for RTU on server and in RTU queue
        // but let's check once more when RTU sends 'Good' RtuAccident that in DB there is a problem for this trace
        var lastAccident = writeModel.RtuAccidents.LastOrDefault(a => a.TraceId == dto.PortWithTrace.TraceId);
        if (dto.ReturnCode == ReturnCode.MeasurementEndedNormally
            && (lastAccident == null || lastAccident.IsGoodAccident))
            return null;

        var addRtuAccident = processedResultsDtoFactory.CreateRtuAccidentCommand(dto);

        using var scope = serviceScopeFactory.CreateScope();
        var eventStoreService = scope.ServiceProvider.GetRequiredService<IEventStoreService>();
        var result = await eventStoreService.SendCommand(addRtuAccident, "system", "OnServer");
        if (result != null)
            logger.LogInformation($"SaveRtuAccidentIfNeeded {result}");

        return writeModel.RtuAccidents.LastOrDefault();
    }

    private async Task<AddMeasurement?> SaveAddMeasurement(MonitoringResultDto dto, int sorId)
    {
        var addMeasurement = processedResultsDtoFactory.CreateCommand(dto, sorId);
        logger.LogInformation($"AddMeasurement with state {addMeasurement.TraceState.ToLocalizedString()} for trace {addMeasurement.TraceId}");
        using var scope = serviceScopeFactory.CreateScope();
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

    // BOP - т.к. сообщение что не смог переключиться в порт бопа
    private async Task CheckAndSendBopNetworkEventIfNeeded(BopStateChangedDto dto)
    {
        var otau = writeModel.Otaus.FirstOrDefault(o =>
            o.NetAddress.Ip4Address == dto.OtauIp && o.NetAddress.Port == dto.TcpPort
        );
        if (otau == null) return;

        logger.LogInformation($@"RTU {dto.RtuId.First6()} BOP {otau.NetAddress.ToStringA()} state changed to {dto.IsOk} (because MSMQ message about BOP came)");
        var cmd = new AddBopNetworkEvent()
        {
            EventTimestamp = DateTime.Now,
            RtuId = dto.RtuId,
            Serial = dto.Serial,
            OtauIp = otau.NetAddress.Ip4Address,
            TcpPort = otau.NetAddress.Port,
            IsOk = dto.IsOk,
        };

        await PersistBopEventAndSendToClients(cmd);
    }

    // BOP - т.к. результат измерения по порту на бопе
    private async Task CheckAndSendBopNetworkIfNeeded(MonitoringResultDto dto)
    {
        var otau = writeModel.Otaus.FirstOrDefault(o =>
            o.Serial == dto.PortWithTrace.OtauPort.Serial
        );
        if (otau == null || otau.IsOk) return;

        logger.LogInformation($@"RTU {dto.RtuId.First6()} BOP {dto.PortWithTrace.OtauPort.Serial} state changed to OK (because MSMQ message with monitoring result came)");
        var cmd = new AddBopNetworkEvent()
        {
            EventTimestamp = DateTime.Now,
            RtuId = dto.RtuId,
            Serial = dto.PortWithTrace.OtauPort.Serial,
            OtauIp = otau.NetAddress.Ip4Address,
            TcpPort = otau.NetAddress.Port,
            IsOk = true,
        };

        await PersistBopEventAndSendToClients(cmd);
    }

    private async Task PersistBopEventAndSendToClients(AddBopNetworkEvent cmd)
    {
        using var scope = serviceScopeFactory.CreateScope();
        var eventStoreService = scope.ServiceProvider.GetRequiredService<IEventStoreService>();
        var result = await eventStoreService.SendCommand(cmd, "system", "OnServer");
        if (!string.IsNullOrEmpty(result)) return ;

        var bopNetworkEvent = writeModel.BopNetworkEvents.LastOrDefault();
        if (bopNetworkEvent != null)
        {
            var bop = writeModel.Otaus.First(o => o.Serial == bopNetworkEvent.Serial);
            await systemEventSender.Send(SystemEventFactory.AnyTypeAccidentAdded("BopNetworkEvent",
                bopNetworkEvent.Ordinal, bopNetworkEvent.EventTimestamp, bopNetworkEvent.OtauIp,
                bop.Id.ToString(), bop.RtuId.ToString(), bopNetworkEvent.IsOk));
        }
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

        using var scope = serviceScopeFactory.CreateScope();
        var eventStoreService = scope.ServiceProvider.GetRequiredService<IEventStoreService>();
        var result = await eventStoreService.SendCommand(cmd, "system", "OnServer");
        if (!string.IsNullOrEmpty(result)) return;

        var evnt = writeModel.NetworkEvents.Last();
        var rtu = writeModel.Rtus.First(r => r.Id == dto.RtuId);

        await systemEventSender.Send(SystemEventFactory.AnyTypeAccidentAdded("NetworkEvent",
            evnt.Ordinal, evnt.EventTimestamp, rtu.Title, rtu.Id.ToString(), rtu.Id.ToString(),
            dto.OnMainChannel == ChannelEvent.Repaired));
    }

    public void ProcessCurrentRtuState(CurrentMonitoringStepDto dto)
    {
        if (dto.PortWithTraceDto != null && !dto.PortWithTraceDto.OtauPort.IsPortOnMainCharon)
        {
            var otau = writeModel.Otaus.FirstOrDefault(o => o.Serial == dto.PortWithTraceDto.OtauPort.Serial);
            if (otau != null)
            {
                dto.PortWithTraceDto.OtauPort.MainCharonPort = otau.MasterPort;
            }
        }

        rtuCurrentStateDictionary.Set(dto);
    }
}