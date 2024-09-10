using Iit.Fibertest.Dto;
using Iit.Fibertest.Graph;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Fibertest30.Infrastructure;
public class PollsterResultProcessor
{
    private readonly Model _writeModel;
    private readonly ILogger<PollsterResultProcessor> _logger;
    private readonly IServiceScopeFactory _serviceScopeFactory;
    private readonly PollsterResultsDtoFactory _pollsterResultsDtoFactory;

    public PollsterResultProcessor(Model writeModel, ILogger<PollsterResultProcessor> logger,
        IServiceScopeFactory serviceScopeFactory, PollsterResultsDtoFactory pollsterResultsDtoFactory)
    {
        _writeModel = writeModel;
        _logger = logger;
        _serviceScopeFactory = serviceScopeFactory;
        _pollsterResultsDtoFactory = pollsterResultsDtoFactory;
    }

    public async Task ProcessBopStateChanges(BopStateChangedDto dto)
    {
        using var scope = _serviceScopeFactory.CreateScope();
        var rtuStationsRepository = scope.ServiceProvider.GetRequiredService<RtuStationsRepository>();
        if (await rtuStationsRepository.IsRtuExist(dto.RtuId))
            await CheckAndSendBopNetworkEventIfNeeded(dto);
    }

    public async Task ProcessMonitoringResult(MonitoringResultDto dto)
    {
        using var scope = _serviceScopeFactory.CreateScope();
        var rtuStationsRepository = scope.ServiceProvider.GetRequiredService<RtuStationsRepository>();
        if (!await rtuStationsRepository.IsRtuExist(dto.RtuId)) return;

        // it is not a RtuAccident, it is Measurement
        if ((dto.Reason ^ ReasonToSendMonitoringResult.MeasurementAccidentStatusChanged) != 0)
        {
            var rtu = _writeModel.Rtus.FirstOrDefault(r => r.Id == dto.RtuId);
            var trace = _writeModel.Traces.FirstOrDefault(t => t.TraceId == dto.PortWithTrace.TraceId);
            _logger.LogInformation($"Monitoring result for {rtu?.Title} / {trace?.Title}, measured at {dto.TimeStamp:g}");
            var sorFileRepository = scope.ServiceProvider.GetRequiredService<SorFileRepository>();
            var sorId = await sorFileRepository.AddSorBytesAsync(dto.SorBytes);
            if (sorId != -1)
                await SaveEventFromDto(dto, sorId);
        }

        // it is a RtuAccident
        if ((dto.Reason & ReasonToSendMonitoringResult.MeasurementAccidentStatusChanged) != 0)
        {
            // if dto.ReturnCode != ReturnCode.MeasurementEndedNormally - it is an accident
            // if dto.ReturnCode == ReturnCode.MeasurementEndedNormally - restored after accident
            var accident = await SaveRtuAccidentIfNeeded(dto);
            if (accident == null) return;
            var unused = Task.Factory.StartNew(() => SendNotificationsAboutRtuStatusEvents(accident));
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

        var addRtuAccident = _pollsterResultsDtoFactory.CreateRtuAccidentCommand(dto);

        using var scope = _serviceScopeFactory.CreateScope();
        var eventStoreService = scope.ServiceProvider.GetRequiredService<IEventStoreService>();
        var result = await eventStoreService.SendCommand(addRtuAccident, "system", "OnServer");
        if (result != null)
            _logger.LogInformation($"SaveRtuAccidentIfNeeded {result}");

        var accident = _writeModel.RtuAccidents.Last();

        //TODO send system notification "AddAccident"

        //TODO послать сообщения во внешний мир

        return accident;
    }

    private async Task SaveEventFromDto(MonitoringResultDto dto, int sorId)
    {
        var addMeasurement = _pollsterResultsDtoFactory.CreateCommand(dto, sorId);
        _logger.LogInformation($"AddMeasurement with state {addMeasurement.TraceState.ToLocalizedString()} for trace {addMeasurement.TraceId}");
        using var scope = _serviceScopeFactory.CreateScope();
        var eventStoreService = scope.ServiceProvider.GetRequiredService<IEventStoreService>();
        var result = await eventStoreService.SendCommand(addMeasurement, "system", "OnServer");

        if (result != null) // Unknown trace or something else
        {
            var sorFileRepository = scope.ServiceProvider.GetRequiredService<SorFileRepository>();
            await sorFileRepository.RemoveSorBytesAsync(sorId);
            return;
        }

        //TODO send system notification "AddMeasurement"

        // возможно была авария БОП и тут приходит результат измерения по порту этого БОПа - 
        await CheckAndSendBopNetworkIfNeeded(dto);

        if (addMeasurement.EventStatus > EventStatus.JustMeasurementNotAnEvent && dto.BaseRefType != BaseRefType.Fast)
        {
            var unused = Task.Factory.StartNew(() =>
                SendNotificationsAboutTraces(dto, addMeasurement)); // here we do not wait result
        }
    }

    private void SendNotificationsAboutTraces(MonitoringResultDto dto, AddMeasurement addMeasurement)
    {
        //TODO
        //_snmpNotifier.SendTraceEvent(addMeasurement);
        //_smsManager.SendMonitoringResult(dto);
        //_smtp.SendOpticalEvent(dto, addMeasurement);
    }

    private void SendNotificationsAboutRtuStatusEvents(RtuAccident accident)
    {
        //TODO
        //_snmpNotifier.SendRtuStatusEvent(accident);
        //_smsManager.SendRtuStatusEvent(accident);
        //_smtp.SendRtuStatusEvent(accident);
    }


    // BOP - because MSMQ message about BOP came
    private async Task CheckAndSendBopNetworkEventIfNeeded(BopStateChangedDto dto)
    {
        var otau = _writeModel.Otaus.FirstOrDefault(o =>
            o.NetAddress.Ip4Address == dto.OtauIp && o.NetAddress.Port == dto.TcpPort
        );
        if (otau != null)
        {
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
            await PersistBopEvent(cmd);
        }
    }

    // BOP - because MSMQ message with monitoring result came
    private async Task CheckAndSendBopNetworkIfNeeded(MonitoringResultDto dto)
    {
        var otau = _writeModel.Otaus.FirstOrDefault(o =>
            o.Serial == dto.PortWithTrace.OtauPort.Serial
        );
        if (otau != null && !otau.IsOk)
        {
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
            await PersistBopEvent(cmd);
        }
    }

    private async Task PersistBopEvent(AddBopNetworkEvent cmd)
    {
        using var scope = _serviceScopeFactory.CreateScope();
        var eventStoreService = scope.ServiceProvider.GetRequiredService<IEventStoreService>();
        var result = await eventStoreService.SendCommand(cmd, "system", "OnServer");
        if (string.IsNullOrEmpty(result))
        {
            var bopEvent = _writeModel.BopNetworkEvents.LastOrDefault();
            if (bopEvent == null) return;

            //TODO send system notification "AddBopEvent"

            var unused = Task.Factory.StartNew(() => SendNotificationsAboutBop(bopEvent));
        }
    }

    private void SendNotificationsAboutBop(BopNetworkEvent cmd)
    {
        //_smtp.SendBopState(cmd);
        //_smsManager.SendBopState(cmd);
        //_snmpNotifier.SendBopNetworkEvent(cmd);
    }
}
