using Microsoft.Extensions.DependencyInjection;
using System.Collections.Concurrent;
using System.Diagnostics;
using System.Reactive.Subjects;

namespace Fibertest30.Application;

public class InAppChannelSender : IInAppChannelSender
{
    private readonly IServiceScopeFactory _serviceScopeFactory;
    private readonly ConcurrentDictionary<string, ConcurrentDictionary<IObserver<INotificationEvent>, byte>> 
        _observers = new();
    
    public InAppChannelSender(
        IServiceScopeFactory serviceScopeFactory)
    {
        _serviceScopeFactory = serviceScopeFactory;
    }

    public async Task Send(MonitoringAlarmEvent alarmEvent, CancellationToken ct)
    {
        using var scope = _serviceScopeFactory.CreateScope();
        var usersRepository = scope.ServiceProvider.GetRequiredService<IUsersRepository>();

        // var notificationRepository = scope.ServiceProvider.GetRequiredService<INotificationRepository>();
        
        // currently all users are notified for monitoring alarms
        // TODO: use notification profile to get the list of users to notify
        var users = await usersRepository.GetAllUsers();
        foreach (var user in users)
        {
            SendNotification(user.User.Id, alarmEvent);
        }
    }
    
    public async Task Send(SystemEvent systemEvent, CancellationToken ct)
    {
        using var scope = _serviceScopeFactory.CreateScope();
        var usersRepository = scope.ServiceProvider.GetRequiredService<IUsersRepository>();
        
        
        var rules = SystemEventSupportedNotificationRules.Map[systemEvent.Type];
        var inAppInternal = rules.ContainsKey(NotificationChannel.InAppInternal);
        var inApp = systemEvent.Level != SystemEventLevel.Internal && rules.ContainsKey(NotificationChannel.InApp);

        Debug.Assert(inAppInternal || inApp, "At least one, inAppInternal or InApp must be enabled");
        
        
        var users = await usersRepository.GetAllUsers();
        foreach (var user in users)
        {
            var sendInAppInternalToMe = inAppInternal && rules[NotificationChannel.InAppInternal]
                                            .HasFlag(NotificationTarget.Me);
            
            var sendInAppInternalToOthers = inAppInternal && rules[NotificationChannel.InAppInternal]
                                            .HasFlag(NotificationTarget.Others);
            
            var isSystemEventEnabledInApp = inApp ;
            
            var sendInAppToMe = isSystemEventEnabledInApp && rules[NotificationChannel.InApp]
                                        .HasFlag(NotificationTarget.Me);
            
            var sendInAppToOthers = isSystemEventEnabledInApp && rules[NotificationChannel.InApp]
                                        .HasFlag(NotificationTarget.Others);
                                        
            
            var me = systemEvent.Source.UserId == user.User.Id;
            
           

            // Second, notify those who are online
            var sendInAppInternal = (me && sendInAppInternalToMe) || (!me && sendInAppInternalToOthers);
            var sendInApp = (me && sendInAppToMe) || (!me && sendInAppToOthers);
            if (sendInAppInternal || sendInApp)
            {
                SendSystemEvent(user.User.Id, systemEvent, sendInAppInternal, sendInApp);
            }           
        }
        
        Debug.WriteLine($"In-app notification for: {systemEvent.Type}");
    }

    private void SendSystemEvent(string userId, SystemEvent systemEvent, bool inAppInternal, bool inApp)
    {
        var notification = new InAppSystemEventNotification
        {
            SystemEvent = systemEvent,
            InAppInternal = inAppInternal,
            InApp = inApp
        };

        SendNotification(userId, notification);
    }
    
    private void SendNotification(string userId, INotificationEvent notificationEvent)
    {
        if (_observers.TryGetValue(userId, out var observersForUser))
        {
            foreach (var observer in observersForUser.Keys)
            {
                observer.OnNext(notificationEvent);
            }
        }
    }

    public DisposableObservable<INotificationEvent> ObserveNotificationEvents(string userId)
    {
        var observer = new ReplaySubject<INotificationEvent>();
        var observersForUser = _observers.GetOrAdd
            (userId, _ => new ConcurrentDictionary<IObserver<INotificationEvent>, byte>());
        observersForUser.TryAdd(observer, 0); 

        return new DisposableObservable<INotificationEvent>(observer, () => DisposeObserverForUser(userId, observer));
    }

    private void DisposeObserverForUser(string userId, ReplaySubject<INotificationEvent> observerToDispose)
    {
        if (_observers.TryGetValue(userId, out var observersForUser))
        {
            observersForUser.TryRemove(observerToDispose, out _);
            observerToDispose.OnCompleted();
            observerToDispose.Dispose();
        }
    }
    
    public Task DisposeAllUserObservers(string userId)
    {
        if (_observers.TryGetValue(userId, out var observersForUser))
        {
            foreach (var observerForUser in observersForUser.Keys)
            {
                // remove it before do OnComplete or Dispose, so DisposeObserverForUser won't do anything
                _observers.TryRemove(userId, out _);
                if (observerForUser is ReplaySubject<INotificationEvent> replySubject)
                {
                    replySubject.OnCompleted();
                    replySubject.Dispose();                    
                }
                else
                {
                    Debug.Assert(false, "Observer is not ReplaySubject<InAppEventNotification>");
                }
            }
        }

        return Task.CompletedTask;
    }
    
    public async Task DisposeAllObservers()
    {
        foreach (var userId in _observers.Keys)
        {
            await DisposeAllUserObservers(userId);
        }
    }
}