using Grpc.Core;
using MediatR;
using System.Reactive.Linq;
using System.Reactive.Threading.Tasks;

namespace Fibertest30.Api;

public class CoreService : Core.CoreBase
{
    private readonly ISender _mediator;
    private readonly ICurrentUserService _currentUserService;
    private readonly IDateTime _dateTime;

    public CoreService(
        ISender mediator, 
        ICurrentUserService currentUserService,
        IDateTime dateTime)
    {
        _mediator = mediator;
        _currentUserService = currentUserService;
        _dateTime = dateTime;
    }
    
    public override async Task<DeviceInfoResponse> GetDeviceInfo(DeviceInfoRequest request, ServerCallContext context)
    {
        var deviceInfo = await _mediator.Send(
            new GetDeviceInfoQuery(),
            context.CancellationToken);

        var response = new DeviceInfoResponse
        {
            SerialNumber = deviceInfo.SerialNumber,
            IpV4Address = deviceInfo.IpV4Address,
            Timezone = deviceInfo.Timezone.ToProto(),
            ApiVersion = deviceInfo.ApiVersion,
            SupportedMeasurementParameters = deviceInfo.SupportedMeasurementParameters.ToProto(),
            Otaus = {  deviceInfo.Otaus.Select(x => x.ToProto())  },
            MonitoringPorts = { deviceInfo.MonitoringPorts.Select(x => x.ToProto()) },
            MonitoringTimeSlots = { deviceInfo.MonitoringTimeSlots.Select(x => x.ToProto()) },
            AlarmProfiles = { deviceInfo.AlarmProfiles.Select(x=>x.ToProto()) },
            NotificationSettings = deviceInfo.NotificationSettings.ToProto(),
            ActiveAlarms = { deviceInfo.ActiveAlarms.Select(x => x.ToProto()) },
            NetworkSettings = deviceInfo.NetworkSettings.ToProto(),
            TimeSettings = deviceInfo.TimeSettings.ToProto(),
            PortLabels = { deviceInfo.PortLabels.Select(x => x.ToProto()) }
        };

        return response;
    }
    
    
    public override async Task<GetUserAlarmNotificationsResponse> GetUserAlarmNotifications(GetUserAlarmNotificationsRequest request, ServerCallContext context)
    {
        var alarmEvents = await _mediator.Send(
            new GetUserAlarmNotificationsQuery(),
            context.CancellationToken);

        var response = new GetUserAlarmNotificationsResponse()
        {
            AlarmEvents = { alarmEvents.Select(x => x.ToProto()) }
        };
        
        return response;
    }
    
    public override async Task<DismissUserAlarmNotificationResponse> DismissUserAlarmNotification(DismissUserAlarmNotificationRequest request, ServerCallContext context)
    {
        await _mediator.Send(
            new DismissUserAlarmNotificationCommand(request.AlarmEventId),
            context.CancellationToken);

        var response = new DismissUserAlarmNotificationResponse();
        return response;
    }
    
    public override async Task<DismissUserAlarmNotificationsByLevelResponse> DismissUserAlarmNotificationsByLevel(DismissUserAlarmNotificationsByLevelRequest request, ServerCallContext context)
    {
        await _mediator.Send(
            new DismissUserAlarmNotificationsByLevelCommand(request.AlarmLevel.FromProto()),
            context.CancellationToken);

        var response = new DismissUserAlarmNotificationsByLevelResponse();
        return response;
    }
    
