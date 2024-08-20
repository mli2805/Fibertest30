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

    public override Task<GetSorSampleResponse> GetSorSample(GetSorSampleRequest request, ServerCallContext context)
    {
        var sorBytes = File.ReadAllBytes(@"assets\samples\dr_sample_1310.sor");
        var sorData = sorBytes.ToSorData();
        var sorDataBuf = sorData.ToSorDataBuf();
        var sorDataBufBytes = sorDataBuf.ToBytes();
        var response = new GetSorSampleResponse { Sor = ByteString.CopyFrom(sorDataBufBytes) };
        return Task.FromResult(response);
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

 
}