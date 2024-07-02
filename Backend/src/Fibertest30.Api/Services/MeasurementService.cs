using Google.Protobuf;
using Grpc.Core;
using MediatR;
using Optixsoft.SorExaminer;
using Optixsoft.SorFormat.Protobuf;

namespace Fibertest30.Api;

public class MeasurementService : Measurement.MeasurementBase
{
    private readonly ILogger<MeasurementService> _logger;
    private readonly ISender _mediator;

    public MeasurementService(ILogger<MeasurementService> logger, ISender mediator)
    {
        _logger = logger;
        _mediator = mediator;
    }

    public override async Task<StartOnDemandResponse> StartOnDemand(StartOnDemandRequest request, ServerCallContext context)
    {
        var measurementSettings = request.MeasurementSettings.FromProto();
        var onDemandId = await _mediator.Send(
            new StartOnDemandCommand(request.MonitoringPortId, measurementSettings),
            context.CancellationToken);

        return new StartOnDemandResponse { OnDemandId = onDemandId };
    }

    public override async Task<StopOnDemandResponse> StopOnDemand(StopOnDemandRequest request, ServerCallContext context)
    {
        await _mediator.Send(
            new StopOnDemandCommand(request.OnDemandId),
            context.CancellationToken);

        return new StopOnDemandResponse();
    }

    public override async Task<GetOnDemandProgressTraceResponse>
        GetOnDemandProgressTrace(GetOnDemandProgressTraceRequest request, ServerCallContext context)
    {
        var trace = await _mediator.Send(
            new GetOnDemandProgressTraceQuery(request.OnDemandId),
            context.CancellationToken);

        var response = new GetOnDemandProgressTraceResponse();
        if (trace != null)
        {
            response.Sor = ProtoUtils.MeasurementTraceToSorByteString(trace);
        }

        return response;
    }

    public override Task<GetSorSampleResponse> GetSorSample(GetSorSampleRequest request, ServerCallContext context)
    {
        var sorBytes = File.ReadAllBytes(@"assets\samples\dr_sample_1310.sor");
        var sorData = sorBytes.ToSorData();
        var sorDataBuf = sorData.ToSorDataBuf();
        var sorDataBufBytes = sorDataBuf.ToBytes();
        var response = new GetSorSampleResponse { Sor = ByteString.CopyFrom(sorDataBufBytes) };
        return Task.FromResult(response);
    }

    public override async Task<SetMonitoringPortStatusResponse> SetMonitoringPortStatus
        (SetMonitoringPortStatusRequest request, ServerCallContext context)
    {
        await _mediator.Send(
            new SetMonitoringPortStatusCommand(request.MonitoringPortId,
                (Fibertest30.Application.MonitoringPortStatus)request.Status),
            context.CancellationToken);

        return new SetMonitoringPortStatusResponse();
    }

    public override async Task<SetMonitoringPortScheduleResponse> SetMonitoringPortSchedule(
        SetMonitoringPortScheduleRequest request, ServerCallContext context)
    {
        await _mediator.Send(new SetMonitoringPortScheduleCommand(request.MonitoringPortId,
                (Application.MonitoringSchedulerMode)request.Schedule.SchedulerMode,
                request.Schedule.Interval.ToTimeSpan(), request.Schedule.TimeSlotIds.ToList()),
            context.CancellationToken);

        return new SetMonitoringPortScheduleResponse();
    }

    public override async Task<SetPortAlarmProfileResponse> SetPortAlarmProfile(
        SetPortAlarmProfileRequest request, ServerCallContext context)
    {
        await _mediator.Send(new SetPortAlarmProfileCommand(request.MonitoringPortId, 
            request.AlarmProfileId), context.CancellationToken);

        return new SetPortAlarmProfileResponse();
    }

    public override async Task<SetMonitoringPortNoteResponse> SetMonitoringPortNote(SetMonitoringPortNoteRequest request, ServerCallContext context)
    {
        await _mediator.Send(new SetMonitoringPortNoteCommand(request.MonitoringPortId, 
            request.Note), context.CancellationToken);

        return new SetMonitoringPortNoteResponse();
    }

    public override async Task<GetMonitoringPortResponse> GetMonitoringPort(GetMonitoringPortRequest request, ServerCallContext context)
    {
        var monitoringPort = await _mediator.Send(
             new GetMonitoringPortQuery(request.MonitoringPortId),
             context.CancellationToken);

        return new GetMonitoringPortResponse { MonitoringPort = monitoringPort.ToProto() };
    }

    public override async Task<GetOtauMonitoringPortsResponse>
        GetOtauMonitoringPorts(GetOtauMonitoringPortsRequest request, ServerCallContext context)
    {
        var ports = await _mediator.Send(
            new GetOtauMonitoringPortsQuery(request.OtauId),
            context.CancellationToken);

        return new GetOtauMonitoringPortsResponse
        {
            MonitoringPorts = { ports.Select(x => x.ToProto()) }
        };
    }

    public override async Task<StartBaselineSetupResponse> StartBaselineSetup(
        StartBaselineSetupRequest request,
        ServerCallContext context)
    {
        await _mediator.Send(
            new StartBaselineSetupCommand(
                request.MonitoringPortId, request.FullAutoMode, request.MeasurementSettings?.FromProto()),
            context.CancellationToken);

        return new StartBaselineSetupResponse();
    }

    public override async Task<StopBaselineSetupResponse> StopBaselineSetup(StopBaselineSetupRequest request, ServerCallContext context)
    {
        await _mediator.Send(
            new StopBaselineSetupCommand(request.MonitoringPortId),
            context.CancellationToken);

        return new StopBaselineSetupResponse();
    }

