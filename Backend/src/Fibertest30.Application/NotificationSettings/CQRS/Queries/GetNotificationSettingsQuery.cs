using MediatR;

namespace Fibertest30.Application;

public record GetNotificationSettingsQuery() : IRequest<NotificationSettings>;

public class GetNotificationSettingsQueryHandler : IRequestHandler<GetNotificationSettingsQuery, NotificationSettings>
{
    private readonly INotificationSettingsRepository _repository;

    public GetNotificationSettingsQueryHandler(INotificationSettingsRepository repository)
    {
        _repository = repository;
    }

    public async Task<NotificationSettings> Handle(GetNotificationSettingsQuery request, CancellationToken cancellationToken)
    {
        return await _repository.GetSettingsWithoutPasswords(cancellationToken);
    }
}