    public override async Task<DismissAllUserAlarmNotificationsResponse> DismissAllUserAlarmNotifications(DismissAllUserAlarmNotificationsRequest request, ServerCallContext context)
    {
        await _mediator.Send(
            new DismissAllUserAlarmNotificationsCommand(),
            context.CancellationToken);

        var response = new DismissAllUserAlarmNotificationsResponse();
        return response;
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

    public override async Task GetSystemMessageStream(GetSystemMessageStreamRequest request, 
        IServerStreamWriter<GetSystemMessageStreamResponse> responseStream,
        ServerCallContext context)
    {
        using var notificationsDisposableObservable = await _mediator.Send(
            new ObserveNotificationsQuery(),
            context.CancellationToken);

        // send current on demand progress at once
        await SendUserCurrentOnDemandProgress(responseStream, context);
        await SendAllBaselineProgress(responseStream, context);

        var notificationsResponseObservable = notificationsDisposableObservable.Observable
            .Select(x =>
            {
                var response = new GetSystemMessageStreamResponse();
                
                if (x is InAppSystemEventNotification inAppSystemEventNotification)
                {
                    response.SystemNotification = inAppSystemEventNotification.ToProto();
                }
                else if (x is Fibertest30.Application.MonitoringAlarmEvent monitoringAlarmEvent)
                {
                    response.AlarmNotification = monitoringAlarmEvent.ToProto();
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

    private async Task SendUserCurrentOnDemandProgress(IServerStreamWriter<GetSystemMessageStreamResponse> responseStream, ServerCallContext context)
    {
        var currentUserOnDemand = await _mediator.Send(new GetUserCurrentOnDemandProgressQuery(),
            context.CancellationToken);

        if (currentUserOnDemand != null)
        {
            var systemEvent =
                SystemEventFactory.OtdrTaskProgress(_currentUserService.UserId!, currentUserOnDemand);
            systemEvent.At = _dateTime.UtcNow;
            
            var notification = new Fibertest30.Application.InAppSystemEventNotification()
            {
                InAppInternal = true,
                InApp = false,
                SystemEvent = systemEvent
            };
            
            var response = new GetSystemMessageStreamResponse()
                { SystemNotification = notification.ToProto() };

            await responseStream.WriteAsync(response, context.CancellationToken);
        }
    }
    
    public async Task SendAllBaselineProgress(IServerStreamWriter<GetSystemMessageStreamResponse> responseStream, ServerCallContext context)
    {
        var progresses = await _mediator.Send(new GetAllBaselineProgressQuery(),
            context.CancellationToken);

        foreach (var progress in progresses)
        {
            var systemEvent =
                SystemEventFactory.OtdrTaskProgress(_currentUserService.UserId!, progress);
            systemEvent.At = _dateTime.UtcNow;
            
            var notification = new Fibertest30.Application.InAppSystemEventNotification()
            {
                InAppInternal = true,
                InApp = false,
                SystemEvent = systemEvent
            };
            
            var response = new GetSystemMessageStreamResponse()
                { SystemNotification = notification.ToProto() };

            await responseStream.WriteAsync(response, context.CancellationToken);
        }
    }

    public override async Task<BlinkOtauResponse> BlinkOsmOtau(BlinkOsmOtauRequest request, ServerCallContext context)
    {
        var success = await _mediator.Send(new BlinkOsmOtauQuery(request.ChainAddress));
        return new BlinkOtauResponse { Success = success };
    }

    public override async Task<BlinkOtauResponse> BlinkOxcOtau(BlinkOxcOtauRequest request, ServerCallContext context)
    {
        var success = await _mediator.Send(new BlinkOxcOtauQuery(request.IpAddress, request.Port));
        return new BlinkOtauResponse { Success = success };
    }

    public override async Task<BlinkOtauResponse> BlinkOtau(BlinkOtauRequest request, ServerCallContext context)
    {
        var success = await _mediator.Send(new BlinkOtauQuery(request.OtauId));
        return new BlinkOtauResponse { Success = success };
    }

    public override async Task<DiscoverOtauResponse> DiscoverOsmOtau(DiscoverOsmOtauRequest request, ServerCallContext context)
    {
        var discoverResult = await _mediator.Send(new DiscoverOsmOtauQuery(request.ChainAddress));

        OtauDiscoverResult grpc = discoverResult.ToProto();
        return new DiscoverOtauResponse
        {
            DiscoverResult = grpc
        };
    }

    public override async Task<DiscoverOtauResponse> DiscoverOxcOtau(DiscoverOxcOtauRequest request, ServerCallContext context)
    {
        var discoverResult = await _mediator.Send(new DiscoverOxcOtauQuery(request.IpAddress, request.Port));
        return new DiscoverOtauResponse
        {
            DiscoverResult = discoverResult.ToProto()
        };
    }

    public override async Task<AddOsmOtauResponse> AddOsmOtau(AddOsmOtauRequest request, ServerCallContext context)
    {
        await _mediator.Send(new AddOsmOtauCommand(request.OcmPortIndex, request.ChainAddress));
        return new AddOsmOtauResponse();
    }

    public override async Task<AddOxcOtauResponse> AddOxcOtau(AddOxcOtauRequest request, ServerCallContext context)
    {
        await _mediator.Send(new AddOxcOtauCommand(request.OcmPortIndex, request.IpAddress, request.Port));
        return new AddOxcOtauResponse();
    }

    public override async Task<UpdateOtauResponse> UpdateOtau(UpdateOtauRequest request, ServerCallContext context)
    {
        await _mediator.Send(new UpdateOtauCommand(request.OtauId, request.Patch.FromProto()));
        return new UpdateOtauResponse();
    }

    public override async Task<GetOtauResponse> GetOtau(GetOtauRequest request, ServerCallContext context)
    {
        var otau = await _mediator.Send(new GetOtauQuery(request.OtauId));
        return new GetOtauResponse(){Otau = otau.ToProto()};
    }

    public override async Task<RemoveOtauResponse> RemoveOtau(RemoveOtauRequest request, ServerCallContext context)
    {
        await _mediator.Send(new RemoveOtauCommand(request.OtauId));
        return new RemoveOtauResponse();
    }
}