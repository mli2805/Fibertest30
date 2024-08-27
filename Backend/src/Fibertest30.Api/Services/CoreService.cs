using Grpc.Core;
using MediatR;
using System.Reactive.Linq;
using System.Reactive.Threading.Tasks;

namespace Fibertest30.Api;

public class CoreService : Core.CoreBase
{
    private readonly ISender _mediator;

    public CoreService(ISender mediator)
    {
        _mediator = mediator;
    }
    
    public override async Task<DeviceInfoResponse> GetDeviceInfo(DeviceInfoRequest request, ServerCallContext context)
    {
        var deviceInfo = await _mediator.Send(
            new GetDeviceInfoQuery(),
            context.CancellationToken);

        var response = new DeviceInfoResponse
        {
            ApiVersion = deviceInfo.ApiVersion,
            NotificationSettings = deviceInfo.NotificationSettings.ToProto(),

            Rtus = { deviceInfo.RtuTree.Select(r=>r.ToProto())},
        };

        return response;
    }
    
    

    public override async Task GetSystemMessageStream(GetSystemMessageStreamRequest request, 
        IServerStreamWriter<GetSystemMessageStreamResponse> responseStream,
        ServerCallContext context)
    {
        using var notificationsDisposableObservable = await _mediator.Send(
            new ObserveNotificationsQuery(),
            context.CancellationToken);

        var notificationsResponseObservable = notificationsDisposableObservable.Observable
            .Select(x =>
            {
                var response = new GetSystemMessageStreamResponse();
                
                if (x is InAppSystemEventNotification inAppSystemEventNotification)
                {
                    response.SystemNotification = inAppSystemEventNotification.ToProto();
                }
               
                else
                {
                    throw new NotSupportedException($"Unsupported notification type: {x.GetType()}");
                }

                return Observable.FromAsync(() =>
                    responseStream.WriteAsync(response, context.CancellationToken));
            })

            .Concat();

        // NOTE: DefaultIfEmpty() prevents ToTask to throw "Sequence contains no elements" exception
        // when the observable completes without any values 
        try
        {
            await notificationsResponseObservable.DefaultIfEmpty().ToTask(context.CancellationToken);
        }
        catch (TaskCanceledException)
        {
            // client disconnected, no big deal
        }
    }

    public override async Task<GetUserSystemNotificationsResponse> GetUserSystemNotifications(GetUserSystemNotificationsRequest request, ServerCallContext context)
    {
        var systemEvents = await _mediator.Send(
            new GetUserSystemNotificationsQuery(),
            context.CancellationToken);

        var response = new GetUserSystemNotificationsResponse()
        {
            SystemEvents = { systemEvents.Select(x => x.ToProto()) }
        };
        
        return response;
    }

    public override async Task<DismissUserSystemNotificationResponse> DismissUserSystemNotification(DismissUserSystemNotificationRequest request, ServerCallContext context)
    {
        await _mediator.Send(
            new DismissUserSystemNotificationCommand(request.SystemEventId),
            context.CancellationToken);

        var response = new DismissUserSystemNotificationResponse();
        return response;
    }

    public override async Task<DismissUserSystemNotificationsByLevelResponse> DismissUserSystemNotificationsByLevel(DismissUserSystemNotificationsByLevelRequest request, ServerCallContext context)
    {
        await _mediator.Send(
            new DismissUserSystemNotificationsByLevelCommand(request.SystemEventLevel.FromProto()),
            context.CancellationToken);

        var response = new DismissUserSystemNotificationsByLevelResponse();
        return response;
    }

    public override async Task<DismissAllUserSystemNotificationsResponse> DismissAllUserSystemNotifications(DismissAllUserSystemNotificationsRequest request, ServerCallContext context)
    {
        await _mediator.Send(
            new DismissAllUserSystemNotificationsCommand(),
            context.CancellationToken);

        var response = new DismissAllUserSystemNotificationsResponse();
        return response;
    }

}