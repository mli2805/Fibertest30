using Iit.Fibertest.Graph;
using MediatR;

namespace Fibertest30.Application;

public record GetDeviceInfoQuery : IRequest<DeviceInfo>;

public class GetDeviceInfoQueryHandler : IRequestHandler<GetDeviceInfoQuery, DeviceInfo>
{
    private readonly INotificationSettingsRepository _notificationSettingsRepository;
    private readonly IVersionProvider _versionProvider;
    private readonly TableProvider _tableProvider;
    private readonly Model _model;
    private readonly ICurrentUserService _currentUserService;

    public GetDeviceInfoQueryHandler(
        INotificationSettingsRepository notificationSettingsRepository,
        IVersionProvider versionProvider,
        TableProvider tableProvider, Model model, ICurrentUserService currentUserService)
    {
        _notificationSettingsRepository = notificationSettingsRepository;
        _versionProvider = versionProvider;
        _tableProvider = tableProvider;
        _model = model;
        _currentUserService = currentUserService;
    }

    public async Task<DeviceInfo> Handle(GetDeviceInfoQuery request, CancellationToken ct)
    {
        var notificationSettings = await _notificationSettingsRepository.GetSettingsWithoutPasswords(ct);

        var userId = _currentUserService.UserId!;
        // временно
        var zoneId = Guid.Empty;
        var rtuTree = _model.GetTree(zoneId).ToList();

        var deviceInfo = new DeviceInfo
        {
            ApiVersion = _versionProvider.GetApiVersion(),
            NotificationSettings = notificationSettings,

            RtuTree = rtuTree,
            HasCurrentEvents = _tableProvider.GetHasCurrentEvents(userId)
        };

        return deviceInfo;
    }
}