using Google.Protobuf;
using Grpc.Core;
using MediatR;

namespace Fibertest30.Api;

public class MeasurementService(ISender mediator) : Measurement.MeasurementBase
{
    public override async Task<GetLogBundleResponse> GetLogBundle(GetLogBundleRequest request, ServerCallContext context)
    {
        var data = await mediator.Send(new GetLogBundleQuery(), context.CancellationToken);
        var response = new GetLogBundleResponse()
        {
            Archive = ByteString.CopyFrom(data)
        };
        return response;
    }


    public override async Task<UpdateNotificationSettingsResponse> UpdateNotificationSettings(
        UpdateNotificationSettingsRequest request, ServerCallContext context)
    {
        var settings = request.NotificationSettings.FromProto();
        await mediator.Send(new UpdateNotificationSettingsCommand(settings), context.CancellationToken);

        return new UpdateNotificationSettingsResponse();
    }

    public override async Task<GetNotificationSettingsResponse> GetNotificationSettings(
        GetNotificationSettingsRequest request, ServerCallContext context)
    {
        var settings = await mediator.Send(new GetNotificationSettingsQuery(), context.CancellationToken);
        var protoSettings = settings.ToProto();
        var response = new GetNotificationSettingsResponse() { NotificationSettings = protoSettings };
        return response;
    }

    public override async Task<TestEmailServerSettingsResponse> TestEmailServerSettings(
        TestEmailServerSettingsRequest request, ServerCallContext context)
    {
        var emailServer = request.EmailServer.FromProto();
        await mediator.Send(new TestEmailServerSettingsCommand(emailServer), context.CancellationToken);
        return new TestEmailServerSettingsResponse();
    }

    public override async Task<TestTrapReceiverSettingsResponse> TestTrapReceiverSettings(
        TestTrapReceiverSettingsRequest request, ServerCallContext context)
    {
        var trapReceiver = request.TrapReceiver.FromProto();
        await mediator.Send(new TestTrapReceiverSettingsCommand(trapReceiver), context.CancellationToken);
        return new TestTrapReceiverSettingsResponse();
    }

 
}