    public override async Task<GetBaselineProgressTraceResponse> GetBaselineProgressTrace(GetBaselineProgressTraceRequest request, ServerCallContext context)
    {
        var trace = await _mediator.Send(
            new GetBaselineProgressTraceQuery(request.TaskId),
            context.CancellationToken);

        var response = new GetBaselineProgressTraceResponse();
        if (trace != null)
        {
            response.Sor = ProtoUtils.MeasurementTraceToSorByteString(trace);
        }

        return response;
    }

    public override async Task<GetAllAlarmProfilesResponse> GetAllAlarmProfiles(GetAllAlarmProfilesRequest request,
        ServerCallContext context)
    {
        var profiles = await _mediator.Send(new GetAllAlarmProfilesQuery(), context.CancellationToken);
        var protoProfiles = profiles.Select(a => a.ToProto());

        return new GetAllAlarmProfilesResponse() { AlarmProfiles = { protoProfiles } };
    }

    public override async Task<UpdateAlarmProfileResponse> UpdateAlarmProfile(UpdateAlarmProfileRequest request, ServerCallContext context)
    {
        var profile = request.AlarmProfile.FromProto();
        await _mediator.Send(new UpdateAlarmProfileCommand(profile), context.CancellationToken);

        return new UpdateAlarmProfileResponse();
    }

    public override async Task<GetAlarmProfileResponse> GetAlarmProfile(GetAlarmProfileRequest request,
        ServerCallContext context)
    {
        var profile = await _mediator.Send(new GetAlarmProfileQuery(request.Id), context.CancellationToken);
        var protoProfile = profile.ToProto();

        return new GetAlarmProfileResponse() { AlarmProfile = protoProfile };
    }

    public override async Task<CreateAlarmProfileResponse> CreateAlarmProfile(CreateAlarmProfileRequest request,
        ServerCallContext context)
    {
        var profile = request.AlarmProfile.FromProto();
        var createdProfileId = await _mediator.Send(new CreateAlarmProfileCommand(profile), context.CancellationToken);
        return new CreateAlarmProfileResponse() { Id = createdProfileId };
    }

    public override async Task<DeleteAlarmProfileResponse> DeleteAlarmProfile(DeleteAlarmProfileRequest request,
            ServerCallContext context)
    {
        await _mediator.Send(new DeleteAlarmProfileCommand(request.AlarmProfileId), context.CancellationToken);

        return new DeleteAlarmProfileResponse();
    }

    public override async Task<UpdateNotificationSettingsResponse> UpdateNotificationSettings(
        UpdateNotificationSettingsRequest request, ServerCallContext context)
    {
        var settings = request.NotificationSettings.FromProto();
        await _mediator.Send(new UpdateNotificationSettingsCommand(settings), context.CancellationToken);

        return new UpdateNotificationSettingsResponse();
    }

    public override async Task<GetNotificationSettingsResponse> GetNotificationSettings(
        GetNotificationSettingsRequest request, ServerCallContext context)
    {
        var settings = await _mediator.Send(new GetNotificationSettingsQuery(), context.CancellationToken);
        var protoSettings = settings.ToProto();
        var response = new GetNotificationSettingsResponse() { NotificationSettings = protoSettings };
        return response;
    }

    public override async Task<TestEmailServerSettingsResponse> TestEmailServerSettings(
        TestEmailServerSettingsRequest request, ServerCallContext context)
    {
        var emailServer = request.EmailServer.FromProto();
        await _mediator.Send(new TestEmailServerSettingsCommand(emailServer), context.CancellationToken);
        return new TestEmailServerSettingsResponse();
    }

    public override async Task<TestTrapReceiverSettingsResponse> TestTrapReceiverSettings(
        TestTrapReceiverSettingsRequest request, ServerCallContext context)
    {
        var trapReceiver = request.TrapReceiver.FromProto();
        await _mediator.Send(new TestTrapReceiverSettingsCommand(trapReceiver), context.CancellationToken);
        return new TestTrapReceiverSettingsResponse();
    }

    public override async Task<GetNetworkSettingsResponse> GetNetworkSettings(GetNetworkSettingsRequest request,
        ServerCallContext context)
    {
        var settings = await _mediator.Send(new GetNetworkSettingsQuery(), context.CancellationToken);
        var protoSettings = settings.ToProto();
        var response = new GetNetworkSettingsResponse() { NetworkSettings = protoSettings };
        return response;
    }

    public override async Task<UpdateNetworkSettingsResponse> UpdateNetworkSettings(
        UpdateNetworkSettingsRequest request,
        ServerCallContext context)
    {
        var settings = request.NetworkSettings.FromProto();
        await _mediator.Send(new UpdateNetworkSettingsCommand(settings), context.CancellationToken);
        return new UpdateNetworkSettingsResponse();
    }

    public override async Task<GetTimeSettingsResponse> GetTimeSettings(GetTimeSettingsRequest request,
        ServerCallContext context)
    {
        var settings = await _mediator.Send(new GetTimeSettingsQuery(), context.CancellationToken);
        var protoSettings = settings.ToProto();
        var response = new GetTimeSettingsResponse() { TimeSettings = protoSettings };
        return response;
    }

    public override async Task<UpdateTimeSettingsResponse> UpdateTimeSettings(UpdateTimeSettingsRequest request,
        ServerCallContext context)
    {
        var settings = request.TimeSettings.FromProto();
        await _mediator.Send(new UpdateTimeSettingsCommand(settings), context.CancellationToken);
        return new UpdateTimeSettingsResponse();
    }
}