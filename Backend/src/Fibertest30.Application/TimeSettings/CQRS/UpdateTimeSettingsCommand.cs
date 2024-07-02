using MediatR;

namespace Fibertest30.Application;

public record UpdateTimeSettingsCommand(TimeSettings TimeSettings) : IRequest<Unit>;

public class UpdateTimeSettingsCommandHandler : IRequestHandler<UpdateTimeSettingsCommand, Unit>
{
    private readonly IDeviceInfoProvider _deviceInfoProvider;
    private readonly INtpSettingsProvider _ntpSettingsProvider;
    private readonly ISystemEventSender _systemEventSender;
    private readonly ICurrentUserService _currentUserService;

    public UpdateTimeSettingsCommandHandler( IDeviceInfoProvider deviceInfoProvider, 
        INtpSettingsProvider ntpSettingsProvider, 
        ISystemEventSender systemEventSender, ICurrentUserService currentUserService)
    {
        _deviceInfoProvider = deviceInfoProvider;
        _ntpSettingsProvider = ntpSettingsProvider;
        _systemEventSender = systemEventSender;
        _currentUserService = currentUserService;
    }

    public async Task<Unit> Handle(UpdateTimeSettingsCommand request, CancellationToken cancellationToken)
    {
        _deviceInfoProvider.UpdateTimeZone(request.TimeSettings.TimeZone);
        await _ntpSettingsProvider.UpdateNtpSettings(request.TimeSettings.NtpSettings, cancellationToken);

        await _systemEventSender.Send(SystemEventFactory.TimeSettingsUpdated(_currentUserService.UserId!, request.TimeSettings));

        return Unit.Value;
    }
}